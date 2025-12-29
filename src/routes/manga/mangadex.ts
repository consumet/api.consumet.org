import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';
import axios from 'axios';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const mangadex = new MANGA.MangaDex();

  fastify.get('/', {
    schema: {
      description: 'Get MangaDex provider info and available routes',
      tags: ['mangadex'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the mangadex provider: check out the provider's website @ ${mangadex.toString.baseUrl}`,
      routes: ['/:query', '/info/:id', '/read/:chapterId'],
      documentation: 'https://docs.consumet.org/#tag/mangadex',
    });
  });

  // --- SEARCH ---
  fastify.get('/:query', {
    schema: {
      description: 'Search for manga',
      tags: ['mangadex'],
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
    const { query } = request.params as { query: string };
    const { page } = request.query as { page?: number };

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangadex:search:${query}:${page ?? 1}`,
            () => mangadex.search(query, page),
            REDIS_TTL,
          )
        : await mangadex.search(query, page);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  // --- INFO ---
  fastify.get('/info/:id', {
    schema: {
      description: 'Get manga details by ID',
      tags: ['mangadex'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Manga ID' },
        },
        required: ['id'],
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const id = decodeURIComponent((request.params as { id: string }).id);

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangadex:info:${id}`,
            () => mangadex.fetchMangaInfo(id),
            REDIS_TTL,
          )
        : await mangadex.fetchMangaInfo(id);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  // --- READ CHAPTER ---
  fastify.get(
    '/read/:chapterId',
    {
      schema: {
        description: 'Get chapter pages',
        tags: ['mangadex'],
        params: {
          type: 'object',
          properties: {
            chapterId: { type: 'string', description: 'Chapter ID' },
          },
          required: ['chapterId'],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { chapterId } = request.params as { chapterId: string };

      try {
        const res = redis
          ? await cache.fetch(
              redis as Redis,
              `mangadex:read:${chapterId}`,
              () => mangadex.fetchChapterPages(chapterId),
              REDIS_TTL,
            )
          : await mangadex.fetchChapterPages(chapterId);

        reply.status(200).send(res);
      } catch (err) {
        reply.status(500).send({
          message: 'Something went wrong. Please try again later.',
        });
      }
    },
  );

  // --- RANDOM MANGA ---
  fastify.get('/random', {
    schema: {
      description: 'Get a random manga from MangaDex',
      tags: ['mangadex'],
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            image: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const res = await mangadex.fetchRandom();
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  // --- RECENTLY ADDED ---
  fastify.get('/recent', {
    schema: {
      description: 'Get recently added manga',
      tags: ['mangadex'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page || 1;

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangadex:recent:${page}`,
            () => mangadex.fetchRecentlyAdded(page),
            REDIS_TTL,
          )
        : await mangadex.fetchRecentlyAdded(page);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  // --- LATEST UPDATES ---
  fastify.get('/latest', {
    schema: {
      description: 'Get latest updated manga',
      tags: ['mangadex'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page || 1;

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangadex:latest:${page}`,
            () => mangadex.fetchLatestUpdates(page),
            REDIS_TTL,
          )
        : await mangadex.fetchLatestUpdates(page);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  // --- POPULAR ---
  fastify.get('/popular', {
    schema: {
      description: 'Get popular manga',
      tags: ['mangadex'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page || 1;

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangadex:popular:${page}`,
            () => mangadex.fetchPopular(page),
            REDIS_TTL,
          )
        : await mangadex.fetchPopular(page);

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
      tags: ['mangadex'],
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
          'Referer': 'https://mangadex.org/',
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
