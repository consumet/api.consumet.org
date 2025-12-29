import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';
import axios from 'axios';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const weebcentral = new MANGA.WeebCentral();

  fastify.get('/', {
    schema: {
      description: 'Get WeebCentral provider info and available routes',
      tags: ['weebcentral'],
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
      intro: `Welcome to the WeebCentral provider: check out the provider's website @ ${weebcentral.toString.baseUrl}`,
      routes: ['/:query', '/info', '/read'],
      documentation: 'https://docs.consumet.org/#tag/weebcentral',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for manga on WeebCentral',
      tags: ['weebcentral'],
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
    const page = (request.query as { page: number }).page || 1;

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `weebcentral:search:${query}:${page}`,
            async () => await weebcentral.search(query, page),
            REDIS_TTL,
          )
        : await weebcentral.search(query, page);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  fastify.get('/info', {
    schema: {
      description: 'Get manga details by ID',
      tags: ['weebcentral'],
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Manga ID/slug' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            altTitles: { type: 'array', items: { type: 'string' } },
            description: { type: 'string' },
            genres: { type: 'array', items: { type: 'string' } },
            status: { type: 'string' },
            image: { type: 'string' },
            authors: { type: 'array', items: { type: 'string' } },
            chapters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  chapterNumber: { type: 'string' },
                  releasedDate: { type: 'string' },
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
            `weebcentral:info:${id}`,
            async () => await weebcentral.fetchMangaInfo(id),
            REDIS_TTL,
          )
        : await weebcentral.fetchMangaInfo(id);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  fastify.get('/read', {
    schema: {
      description: 'Get chapter pages for reading',
      tags: ['weebcentral'],
      querystring: {
        type: 'object',
        properties: {
          chapterId: { type: 'string', description: 'Chapter ID' },
        },
        required: ['chapterId'],
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              page: { type: 'number' },
              img: { type: 'string' },
            },
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
            `weebcentral:read:${chapterId}`,
            async () => await weebcentral.fetchChapterPages(chapterId),
            REDIS_TTL,
          )
        : await weebcentral.fetchChapterPages(chapterId);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  // Image proxy route to bypass CORS/hotlink protection
  fastify.get('/proxy', {
    schema: {
      description: 'Proxy manga images to bypass CORS and hotlink protection',
      tags: ['weebcentral'],
      querystring: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'The image URL to proxy' },
        },
        required: ['url'],
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { url } = request.query as { url: string };

    if (!url) {
      return reply.status(400).send({ message: 'url is required' });
    }

    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'Referer': 'https://weebcentral.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      const contentType = response.headers['content-type'] || 'image/jpeg';
      reply.header('Content-Type', contentType);
      reply.header('Cache-Control', 'public, max-age=86400');
      reply.header('Access-Control-Allow-Origin', '*');
      return reply.send(Buffer.from(response.data));
    } catch (err) {
      reply.status(500).send({ message: 'Failed to proxy image' });
    }
  });
};

export default routes;
