import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';
import axios from 'axios';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const mangahere = new MANGA.MangaHere();

  fastify.get('/', {
    schema: {
      description: 'Get MangaHere provider info and available routes',
      tags: ['mangahere'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the MangaHere provider: check out the provider's website @ ${mangahere.toString.baseUrl}`,
      routes: ['/:query', '/info', '/read'],
      documentation: 'https://docs.consumet.org/#tag/mangahere',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for manga',
      tags: ['mangahere'],
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
            `mangahere:search:${query}:${page ?? 1}`,
            () => mangahere.search(query, page),
            REDIS_TTL,
          )
        : await mangahere.search(query, page);

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
      tags: ['mangahere'],
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Manga ID' },
        },
        required: ['id'],
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (!id) return reply.status(400).send({ message: 'id is required' });

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangahere:info:${id}`,
            () => mangahere.fetchMangaInfo(id),
            REDIS_TTL,
          )
        : await mangahere.fetchMangaInfo(id);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  fastify.get('/read', {
    schema: {
      description: 'Get chapter pages',
      tags: ['mangahere'],
      querystring: {
        type: 'object',
        properties: {
          chapterId: { type: 'string', description: 'Chapter ID' },
        },
        required: ['chapterId'],
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const chapterId = (request.query as { chapterId: string }).chapterId;

    if (!chapterId) return reply.status(400).send({ message: 'chapterId is required' });

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangahere:read:${chapterId}`,
            () => mangahere.fetchChapterPages(chapterId),
            REDIS_TTL,
          )
        : await mangahere.fetchChapterPages(chapterId);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  // --- RANKINGS ---
  fastify.get('/rankings', {
    schema: {
      description: 'Get manga rankings by type (total, month, week, day)',
      tags: ['mangahere'],
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['total', 'month', 'week', 'day'], description: 'Ranking type', default: 'total' },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const type = (request.query as { type: string }).type || 'total';

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangahere:rankings:${type}`,
            () => mangahere.fetchMangaRanking(type as any),
            REDIS_TTL,
          )
        : await mangahere.fetchMangaRanking(type as any);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  // --- HOT RELEASES ---
  fastify.get('/hot', {
    schema: {
      description: 'Get hot releases',
      tags: ['mangahere'],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangahere:hot`,
            () => mangahere.fetchMangaHotReleases(),
            REDIS_TTL,
          )
        : await mangahere.fetchMangaHotReleases();

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  // --- TRENDING ---
  fastify.get('/trending', {
    schema: {
      description: 'Get trending manga',
      tags: ['mangahere'],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangahere:trending`,
            () => mangahere.fetchMangaTrending(),
            REDIS_TTL,
          )
        : await mangahere.fetchMangaTrending();

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
      tags: ['mangahere'],
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
            `mangahere:latest:${page}`,
            () => mangahere.fetchMangaRecentUpdate(page),
            REDIS_TTL,
          )
        : await mangahere.fetchMangaRecentUpdate(page);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
      });
    }
  });

  // --- BROWSE WITH FILTERS ---
  fastify.get('/browse', {
    schema: {
      description: 'Browse manga with filters (genre, status, sort)',
      tags: ['mangahere'],
      querystring: {
        type: 'object',
        properties: {
          genre: { type: 'string', description: 'Genre filter' },
          status: { type: 'string', enum: ['all', 'new', 'completed', 'ongoing'], description: 'Manga status filter', default: 'all' },
          sort: { type: 'string', enum: ['az', 'popularity', 'rating', 'latest', 'news'], description: 'Sort order', default: 'popularity' },
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const genre = (request.query as { genre?: string }).genre;
    const status = (request.query as { status?: string }).status;
    const sort = (request.query as { sort?: string }).sort;
    const page = (request.query as { page?: number }).page;

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangahere:browse:${genre}:${status}:${sort}:${page}`,
            () => mangahere.browse({ genre, status: status as any, sort: sort as any, page }),
            REDIS_TTL,
          )
        : await mangahere.browse({ genre, status: status as any, sort: sort as any, page });

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
      tags: ['mangahere'],
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
          'Referer': 'https://www.mangahere.cc/',
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
