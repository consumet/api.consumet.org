import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';
import axios from 'axios';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const comick = new MANGA.ComicK();

  fastify.get('/', {
    schema: {
      description: 'Get ComicK provider info and available routes',
      tags: ['comick'],
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
      intro: `Welcome to the ComicK provider: check out the provider's website @ ${comick.toString.baseUrl}`,
      routes: ['/:query', '/info', '/read'],
      documentation: 'https://docs.consumet.org/#tag/comick',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for manga on ComicK',
      tags: ['comick'],
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
          cursor: { type: 'string', description: 'Cursor for pagination (use next_cursor from previous response)' },
        },
      },
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
                  altTitles: { type: 'array', items: { type: 'string' } },
                  image: { type: 'string' },
                },
              },
            },
            next_cursor: { type: 'string' },
            prev_cursor: { type: 'string' },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;
    const cursor = (request.query as { cursor?: string }).cursor;

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `comick:search:${query}:${cursor || 'first'}`,
            async () => await comick.search(query, cursor),
            REDIS_TTL,
          )
        : await comick.search(query, cursor);

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
      tags: ['comick'],
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
            `comick:info:${id}`,
            async () => await comick.fetchMangaInfo(id),
            REDIS_TTL,
          )
        : await comick.fetchMangaInfo(id);

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
      tags: ['comick'],
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
            `comick:read:${chapterId}`,
            async () => await comick.fetchChapterPages(chapterId),
            REDIS_TTL,
          )
        : await comick.fetchChapterPages(chapterId);

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
      tags: ['comick'],
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
          'Referer': 'https://comick.io/',
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
