import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MOVIES } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const sflix = new MOVIES.SFlix();

  fastify.get('/', {
    schema: {
      description: 'Get SFlix provider info and available routes',
      tags: ['sflix'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the sflix provider: check out the provider's website @ ${sflix.toString.baseUrl}`,
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
      documentation: 'https://docs.consumet.org/#tag/sflix',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for movies or TV shows',
      tags: ['sflix'],
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
          `sflix:${query}:${page}`,
          async () => await sflix.search(query, page ? page : 1),
          REDIS_TTL,
        )
      : await sflix.search(query, page ? page : 1);

    reply.status(200).send(res);
  });

  fastify.get('/spotlight', {
    schema: {
      description: 'Get spotlight/featured movies and TV shows from the homepage',
      tags: ['sflix'],
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
                  type: { type: 'string' },
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
            `sflix:spotlight`,
            async () => await sflix.fetchSpotlight(),
            REDIS_TTL,
          )
        : await sflix.fetchSpotlight();

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
      tags: ['sflix'],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    let res = redis
      ? await cache.fetch(
          redis as Redis,
          `sflix:recent-shows`,
          async () => await sflix.fetchRecentTvShows(),
          REDIS_TTL,
        )
      : await sflix.fetchRecentTvShows();

    reply.status(200).send(res);
  });

  fastify.get('/recent-movies', {
    schema: {
      description: 'Get recent movies',
      tags: ['sflix'],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    let res = redis
      ? await cache.fetch(
          redis as Redis,
          `sflix:recent-movies`,
          async () => await sflix.fetchRecentMovies(),
          REDIS_TTL,
        )
      : await sflix.fetchRecentMovies();

    reply.status(200).send(res);
  });

  fastify.get('/trending', {
    schema: {
      description: 'Get trending movies and/or TV shows',
      tags: ['sflix'],
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'Type of content (tv or movie). If not provided, returns both.', enum: ['tv', 'movie'] },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const type = (request.query as { type: string }).type;
    try {
      if (!type) {
        const res = {
          results: [
            ...(await sflix.fetchTrendingMovies()),
            ...(await sflix.fetchTrendingTvShows()),
          ],
        };
        return reply.status(200).send(res);
      }

      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `sflix:trending:${type}`,
            async () =>
              type === 'tv'
                ? await sflix.fetchTrendingTvShows()
                : await sflix.fetchTrendingMovies(),
            REDIS_TTL,
          )
        : type === 'tv'
          ? await sflix.fetchTrendingTvShows()
          : await sflix.fetchTrendingMovies();

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
      description: 'Get movie or TV show details by ID',
      tags: ['sflix'],
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Media ID' },
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
            `sflix:info:${id}`,
            async () => await sflix.fetchMediaInfo(id),
            REDIS_TTL,
          )
        : await sflix.fetchMediaInfo(id);

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
      description: 'Get streaming sources for an episode',
      tags: ['sflix'],
      querystring: {
        type: 'object',
        properties: {
          episodeId: { type: 'string', description: 'Episode ID' },
          mediaId: { type: 'string', description: 'Media ID' },
          server: { type: 'string', description: 'Streaming server' },
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
            `sflix:watch:${episodeId}:${mediaId}:${server}`,
            async () => await sflix.fetchEpisodeSources(episodeId, mediaId, server),
            REDIS_TTL,
          )
        : await sflix.fetchEpisodeSources(episodeId, mediaId, server);

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
      tags: ['sflix'],
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
            `sflix:servers:${episodeId}:${mediaId}`,
            async () => await sflix.fetchEpisodeServers(episodeId, mediaId),
            REDIS_TTL,
          )
        : await sflix.fetchEpisodeServers(episodeId, mediaId);

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message:
          'Something went wrong. Please try again later. or contact the developers.',
      });
    }
  });

  fastify.get(
    '/country/:country',
    {
      schema: {
        description: 'Get movies/shows by country',
        tags: ['sflix'],
        params: {
          type: 'object',
          properties: {
            country: { type: 'string', description: 'Country code or name' },
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
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const country = (request.params as { country: string }).country;
      const page = (request.query as { page: number }).page ?? 1;
      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `sflix:country:${country}:${page}`,
              async () => await sflix.fetchByCountry(country, page),
              REDIS_TTL,
            )
          : await sflix.fetchByCountry(country, page);

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
      description: 'Get movies/shows by genre',
      tags: ['sflix'],
      params: {
        type: 'object',
        properties: {
          genre: { type: 'string', description: 'Genre name' },
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
            `sflix:genre:${genre}:${page}`,
            async () => await sflix.fetchByGenre(genre, page),
            REDIS_TTL,
          )
        : await sflix.fetchByGenre(genre, page);

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
