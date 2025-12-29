import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';
import axios from 'axios';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const managreader = new MANGA.MangaReader();

  fastify.get('/', {
    schema: {
      description: 'Get MangaReader provider info and available routes',
      tags: ['mangareader'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the Mangapill provider: check out the provider's website @ ${managreader.toString.baseUrl}`,
      routes: ['/:query', '/info', '/read'],
      documentation: 'https://docs.consumet.org/#tag/mangapill',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for manga',
      tags: ['mangareader'],
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
            `mangareader:search:${query}`,
            async () => await managreader.search(query),
            REDIS_TTL,
          )
        : await managreader.search(query);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/info', {
    schema: {
      description: 'Get manga details by ID',
      tags: ['mangareader'],
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

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangareader:info:${id}`,
            async () => await managreader.fetchMangaInfo(id),
            REDIS_TTL,
          )
        : await managreader.fetchMangaInfo(id);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/read', {
    schema: {
      description: 'Get chapter pages',
      tags: ['mangareader'],
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

    if (typeof chapterId === 'undefined')
      return reply.status(400).send({ message: 'chapterId is required' });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangareader:read:${chapterId}`,
            async () => await managreader.fetchChapterPages(chapterId),
            REDIS_TTL,
          )
        : await managreader.fetchChapterPages(chapterId);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  // Image proxy route to bypass CORS/hotlink protection
  fastify.get('/proxy', {
    schema: {
      description: 'Proxy manga images to bypass CORS and hotlink protection',
      tags: ['mangareader'],
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
          'Referer': 'https://mangareader.to/',
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
