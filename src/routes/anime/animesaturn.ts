import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import Redis from 'ioredis/built';
import { redis, REDIS_TTL } from '../../main';
import cache from '../../utils/cache';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const animesaturn = new ANIME.AnimeSaturn();

  fastify.get('/', {
    schema: {
      description: 'Get AnimeSaturn provider info and available routes',
      tags: ['animesaturn'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the animesaturn provider: check out the provider's website @ https://www.animesaturn.tv/",
      routes: ['/:query', '/info/:id', '/watch/:episodeId'],
      documentation: 'https://docs.consumet.org/#tag/animesaturn',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for anime',
      tags: ['animesaturn'],
      params: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animesaturn:search:${query}`,
            async () => await animesaturn.search(query),
            REDIS_TTL,
          )
        : await animesaturn.search(query);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/info', {
    schema: {
      description: 'Get anime details by ID',
      tags: ['animesaturn'],
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Anime ID' },
        },
        required: ['id'],
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animesaturn:info:${id}`,
            async () => await animesaturn.fetchAnimeInfo(id),
            REDIS_TTL,
          )
        : await animesaturn.fetchAnimeInfo(id);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get(
    '/watch/:episodeId',
    {
      schema: {
        description: 'Get streaming sources for an episode',
        tags: ['animesaturn'],
        params: {
          type: 'object',
          properties: {
            episodeId: { type: 'string', description: 'Episode ID' },
          },
          required: ['episodeId'],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'episodeId is required' });

      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `animesaturn:watch:${episodeId}`,
              async () => await animesaturn.fetchEpisodeSources(episodeId),
              REDIS_TTL,
            )
          : await animesaturn.fetchEpisodeSources(episodeId);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get(
    '/servers/:episodeId',
    {
      schema: {
        description: 'Get available streaming servers for an episode',
        tags: ['animesaturn'],
        params: {
          type: 'object',
          properties: {
            episodeId: { type: 'string', description: 'Episode ID' },
          },
          required: ['episodeId'],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'episodeId is required' });

      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `animesaturn:servers:${episodeId}`,
              async () => await animesaturn.fetchEpisodeServers(episodeId),
              REDIS_TTL,
            )
          : await animesaturn.fetchEpisodeServers(episodeId);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );
};

export default routes;
