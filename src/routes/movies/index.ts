import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { PROVIDERS_LIST } from '@consumet/extensions';

import flixhq from './flixhq';
import viewasian from './viewasian';
import dramacool from './dramacool';
import fmovies from './fmovies';
import goku from './goku';
import movieshd from './movieshd';
import sflix from './sflix';
const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(flixhq, { prefix: '/flixhq' });
  await fastify.register(viewasian, { prefix: '/viewasian' });
  await fastify.register(dramacool, { prefix: '/dramacool' });
  await fastify.register(fmovies, { prefix: '/fmovies' });
  await fastify.register(goku, { prefix: '/goku' });
  await fastify.register(movieshd, { prefix: '/movieshd' });
  await fastify.register(sflix, { prefix: '/sflix' });
  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Movies and TV Shows');
  });

  fastify.get('/:movieProvider', async (request: FastifyRequest, reply: FastifyReply) => {
    const queries: { movieProvider: string; page: number } = {
      movieProvider: '',
      page: 1,
    };

    queries.movieProvider = decodeURIComponent(
      (request.params as { movieProvider: string; page: number }).movieProvider,
    );

    queries.page = (request.query as { movieProvider: string; page: number }).page;

    if (queries.page! < 1) queries.page = 1;

    const provider = PROVIDERS_LIST.MOVIES.find(
      (provider: any) => provider.toString.name === queries.movieProvider,
    );

    try {
      if (provider) {
        reply.redirect(`/movies/${provider.toString.name}`);
      } else {
        reply
          .status(404)
          .send({ message: 'Page not found, please check the providers list.' });
      }
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });
};

export default routes;
