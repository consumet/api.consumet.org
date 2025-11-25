import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const animeunity = new ANIME.AnimeUnity();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the animeunity provider: check out the provider's website @ ${animeunity.toString.baseUrl}`,
      routes: ['/:query', '/info', '/watch/:episodeId'],
      documentation: 'https://docs.consumet.org/#tag/animeunity',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animeunity:search:${query}`,
            async () => await animeunity.search(query),
            REDIS_TTL,
          )
        : await animeunity.search(query);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;
    const page = (request.query as { page: number }).page;

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `animeunity:info:${id}:${page}`,
            async () => await animeunity.fetchAnimeInfo(id, page),
            REDIS_TTL,
          )
        : await animeunity.fetchAnimeInfo(id, page);

      reply.status(200).send(res);
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

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'episodeId is required' });

      try {
        let res = redis
          ? await cache.fetch(
              redis as Redis,
              `animeunity:watch:${episodeId}`,
              async () => await animeunity.fetchEpisodeSources(episodeId),
              REDIS_TTL,
            )
          : await animeunity.fetchEpisodeSources(episodeId);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );
};

export default routes;
