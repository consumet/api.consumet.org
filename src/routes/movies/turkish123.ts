import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MOVIES } from '@consumet/extensions';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const turkish123 = new MOVIES.Turkish();

  fastify.get('/', {
    schema: {
      description: 'Get Turkish123 provider info and available routes (Turkish dramas)',
      tags: ['turkish123'],
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
      intro: `Welcome to the Turkish123 provider: check out the provider's website @ ${turkish123.toString.baseUrl}`,
      routes: ['/:query', '/info', '/watch'],
      documentation: 'https://docs.consumet.org/#tag/turkish123',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for Turkish dramas/shows',
      tags: ['turkish123'],
      params: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
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
              type: { type: 'string' },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `turkish123:search:${query}`,
            async () => await turkish123.search(query),
            REDIS_TTL,
          )
        : await turkish123.search(query);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  fastify.get('/info', {
    schema: {
      description: 'Get Turkish drama details by ID',
      tags: ['turkish123'],
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Media ID' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            url: { type: 'string' },
            image: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string' },
            releaseDate: { type: 'string' },
            episodes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  number: { type: 'number' },
                  url: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (!id) return reply.status(400).send({ message: 'id is required' });

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `turkish123:info:${id}`,
            async () => await turkish123.fetchMediaInfo(id),
            REDIS_TTL,
          )
        : await turkish123.fetchMediaInfo(id);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  fastify.get('/watch', {
    schema: {
      description: 'Get episode streaming sources',
      tags: ['turkish123'],
      querystring: {
        type: 'object',
        properties: {
          episodeId: { type: 'string', description: 'Episode ID' },
        },
        required: ['episodeId'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            sources: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  quality: { type: 'string' },
                  isM3U8: { type: 'boolean' },
                },
              },
            },
            subtitles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  lang: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.query as { episodeId: string }).episodeId;

    if (!episodeId) return reply.status(400).send({ message: 'episodeId is required' });

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `turkish123:watch:${episodeId}`,
            async () => await turkish123.fetchEpisodeSources(episodeId),
            REDIS_TTL,
          )
        : await turkish123.fetchEpisodeSources(episodeId);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });
};

export default routes;
