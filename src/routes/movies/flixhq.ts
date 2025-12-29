import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MOVIES } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const flixhq = new MOVIES.FlixHQ();

  fastify.get('/', {
    schema: {
      description: 'Get FlixHQ provider info and available routes',
      tags: ['flixhq'],
      response: {
        200: {
          type: 'object',
          properties: {
            intro: { type: 'string' },
            routes: { type: 'array', items: { type: 'string' } },
            documentation: { type: 'string' },
          },
        },
      },
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the flixhq provider: check out the provider's website @ ${flixhq.toString.baseUrl}`,
      routes: [
        '/:query',
        '/info',
        '/watch',
        '/recent-shows',
        '/recent-movies',
        '/trending',
        '/spotlight',
        '/servers',
        '/country/:country',
        '/genre/:genre',
      ],
      documentation: 'https://docs.consumet.org/#tag/flixhq',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for movies or TV shows',
      tags: ['flixhq'],
      params: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = decodeURIComponent((request.params as { query: string }).query);

    const page = (request.query as { page: number }).page;

    let res = redis
      ? await cache.fetch(
          redis as Redis,
          `flixhq:${query}:${page}`,
          async () => await flixhq.search(query, page ? page : 1),
          REDIS_TTL,
        )
      : await flixhq.search(query, page ? page : 1);

    reply.status(200).send(res);
  });

  fastify.get('/spotlight', {
    schema: {
      description: 'Get spotlight/featured movies and TV shows from the homepage',
      tags: ['flixhq'],
      response: {
        200: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  url: { type: 'string' },
                  cover: { type: 'string' },
                  description: { type: 'string' },
                  rating: { type: 'string' },
                  duration: { type: 'string' },
                  genres: { type: 'array', items: { type: 'string' } },
                  type: { type: 'string', enum: ['Movie', 'TV Series'] },
                },
              },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `flixhq:spotlight`,
            async () => await flixhq.fetchSpotlight(),
            REDIS_TTL,
          )
        : await flixhq.fetchSpotlight();

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  fastify.get('/recent-shows', {
    schema: {
      description: 'Get recently added TV shows',
      tags: ['flixhq'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              url: { type: 'string' },
              image: { type: 'string' },
              season: { type: 'string' },
              latestEpisode: { type: 'string' },
              type: { type: 'string' },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    let res = redis
      ? await cache.fetch(
          redis as Redis,
          `flixhq:recent-shows`,
          async () => await flixhq.fetchRecentTvShows(),
          REDIS_TTL,
        )
      : await flixhq.fetchRecentTvShows();

    reply.status(200).send(res);
  });

  fastify.get('/recent-movies', {
    schema: {
      description: 'Get recently added movies',
      tags: ['flixhq'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              url: { type: 'string' },
              image: { type: 'string' },
              releaseDate: { type: 'string' },
              duration: { type: 'string' },
              type: { type: 'string' },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    let res = redis
      ? await cache.fetch(
          redis as Redis,
          `flixhq:recent-movies`,
          async () => await flixhq.fetchRecentMovies(),
          REDIS_TTL,
        )
      : await flixhq.fetchRecentMovies();

    reply.status(200).send(res);
  });

  fastify.get('/trending', {
    schema: {
      description: 'Get trending movies and/or TV shows',
      tags: ['flixhq'],
      querystring: {
        type: 'object',
        properties: {
          type: { 
            type: 'string', 
            enum: ['movie', 'tv'],
            description: 'Filter by type. If not provided, returns both movies and TV shows.',
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const type = (request.query as { type: string }).type;
    try {
      if (!type) {
        const res = {
          results: [
            ...(await flixhq.fetchTrendingMovies()),
            ...(await flixhq.fetchTrendingTvShows()),
          ],
        };
        return reply.status(200).send(res);
      }

      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `flixhq:trending:${type}`,
            async () =>
              type === 'tv'
                ? await flixhq.fetchTrendingTvShows()
                : await flixhq.fetchTrendingMovies(),
            REDIS_TTL,
          )
        : type === 'tv'
          ? await flixhq.fetchTrendingTvShows()
          : await flixhq.fetchTrendingMovies();

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message:
          'Something went wrong. Please try again later. or contact the developers.',
      });
    }
  });

  fastify.get('/info', {
    schema: {
      description: 'Get detailed information about a movie or TV show',
      tags: ['flixhq'],
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Media ID (e.g., movie/watch-black-panther-wakanda-forever-91507)' },
        },
        required: ['id'],
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (typeof id === 'undefined')
      return reply.status(400).send({
        message: 'id is required',
      });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `flixhq:info:${id}`,
            async () => await flixhq.fetchMediaInfo(id),
            REDIS_TTL,
          )
        : await flixhq.fetchMediaInfo(id);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message:
          'Something went wrong. Please try again later. or contact the developers.',
      });
    }
  });

  fastify.get('/watch', {
    schema: {
      description: 'Get streaming sources for an episode/movie',
      tags: ['flixhq'],
      querystring: {
        type: 'object',
        properties: {
          episodeId: { type: 'string', description: 'Episode ID' },
          mediaId: { type: 'string', description: 'Media ID (movie or TV show)' },
          server: { 
            type: 'string', 
            description: 'Streaming server',
            enum: ['UpCloud', 'VidCloud', 'MixDrop'],
          },
        },
        required: ['episodeId', 'mediaId'],
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.query as { episodeId: string }).episodeId;
    const mediaId = (request.query as { mediaId: string }).mediaId;
    const server = (request.query as { server: StreamingServers }).server;

    if (typeof episodeId === 'undefined')
      return reply.status(400).send({ message: 'episodeId is required' });
    if (typeof mediaId === 'undefined')
      return reply.status(400).send({ message: 'mediaId is required' });

    if (server && !Object.values(StreamingServers).includes(server))
      return reply.status(400).send({ message: 'Invalid server query' });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `flixhq:watch:${episodeId}:${mediaId}:${server}`,
            async () => await flixhq.fetchEpisodeSources(episodeId, mediaId, server),
            REDIS_TTL,
          )
        : await flixhq.fetchEpisodeSources(episodeId, mediaId, server);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/servers', {
    schema: {
      description: 'Get available streaming servers for an episode',
      tags: ['flixhq'],
      querystring: {
        type: 'object',
        properties: {
          episodeId: { type: 'string', description: 'Episode ID' },
          mediaId: { type: 'string', description: 'Media ID' },
        },
        required: ['episodeId', 'mediaId'],
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.query as { episodeId: string }).episodeId;
    const mediaId = (request.query as { mediaId: string }).mediaId;

    if (typeof episodeId === 'undefined')
      return reply.status(400).send({ message: 'episodeId is required' });
    if (typeof mediaId === 'undefined')
      return reply.status(400).send({ message: 'mediaId is required' });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `flixhq:servers:${episodeId}:${mediaId}`,
            async () => await flixhq.fetchEpisodeServers(episodeId, mediaId),
            REDIS_TTL,
          )
        : await flixhq.fetchEpisodeServers(episodeId, mediaId);

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message:
          'Something went wrong. Please try again later. or contact the developers.',
      });
    }
  });

  fastify.get('/country/:country', {
    schema: {
      description: 'Get movies and TV shows by country',
      tags: ['flixhq'],
      params: {
        type: 'object',
        properties: {
          country: { type: 'string', description: 'Country name (e.g., united-states, united-kingdom, japan)' },
        },
        required: ['country'],
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
      const country = (request.params as { country: string }).country;
      const page = (request.query as { page: number }).page ?? 1;
      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `flixhq:country:${country}:${page}`,
              async () => await flixhq.fetchByCountry(country, page),
              REDIS_TTL,
            )
          : await flixhq.fetchByCountry(country, page);

        reply.status(200).send(res);
      } catch (error) {
        reply.status(500).send({
          message:
            'Something went wrong. Please try again later. or contact the developers.',
        });
      }
    },
  );

  fastify.get('/genre/:genre', {
    schema: {
      description: 'Get movies and TV shows by genre',
      tags: ['flixhq'],
      params: {
        type: 'object',
        properties: {
          genre: { type: 'string', description: 'Genre name (e.g., action, comedy, drama, sci-fi)' },
        },
        required: ['genre'],
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const genre = (request.params as { genre: string }).genre;
    const page = (request.query as { page: number }).page ?? 1;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `flixhq:genre:${genre}:${page}`,
            async () => await flixhq.fetchByGenre(genre, page),
            REDIS_TTL,
          )
        : await flixhq.fetchByGenre(genre, page);

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message:
          'Something went wrong. Please try again later. or contact the developers.',
      });
    }
  });
};
export default routes;
