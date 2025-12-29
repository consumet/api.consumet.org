import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';
import axios from 'axios';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const mangakakalot = new MANGA.MangaKakalot();

  fastify.get('/', {
    schema: {
      description: 'Get MangaKakalot provider info and available routes',
      tags: ['mangakakalot'],
      response: {
        200: {
          type: 'object',
          properties: {
            intro: { type: 'string' },
            routes: { type: 'object' },
            documentation: { type: 'string' },
          },
        },
      },
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the Mangakakalot provider: check out the provider's website @ ${mangakakalot.toString.baseUrl}`,
      routes: {
        '/:query': {
          description: 'Search for manga by title',
          example: '/manga/mangakakalot/naruto',
          parameters: {
            query: '(path) - The manga title to search for',
            page: '(query, optional) - Page number for pagination. Default: 1',
          },
          exampleWithPage: '/manga/mangakakalot/naruto?page=2',
        },
        '/info': {
          description: 'Get detailed information about a specific manga',
          example: '/manga/mangakakalot/info?id=naruto',
          parameters: {
            id: '(query, required) - The manga ID from search results',
          },
        },
        '/read': {
          description: 'Get chapter pages/images for reading',
          example: '/manga/mangakakalot/read?chapterId=naruto/chapter-700-5',
          parameters: {
            chapterId: '(query, required) - The chapter ID in format "mangaId/chapterId"',
          },
        },
        '/latestmanga': {
          description: 'Get the latest manga updates',
          example: '/manga/mangakakalot/latestmanga',
          parameters: {
            page: '(query, optional) - Page number for pagination. Default: 1',
          },
          exampleWithPage: '/manga/mangakakalot/latestmanga?page=2',
        },
        '/suggestions': {
          description: 'Get autocomplete suggestions for dropdown menu while typing',
          example: '/manga/mangakakalot/suggestions?query=one piece',
          parameters: {
            query: '(query, required) - The search term for autocomplete dropdown',
          },
          hint: 'Use this for implementing search dropdown/autocomplete in your UI',
        },
        '/bygenre': {
          description: 'Get manga filtered by genre',
          example: '/manga/mangakakalot/bygenre?genre=action',
          parameters: {
            genre: '(query, required) - Genre slug (e.g., action, romance, comedy)',
            page: '(query, optional) - Page number for pagination. Default: 1',
          },
          exampleWithPage: '/manga/mangakakalot/bygenre?genre=action&page=2',
        },
      },
      documentation: 'https://docs.consumet.org/#tag/mangakakalot',
    });
  });

  fastify.get('/info', {
    schema: {
      description: 'Get detailed information about a specific manga including chapters list',
      tags: ['mangakakalot'],
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The manga ID from search results' },
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

    if (!id)
      return reply.status(400).send({
        message: 'id is required',
        error: 'Missing required query parameter: id',
        example: '/manga/mangakakalot/info?id=naruto',
        hint: 'Get the manga ID from search results using /:query or /latestmanga',
      });

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangakakalot:info:${id}`,
            () => mangakakalot.fetchMangaInfo(id),
            REDIS_TTL,
          )
        : await mangakakalot.fetchMangaInfo(id);

      reply.status(200).send(res);
    } catch {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
        error: 'Failed to fetch manga info',
        hint: 'Make sure the manga ID is valid and exists',
      });
    }
  });

  fastify.get('/read', {
    schema: {
      description: 'Get chapter pages/images for reading a manga chapter',
      tags: ['mangakakalot'],
      querystring: {
        type: 'object',
        properties: {
          chapterId: { type: 'string', description: 'The chapter ID in format "mangaId/chapterId"' },
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

    if (!chapterId)
      return reply.status(400).send({
        message: 'chapterId is required',
        error: 'Missing required query parameter: chapterId',
        example: '/manga/mangakakalot/read?chapterId=naruto/chapter-700-5',
        hint: 'Get the chapter ID from /info endpoint. Format: "mangaId/chapterId"',
      });

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangakakalot:read:${chapterId}`,
            () => mangakakalot.fetchChapterPages(chapterId),
            REDIS_TTL,
          )
        : await mangakakalot.fetchChapterPages(chapterId);

      reply.status(200).send(res);
    } catch {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
        error: 'Failed to fetch chapter pages',
        hint: 'Make sure the chapter ID is valid and in correct format: "mangaId/chapterId"',
      });
    }
  });

  fastify.get('/latestmanga', {
    schema: {
      description: 'Get the latest manga updates from MangaKakalot',
      tags: ['mangakakalot'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number for pagination', default: 1 },
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
                  chapter: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page || 1;

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangakakalot:latestmanga:${page}`,
            () => mangakakalot.fetchLatestUpdates(page),
            REDIS_TTL,
          )
        : await mangakakalot.fetchLatestUpdates(page);

      reply.status(200).send(res);
    } catch {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
        error: 'Failed to fetch latest manga updates',
        hint: 'Try again later or check if the page number is valid',
      });
    }
  });

  fastify.get('/bygenre', {
    schema: {
      description: 'Get manga filtered by genre',
      tags: ['mangakakalot'],
      querystring: {
        type: 'object',
        properties: {
          genre: { type: 'string', description: 'Genre slug (e.g., action, romance, comedy, fantasy, horror)' },
          page: { type: 'number', description: 'Page number for pagination', default: 1 },
        },
        required: ['genre'],
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
                  description: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const genre = (request.query as { genre: string }).genre;
    const page = (request.query as { page: number }).page || 1;

    if (!genre)
      return reply.status(400).send({
        message: 'genre is required',
        error: 'Missing required query parameter: genre',
        example: '/manga/mangakakalot/bygenre?genre=action',
        hint: 'Use genre slugs like: action, romance, comedy, fantasy, horror, etc.',
      });

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangakakalot:bygenre:${genre}:${page}`,
            () => mangakakalot.fetchByGenre(genre, page),
            REDIS_TTL,
          )
        : await mangakakalot.fetchByGenre(genre, page);

      reply.status(200).send(res);
    } catch {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
        error: 'Failed to fetch manga by genre',
        hint: 'Make sure the genre slug is valid (e.g., action, romance, comedy)',
      });
    }
  });

  fastify.get('/suggestions', {
    schema: {
      description: 'Get autocomplete suggestions for search dropdown while typing',
      tags: ['mangakakalot'],
      querystring: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The search term for autocomplete suggestions' },
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
              image: { type: 'string' },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.query as { query: string }).query;

    if (!query)
      return reply.status(400).send({
        message: 'query is required',
        error: 'Missing required query parameter: query',
        example: '/manga/mangakakalot/suggestions?query=naruto',
        hint: 'Provide a search term for autocomplete suggestions',
      });

    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangakakalot:suggestions:${query}`,
            () => mangakakalot.fetchSuggestions(query),
            REDIS_TTL,
          )
        : await mangakakalot.fetchSuggestions(query);

      reply.status(200).send(res);
    } catch {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
        error: 'Failed to fetch suggestions',
        hint: 'Try again with a different search term',
      });
    }
  });

  // This parametric route MUST be last to avoid catching static routes like /info, /read, etc.
  fastify.get('/:query', {
    schema: {
      description: 'Search for manga by title on MangaKakalot',
      tags: ['mangakakalot'],
      params: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The manga title to search for' },
        },
        required: ['query'],
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number for pagination', default: 1 },
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
                  description: { type: 'string' },
                  status: { type: 'string' },
                  latestChapter: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { query } = request.params as { query: string };
    const page = (request.query as { page: number }).page || 1;
    try {
      const res = redis
        ? await cache.fetch(
            redis as Redis,
            `mangakakalot:search:${query}:${page}`,
            () => mangakakalot.search(query, page),
            REDIS_TTL,
          )
        : await mangakakalot.search(query, page);
      reply.status(200).send(res);
    } catch {
      reply.status(500).send({
        message: 'Something went wrong. Please try again later.',
        error: 'Failed to search for manga',
        hint: 'Try again with a different search query',
      });
    }
  });

  // Image proxy route to bypass CORS/hotlink protection
  fastify.get('/proxy', {
    schema: {
      description: 'Proxy manga images to bypass CORS and hotlink protection',
      tags: ['mangakakalot'],
      querystring: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'The image URL to proxy' },
        },
        required: ['url'],
      },
      response: {
        200: {
          type: 'string',
          format: 'binary',
          description: 'The proxied image',
        },
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
          'Referer': 'https://mangakakalot.com/',
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
