import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers, SubOrSub } from '@consumet/extensions/dist/models';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const hianime = new ANIME.Hianime();

  fastify.get('/', {
    schema: {
      description: 'Get HiAnime provider info and available routes',
      tags: ['hianime'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the hianime provider: check out the provider's website @ ${hianime.toString.baseUrl}`,
      routes: [
        '/:query',
        '/info',
        '/watch/:episodeId',
        '/advanced-search',
        '/top-airing',
        '/most-popular',
        '/most-favorite',
        '/latest-completed',
        '/recently-updated',
        '/recently-added',
        '/top-upcoming',
        '/studio/:studio',
        '/subbed-anime',
        '/dubbed-anime',
        '/movie',
        '/tv',
        '/ova',
        '/ona',
        '/special',
        '/genres',
        '/genre/:genre',
        '/schedule',
        '/spotlight',
        '/search-suggestions/:query',
      ],
      documentation: 'https://docs.consumet.org/#tag/hianime',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for anime',
      tags: ['hianime'],
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
    const query = (request.params as { query: string }).query;
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:search:${query}:${page}`,
            async () => await hianime.search(query, page),
            REDIS_TTL,
          )
        : await hianime.search(query, page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/info', {
    schema: {
      description: 'Get detailed anime information',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Anime ID/slug' },
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
            `hianime:info:${id}`,
            async () => await hianime.fetchAnimeInfo(id),
            REDIS_TTL,
          )
        : await hianime.fetchAnimeInfo(id);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get(
    '/watch/:episodeId',
    {
      schema: {
        description: 'Get streaming sources for an episode',
        tags: ['hianime'],
        params: {
          type: 'object',
          properties: {
            episodeId: { type: 'string', description: 'Episode ID' },
          },
          required: ['episodeId'],
        },
        querystring: {
          type: 'object',
          properties: {
            server: { type: 'string', description: 'Streaming server' },
            category: { type: 'string', description: 'Sub or Dub category' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;
      const server = (request.query as { server: StreamingServers }).server;
      const category = (request.query as { category: SubOrSub }).category;

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'episodeId is required' });

      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `hianime:watch:${episodeId}:${server}:${category}`,
              async () => await hianime.fetchEpisodeSources(episodeId, server, category),
              REDIS_TTL,
            )
          : await hianime.fetchEpisodeSources(episodeId, server, category);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get('/genres', {
    schema: {
      description: 'Get list of available genres',
      tags: ['hianime'],
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:genres`,
            async () => await hianime.fetchGenres(),
            REDIS_TTL,
          )
        : await hianime.fetchGenres();

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/schedule', {
    schema: {
      description: 'Get anime airing schedule for a specific date',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Date in YYYY-MM-DD format (e.g., 2024-01-15)' },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const date = (request.query as { date: string }).date;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:schedule:${date}`,
            async () => await hianime.fetchSchedule(date),
            REDIS_TTL,
          )
        : await hianime.fetchSchedule(date);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/spotlight', {
    schema: {
      description: 'Get spotlight/featured anime from homepage (includes banner, rank, description)',
      tags: ['hianime'],
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
                  japaneseTitle: { type: 'string' },
                  banner: { type: 'string' },
                  rank: { type: 'number' },
                  url: { type: 'string' },
                  type: { type: 'string' },
                  duration: { type: 'string' },
                  releaseDate: { type: 'string' },
                  quality: { type: 'string' },
                  sub: { type: 'number' },
                  dub: { type: 'number' },
                  episodes: { type: 'number' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:spotlight`,
            async () => await hianime.fetchSpotlight(),
            REDIS_TTL,
          )
        : await hianime.fetchSpotlight();

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get(
    '/search-suggestions/:query',
    {
      schema: {
        description: 'Get search suggestions for a query',
        tags: ['hianime'],
        params: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
          },
          required: ['query'],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = (request.params as { query: string }).query;

      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `hianime:suggestions:${query}`,
              async () => await hianime.fetchSearchSuggestions(query),
              REDIS_TTL,
            )
          : await hianime.fetchSearchSuggestions(query);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get(
    '/advanced-search',
    {
      schema: {
        description: 'Advanced search with multiple filters',
        tags: ['hianime'],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number', default: 1 },
            type: { type: 'string', description: 'Anime type (all, movie, tv, ova, ona, special, music)' },
            status: { type: 'string', description: 'Anime status (all, currently-airing, finished-airing)' },
            rated: { type: 'string', description: 'Rating (all, g, pg, pg-13, r, r+, rx)' },
            score: { type: 'number', description: 'Minimum score' },
            season: { type: 'string', description: 'Season (all, spring, summer, fall, winter)' },
            language: { type: 'string', description: 'Language (all, sub, dub)' },
            startDate: { type: 'string', description: 'Start year filter' },
            endDate: { type: 'string', description: 'End year filter' },
            sort: { type: 'string', description: 'Sort order' },
            genres: { type: 'string', description: 'Comma-separated genres' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const queryParams = request.query as {
        page?: number;
        type?: string;
        status?: string;
        rated?: string;
        score?: number;
        season?: string;
        language?: string;
        startDate?: string;
        endDate?: string;
        sort?: string;
        genres?: string;
      };

      const {
        page = 1,
        type,
        status,
        rated,
        score,
        season,
        language,
        startDate,
        endDate,
        sort,
        genres,
      } = queryParams;

      try {
        // Explicitly typed to avoid implicit any errors
        let parsedStartDate: { year: number; month: number; day: number } | undefined;
        let parsedEndDate: { year: number; month: number; day: number } | undefined;

        if (startDate) {
          const [year, month, day] = startDate.split('-').map(Number);
          parsedStartDate = { year, month, day };
        }
        if (endDate) {
          const [year, month, day] = endDate.split('-').map(Number);
          parsedEndDate = { year, month, day };
        }

        const genresArray = genres ? genres.split(',') : undefined;

        // Create a unique key based on all parameters
        const cacheKey = `hianime:advanced-search:${JSON.stringify(queryParams)}`;

        let res = redis
          ? await cache.fetch(
              redis as Redis,
              cacheKey,
              async () =>
                await hianime.fetchAdvancedSearch(
                  page,
                  type,
                  status,
                  rated,
                  score,
                  season,
                  language,
                  parsedStartDate,
                  parsedEndDate,
                  sort,
                  genresArray,
                ),
              REDIS_TTL,
            )
          : await hianime.fetchAdvancedSearch(
              page,
              type,
              status,
              rated,
              score,
              season,
              language,
              parsedStartDate,
              parsedEndDate,
              sort,
              genresArray,
            );

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get('/top-airing', {
    schema: {
      description: 'Get top airing anime',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:top-airing:${page}`,
            async () => await hianime.fetchTopAiring(page),
            REDIS_TTL,
          )
        : await hianime.fetchTopAiring(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/most-popular', {
    schema: {
      description: 'Get most popular anime',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:most-popular:${page}`,
            async () => await hianime.fetchMostPopular(page),
            REDIS_TTL,
          )
        : await hianime.fetchMostPopular(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/most-favorite', {
    schema: {
      description: 'Get most favorite anime',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:most-favorite:${page}`,
            async () => await hianime.fetchMostFavorite(page),
            REDIS_TTL,
          )
        : await hianime.fetchMostFavorite(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get(
    '/latest-completed',
    {
      schema: {
        description: 'Get latest completed anime',
        tags: ['hianime'],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number', default: 1 },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;

      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `hianime:latest-completed:${page}`,
              async () => await hianime.fetchLatestCompleted(page),
              REDIS_TTL,
            )
          : await hianime.fetchLatestCompleted(page);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get(
    '/recently-updated',
    {
      schema: {
        description: 'Get recently updated anime',
        tags: ['hianime'],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number', default: 1 },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;

      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `hianime:recently-updated:${page}`,
              async () => await hianime.fetchRecentlyUpdated(page),
              REDIS_TTL,
            )
          : await hianime.fetchRecentlyUpdated(page);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get('/recently-added', {
    schema: {
      description: 'Get recently added anime',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:recently-added:${page}`,
            async () => await hianime.fetchRecentlyAdded(page),
            REDIS_TTL,
          )
        : await hianime.fetchRecentlyAdded(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/top-upcoming', {
    schema: {
      description: 'Get top upcoming anime',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:top-upcoming:${page}`,
            async () => await hianime.fetchTopUpcoming(page),
            REDIS_TTL,
          )
        : await hianime.fetchTopUpcoming(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/studio/:studio', {
    schema: {
      description: 'Get anime by studio',
      tags: ['hianime'],
      params: {
        type: 'object',
        properties: {
          studio: { type: 'string', description: 'Studio name/slug' },
        },
        required: ['studio'],
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const studio = (request.params as { studio: string }).studio;
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:studio:${studio}:${page}`,
            async () => await hianime.fetchStudio(studio, page),
            REDIS_TTL,
          )
        : await hianime.fetchStudio(studio, page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/subbed-anime', {
    schema: {
      description: 'Get subbed anime',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:subbed:${page}`,
            async () => await hianime.fetchSubbedAnime(page),
            REDIS_TTL,
          )
        : await hianime.fetchSubbedAnime(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/dubbed-anime', {
    schema: {
      description: 'Get dubbed anime',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:dubbed:${page}`,
            async () => await hianime.fetchDubbedAnime(page),
            REDIS_TTL,
          )
        : await hianime.fetchDubbedAnime(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/movie', {
    schema: {
      description: 'Get anime movies',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:movie:${page}`,
            async () => await hianime.fetchMovie(page),
            REDIS_TTL,
          )
        : await hianime.fetchMovie(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/tv', {
    schema: {
      description: 'Get TV anime series',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:tv:${page}`,
            async () => await hianime.fetchTV(page),
            REDIS_TTL,
          )
        : await hianime.fetchTV(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/ova', {
    schema: {
      description: 'Get OVA anime',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:ova:${page}`,
            async () => await hianime.fetchOVA(page),
            REDIS_TTL,
          )
        : await hianime.fetchOVA(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/ona', {
    schema: {
      description: 'Get ONA anime',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:ona:${page}`,
            async () => await hianime.fetchONA(page),
            REDIS_TTL,
          )
        : await hianime.fetchONA(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/special', {
    schema: {
      description: 'Get special anime episodes/series',
      tags: ['hianime'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:special:${page}`,
            async () => await hianime.fetchSpecial(page),
            REDIS_TTL,
          )
        : await hianime.fetchSpecial(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/genre/:genre', {
    schema: {
      description: 'Get anime by genre',
      tags: ['hianime'],
      params: {
        type: 'object',
        properties: {
          genre: { type: 'string', description: 'Genre name/slug' },
        },
        required: ['genre'],
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const genre = (request.params as { genre: string }).genre;
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `hianime:genre:${genre}:${page}`,
            async () => await hianime.genreSearch(genre, page),
            REDIS_TTL,
          )
        : await hianime.genreSearch(genre, page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });
};

export default routes;
