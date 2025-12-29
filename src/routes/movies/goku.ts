import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MOVIES } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const goku = new MOVIES.Goku();

  fastify.get('/', {
    schema: {
      description: 'Get Goku provider info and available routes',
      tags: ['goku'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the goku provider: check out the provider's website @ ${goku.toString.baseUrl}`,
      routes: [
        '/:query',
        '/info',
        '/watch',
        '/recent-shows',
        '/recent-movies',
        '/trending',
        '/servers',
        '/country/:country',
        '/genre/:genre',
      ],
      documentation: 'https://docs.consumet.org/#tag/goku',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for movies or TV shows',
      tags: ['goku'],
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
          `goku:${query}:${page}`,
          async () => await goku.search(query, page ? page : 1),
          REDIS_TTL,
        )
      : await goku.search(query, page ? page : 1);

    reply.status(200).send(res);
  });

  fastify.get('/recent-shows', {
    schema: {
      description: 'Get recently added TV shows',
      tags: ['goku'],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    let res = redis
      ? await cache.fetch(
          redis as Redis,
          `goku:recent-shows`,
          async () => await goku.fetchRecentTvShows(),
          REDIS_TTL,
        )
      : await goku.fetchRecentTvShows();

    reply.status(200).send(res);
  });

  fastify.get('/recent-movies', {
    schema: {
      description: 'Get recently added movies',
      tags: ['goku'],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    let res = redis
      ? await cache.fetch(
          redis as Redis,
          `goku:recent-movies`,
          async () => await goku.fetchRecentMovies(),
          REDIS_TTL,
        )
      : await goku.fetchRecentMovies();

    reply.status(200).send(res);
  });

  fastify.get('/trending', {
    schema: {
      description: 'Get trending movies and/or TV shows',
      tags: ['goku'],
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['movie', 'tv'], description: 'Filter by type' },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const type = (request.query as { type: string }).type;
    try {
      if (!type) {
        const res = {
          results: [
            ...(await goku.fetchTrendingMovies()),
            ...(await goku.fetchTrendingTvShows()),
          ],
        };
        return reply.status(200).send(res);
      }

      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `goku:trending:${type}`,
            async () =>
              type === 'tv'
                ? await goku.fetchTrendingTvShows()
                : await goku.fetchTrendingMovies(),
            REDIS_TTL,
          )
        : type === 'tv'
          ? await goku.fetchTrendingTvShows()
          : await goku.fetchTrendingMovies();

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
      tags: ['goku'],
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
            `goku:info:${id}`,
            async () => await goku.fetchMediaInfo(id),
            REDIS_TTL,
          )
        : await goku.fetchMediaInfo(id);

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
      tags: ['goku'],
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
            `goku:watch:${episodeId}:${mediaId}:${server}`,
            async () => await goku.fetchEpisodeSources(episodeId, mediaId, server),
            REDIS_TTL,
          )
        : await goku.fetchEpisodeSources(episodeId, mediaId, StreamingServers.VidCloud);
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/servers', async (request: FastifyRequest, reply: FastifyReply) => {
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
            `goku:servers:${episodeId}:${mediaId}`,
            async () => await goku.fetchEpisodeServers(episodeId, mediaId),
            REDIS_TTL,
          )
        : await goku.fetchEpisodeServers(episodeId, mediaId);

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
    async (request: FastifyRequest, reply: FastifyReply) => {
      const country = (request.params as { country: string }).country;
      const page = (request.query as { page: number }).page ?? 1;
      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `goku:country:${country}:${page}`,
              async () => await goku.fetchByCountry(country, page),
              REDIS_TTL,
            )
          : await goku.fetchByCountry(country, page);

        reply.status(200).send(res);
      } catch (error) {
        reply.status(500).send({
          message:
            'Something went wrong. Please try again later. or contact the developers.',
        });
      }
    },
  );

  fastify.get('/genre/:genre', async (request: FastifyRequest, reply: FastifyReply) => {
    const genre = (request.params as { genre: string }).genre;
    const page = (request.query as { page: number }).page ?? 1;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `goku:genre:${genre}:${page}`,
            async () => await goku.fetchByGenre(genre, page),
            REDIS_TTL,
          )
        : await goku.fetchByGenre(genre, page);

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
