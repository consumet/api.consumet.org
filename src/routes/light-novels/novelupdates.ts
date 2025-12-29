import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { LIGHT_NOVELS } from '@consumet/extensions';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const novelupdates = new LIGHT_NOVELS.NovelUpdates();

  fastify.get('/', {
    schema: {
      description: 'Get NovelUpdates provider info and available routes',
      tags: ['novelupdates'],
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
      intro: `Welcome to the NovelUpdates provider: check out the provider's website @ ${novelupdates.toString.baseUrl}`,
      routes: ['/:query', '/info', '/read'],
      documentation: 'https://docs.consumet.org/#tag/novelupdates',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for light novels on NovelUpdates',
      tags: ['novelupdates'],
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
            `novelupdates:search:${query}`,
            async () => await novelupdates.search(query),
            REDIS_TTL,
          )
        : await novelupdates.search(query);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  fastify.get('/info', {
    schema: {
      description: 'Get light novel details by ID',
      tags: ['novelupdates'],
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Novel ID/slug' },
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
            status: { type: 'string' },
            authors: { type: 'array', items: { type: 'string' } },
            chapters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
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
            `novelupdates:info:${id}`,
            async () => await novelupdates.fetchLightNovelInfo(id),
            REDIS_TTL,
          )
        : await novelupdates.fetchLightNovelInfo(id);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  fastify.get('/read', {
    schema: {
      description: 'Get chapter content for reading',
      tags: ['novelupdates'],
      querystring: {
        type: 'object',
        properties: {
          chapterId: { type: 'string', description: 'Chapter ID/URL' },
        },
        required: ['chapterId'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const chapterId = (request.query as { chapterId: string }).chapterId;

    if (!chapterId) return reply.status(400).send({ message: 'chapterId is required' });

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `novelupdates:read:${chapterId}`,
            async () => await novelupdates.fetchChapterContent(chapterId),
            REDIS_TTL,
          )
        : await novelupdates.fetchChapterContent(chapterId);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });
};

export default routes;
