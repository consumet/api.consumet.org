import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MOVIES } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const dramacool = new MOVIES.DramaCool();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the dramacool provider: check out the provider's website @ ${dramacool.toString.baseUrl}`,
      routes: [
        '/:query',
        '/info',
        '/watch',
        '/popular',
        '/recent-movies',
        '/recent-shows',
      ],
      documentation: 'https://docs.consumet.org/#tag/dramacool',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = decodeURIComponent((request.params as { query: string }).query);
      const page = (request.query as { page: number }).page;

      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `dramacool:${query}:${page}`,
            async () => await dramacool.search(query, page),
            REDIS_TTL,
          )
        : await dramacool.search(query, page);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message:
          'Something went wrong. Please try again later. or contact the developers.',
      });
    }
  });

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (typeof id === 'undefined')
      return reply.status(400).send({
        message: 'id is required',
      });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `dramacool:info:${id}`,
            async () => await dramacool.fetchMediaInfo(id),
            REDIS_TTL,
          )
        : await dramacool.fetchMediaInfo(id);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message:
          'Something went wrong. Please try again later. or contact the developers.',
      });
    }
  });

  fastify.get('/watch', async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.query as { episodeId: string }).episodeId;
    const server = (request.query as { server: StreamingServers }).server;

    if (typeof episodeId === 'undefined')
      return reply.status(400).send({ message: 'episodeId is required' });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `dramacool:watch:${episodeId}:${server}`,
            async () => await dramacool.fetchEpisodeSources(episodeId, server),
            REDIS_TTL,
          )
        : await dramacool.fetchEpisodeSources(episodeId, server);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/popular', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `dramacool:popular:${page}`,
            async () => await dramacool.fetchPopular(page ? page : 1),
            REDIS_TTL,
          )
        : await dramacool.fetchPopular(page ? page : 1);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/recent-movies', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `dramacool:recent-movies:${page}`,
            async () => await dramacool.fetchRecentMovies(page ? page : 1),
            REDIS_TTL,
          )
        : await dramacool.fetchRecentMovies(page ? page : 1);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/recent-shows', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `dramacool:recent-shows:${page}`,
            async () => await dramacool.fetchRecentTvShows(page ? page : 1),
            REDIS_TTL,
          )
        : await dramacool.fetchRecentTvShows(page ? page : 1);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });
};

export default routes;
