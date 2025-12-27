import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const mangakakalot = new MANGA.MangaKakalot();

  fastify.get('/', (_, rp) => {
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

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
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

  fastify.get('/read', async (request: FastifyRequest, reply: FastifyReply) => {
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

  fastify.get('/latestmanga', async (request: FastifyRequest, reply: FastifyReply) => {
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

  fastify.get('/bygenre', async (request: FastifyRequest, reply: FastifyReply) => {
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

  fastify.get('/suggestions', async (request: FastifyRequest, reply: FastifyReply) => {
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
  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
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
};

export default routes;
