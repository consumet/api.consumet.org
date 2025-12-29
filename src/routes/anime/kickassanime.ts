import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const kickassanime = new ANIME.KickAssAnime();

  fastify.get('/', {
    schema: {
      description: 'Get KickAssAnime provider info and available routes',
      tags: ['kickassanime'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the kickassanime provider: check out the provider's website @ ${kickassanime.toString.baseUrl}`,
      routes: ['/:query', '/info', '/watch/:episodeId', '/servers/:episodeId'],
      documentation: 'https://docs.consumet.org/#tag/kickassanime',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for anime',
      tags: ['kickassanime'],
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
    const query = (request.params as { query: string }).query;
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `kickassanime:search:${query}:${page}`,
            async () => await kickassanime.search(query, page),
            REDIS_TTL,
          )
        : await kickassanime.search(query, page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/info', {
    schema: {
      description: 'Get anime details by ID',
      tags: ['kickassanime'],
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
            `kickassanime:info:${id}`,
            async () => await kickassanime.fetchAnimeInfo(id),
            REDIS_TTL,
          )
        : await kickassanime.fetchAnimeInfo(id);

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
        tags: ['kickassanime'],
        params: {
          type: 'object',
          properties: {
            episodeId: { type: 'string', description: 'Episode ID' },
          },
          required: ['episodeId'],
        },
        querystring: {
          type: 'object',
          properties: {
            server: { type: 'string', description: 'Streaming server' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;
      const server = (request.query as { server: StreamingServers }).server;

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'episodeId is required' });

      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `kickassanime:watch:${episodeId}:${server}`,
              async () => await kickassanime.fetchEpisodeSources(episodeId, server),
              REDIS_TTL,
            )
          : await kickassanime.fetchEpisodeSources(episodeId, server);

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
        tags: ['kickassanime'],
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
              `kickassanime:servers:${episodeId}`,
              async () => await kickassanime.fetchEpisodeServers(episodeId),
              REDIS_TTL,
            )
          : await kickassanime.fetchEpisodeServers(episodeId);

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
