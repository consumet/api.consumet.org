import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers, SubOrSub } from '@consumet/extensions/dist/models';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const animekai = new ANIME.AnimeKai();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the animekai provider: check out the provider's website @ ${animekai.toString.baseUrl}`,
      routes: [
        '/:query',
        '/latest-completed',
        '/new-releases',
        '/recent-added',
        '/recent-episodes',
        '/schedule/:date',
        '/spotlight',
        '/search-suggestions/:query',
        '/servers',
        '/info',
        '/watch/:episodeId',
        '/genre/list',
        '/genre/:genre',
        '/movies',
        '/ona',
        '/ova',
        '/specials',
        '/tv',
      ],
      documentation: 'https://docs.consumet.org/#tag/animekai',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;
    const page = (request.query as { page: number }).page;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:search:${query}:${page}`,
            async () => await animekai.search(query, page),
            REDIS_TTL,
          )
        : await animekai.search(query, page);

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get(
    '/latest-completed',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;
      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `animekai:latest-completed:${page}`,
              async () => await animekai.fetchLatestCompleted(page),
              REDIS_TTL,
            )
          : await animekai.fetchLatestCompleted(page);

        reply.status(200).send(res);
      } catch (error) {
        reply.status(500).send({
          message: 'Something went wrong. Contact developer for help.',
        });
      }
    },
  );

  fastify.get('/new-releases', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:new-releases:${page}`,
            async () => await animekai.fetchNewReleases(page),
            REDIS_TTL,
          )
        : await animekai.fetchNewReleases(page);

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/recent-added', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:recent-added:${page}`,
            async () => await animekai.fetchRecentlyAdded(page),
            REDIS_TTL,
          )
        : await animekai.fetchRecentlyAdded(page);

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get(
    '/recent-episodes',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;
      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `animekai:recent-episodes:${page}`,
              async () => await animekai.fetchRecentlyUpdated(page),
              REDIS_TTL,
            )
          : await animekai.fetchRecentlyUpdated(page);

        reply.status(200).send(res);
      } catch (error) {
        reply.status(500).send({
          message: 'Something went wrong. Contact developer for help.',
        });
      }
    },
  );

  fastify.get('/schedule/:date', async (request: FastifyRequest, reply: FastifyReply) => {
    const date = (request.params as { date: string }).date;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:schedule:${date}`,
            async () => await animekai.fetchSchedule(date),
            REDIS_TTL,
          )
        : await animekai.fetchSchedule(date);

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/spotlight', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:spotlight`,
            async () => await animekai.fetchSpotlight(),
            REDIS_TTL,
          )
        : await animekai.fetchSpotlight();

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get(
    '/search-suggestions/:query',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = (request.params as { query: string }).query;

      if (typeof query === 'undefined')
        return reply.status(400).send({ message: 'query is required' });

      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `animekai:suggestions:${query}`,
              async () => await animekai.fetchSearchSuggestions(query),
              REDIS_TTL,
            )
          : await animekai.fetchSearchSuggestions(query);

        reply.status(200).send(res);
      } catch (error) {
        reply.status(500).send({
          message: 'Something went wrong. Contact developer for help.',
        });
      }
    },
  );

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:info:${id}`,
            async () => await animekai.fetchAnimeInfo(id),
            REDIS_TTL,
          )
        : await animekai.fetchAnimeInfo(id);

      return reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get(
    '/watch/:episodeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;
      const server = (request.query as { server: string }).server as StreamingServers;

      let dub = (request.query as { dub?: string | boolean }).dub;
      if (dub === 'true' || dub === '1') dub = true;
      else dub = false;

      if (server && !Object.values(StreamingServers).includes(server))
        return reply.status(400).send({ message: 'server is invalid' });

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'id is required' });
      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `animekai:watch:${episodeId}:${server}:${dub}`,
              async () =>
                await animekai.fetchEpisodeSources(
                  episodeId,
                  server,
                  dub === true ? SubOrSub.DUB : SubOrSub.SUB,
                ),
              REDIS_TTL,
            )
          : await animekai.fetchEpisodeSources(
              episodeId,
              server,
              dub === true ? SubOrSub.DUB : SubOrSub.SUB,
            );

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get(
    '/servers/:episodeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;
      let dub = (request.query as { dub?: string | boolean }).dub;
      if (dub === 'true' || dub === '1') dub = true;
      else dub = false;

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'id is required' });

      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `animekai:servers:${episodeId}:${dub}`,
              async () =>
                await animekai.fetchEpisodeServers(
                  episodeId,
                  dub === true ? SubOrSub.DUB : SubOrSub.SUB,
                ),
              REDIS_TTL,
            )
          : await animekai.fetchEpisodeServers(
              episodeId,
              dub === true ? SubOrSub.DUB : SubOrSub.SUB,
            );

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get('/genre/list', async (_, reply) => {
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:genre-list`,
            async () => await animekai.fetchGenres(),
            REDIS_TTL,
          )
        : await animekai.fetchGenres();

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/genre/:genre', async (request: FastifyRequest, reply: FastifyReply) => {
    const genre = (request.params as { genre: string }).genre;
    const page = (request.query as { page: number }).page;

    if (typeof genre === 'undefined')
      return reply.status(400).send({ message: 'genre is required' });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:genre:${genre}:${page}`,
            async () => await animekai.genreSearch(genre, page),
            REDIS_TTL,
          )
        : await animekai.genreSearch(genre, page);

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/movies', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:movies:${page}`,
            async () => await animekai.fetchMovie(page),
            REDIS_TTL,
          )
        : await animekai.fetchMovie(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/ona', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:ona:${page}`,
            async () => await animekai.fetchONA(page),
            REDIS_TTL,
          )
        : await animekai.fetchONA(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/ova', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:ova:${page}`,
            async () => await animekai.fetchOVA(page),
            REDIS_TTL,
          )
        : await animekai.fetchOVA(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/specials', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:specials:${page}`,
            async () => await animekai.fetchSpecial(page),
            REDIS_TTL,
          )
        : await animekai.fetchSpecial(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/tv', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animekai:tv:${page}`,
            async () => await animekai.fetchTV(page),
            REDIS_TTL,
          )
        : await animekai.fetchTV(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });
};

export default routes;
