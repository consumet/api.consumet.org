import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { COMICS } from '@consumet/extensions';

import cache from '../../utils/cache';
import { redis, REDIS_TTL } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const getComics = new COMICS.GetComics();

  fastify.get('/', {
    schema: {
      description: 'Get GetComics provider info and available routes',
      tags: ['getcomics'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the getComics provider: check out the provider's website @ ${getComics.toString.baseUrl}`,
      routes: ['/:query'],
      documentation: 'https://docs.consumet.org/#tag/getComics',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for comics',
      tags: ['getcomics'],
      params: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Route parameter (not used)' },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          comicTitle: { type: 'string', description: 'Comic title to search (min 4 characters)' },
          page: { type: 'number', description: 'Page number', default: 1 },
        },
        required: ['comicTitle'],
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
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
