import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const animesama = new ANIME.AnimeSama();

  fastify.get('/', {
    schema: {
      description: 'Get AnimeSama provider info and available routes (French anime)',
      tags: ['animesama'],
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
      intro: `Welcome to the AnimeSama provider (French): check out the provider's website @ ${animesama.toString.baseUrl}`,
      routes: ['/:query', '/info', '/watch'],
      documentation: 'https://docs.consumet.org/#tag/animesama',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for anime on AnimeSama (French)',
      tags: ['animesama'],
      params: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            currentPage: { type: 'number' },
            hasNextPage: { type: 'boolean' },
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  url: { type: 'string' },
                  image: { type: 'string' },
                },
              },
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
            `animesama:search:${query}`,
            async () => await animesama.search(query),
            REDIS_TTL,
          )
        : await animesama.search(query);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  fastify.get('/info', {
    schema: {
      description: 'Get anime details by ID',
      tags: ['animesama'],
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Anime ID' },
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
            genres: { type: 'array', items: { type: 'string' } },
            episodes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  number: { type: 'number' },
                  title: { type: 'string' },
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
            `animesama:info:${id}`,
            async () => await animesama.fetchAnimeInfo(id),
            REDIS_TTL,
          )
        : await animesama.fetchAnimeInfo(id);

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
      tags: ['animesama'],
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
            `animesama:watch:${episodeId}`,
            async () => await animesama.fetchEpisodeSources(episodeId),
            REDIS_TTL,
          )
        : await animesama.fetchEpisodeSources(episodeId);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });
};

export default routes;
