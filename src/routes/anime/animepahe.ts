import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const animepahe = new ANIME.AnimePahe();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the animepahe provider: check out the provider's website @ ${animepahe.toString.baseUrl}`,
      routes: ['/:query', '/info/:id', '/watch/:episodeId', '/recent-episodes'],
      documentation: 'https://docs.consumet.org/#tag/animepahe',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animepahe:search:${query}`,
            async () => await animepahe.search(query),
            REDIS_TTL,
          )
        : await animepahe.search(query);

      reply.status(200).send(res);
    } catch (err) {
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
              `animepahe:recent-episodes:${page}`,
              async () => await animepahe.fetchRecentEpisodes(page),
              REDIS_TTL,
            )
          : await animepahe.fetchRecentEpisodes(page);

        reply.status(200).send(res);
      } catch (error) {
        reply.status(500).send({
          message: 'Something went wrong. Contact developer for help.',
        });
      }
    },
  );

  fastify.get('/info/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = decodeURIComponent((request.params as { id: string }).id);
    const episodePage = (request.query as { episodePage: number }).episodePage;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animepahe:info:${id}:${episodePage}`,
            async () => await animepahe.fetchAnimeInfo(id, episodePage),
            REDIS_TTL,
          )
        : await animepahe.fetchAnimeInfo(id, episodePage);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/watch', async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.query as { episodeId: string }).episodeId;

    if (typeof episodeId === 'undefined')
      return reply.status(400).send({ message: 'episodeId is required' });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animepahe:watch:${episodeId}`,
            async () => await animepahe.fetchEpisodeSources(episodeId),
            REDIS_TTL,
          )
        : await animepahe.fetchEpisodeSources(episodeId);

      reply.status(200).send(res);
    } catch (err) {
      console.log(err);
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });
};

export default routes;
