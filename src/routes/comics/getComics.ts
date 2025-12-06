import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { COMICS } from '@consumet/extensions';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const getComics = new COMICS.GetComics();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the getComics provider: check out the provider's website @ ${getComics.toString.baseUrl}`,
      routes: ['/:query'],
      documentation: 'https://docs.consumet.org/#tag/getComics',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const { comicTitle } = request.query as { comicTitle: string };
    const page = (request.query as { page: number }).page || 1;

    if (!comicTitle || comicTitle.length < 4)
      return reply.status(400).send({
        message: 'length of comicTitle must be > 4 characters',
        error: 'short_length',
      });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `getcomics:search:${comicTitle}:${page}`,
            async () => await getComics.search(comicTitle, page),
            REDIS_TTL,
          )
        : await getComics.search(comicTitle, page);

      return reply.status(200).send(res);
    } catch (err) {
      return reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });
};

export default routes;
