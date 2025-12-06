import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { PROVIDERS_LIST } from '@consumet/extensions';

import animeunity from './animeunity';
import animepahe from './animepahe';
import hianime from './hianime';
import animekai from './animekai';
import animesaturn from './animesaturn';
import kickassanime from './kickassanime';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(animepahe, { prefix: '/animepahe' });
  await fastify.register(animeunity, { prefix: '/animeunity' });
  await fastify.register(hianime, { prefix: '/hianime' });
  await fastify.register(animekai, { prefix: '/animekai' });
  await fastify.register(animesaturn, { prefix: '/animesaturn' });
  await fastify.register(kickassanime, { prefix: '/kickassanime' });

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Anime 🗾');
  });

  fastify.get('/:animeProvider', async (request: FastifyRequest, reply: FastifyReply) => {
    const queries: { animeProvider: string; page: number } = {
      animeProvider: '',
      page: 1,
    };

    queries.animeProvider = decodeURIComponent(
      (request.params as { animeProvider: string; page: number }).animeProvider,
    );

    queries.page = (request.query as { animeProvider: string; page: number }).page;

    if (queries.page! < 1) queries.page = 1;

    const provider = PROVIDERS_LIST.ANIME.find(
      (provider: any) => provider.toString.name === queries.animeProvider,
    );

    try {
      if (provider) {
        reply.redirect(`/anime/${provider.toString.name}`);
      } else {
        reply
          .status(404)
          .send({ message: 'Provider not found, please check the providers list.' });
      }
    } catch (err) {
      reply.status(500).send('Something went wrong. Please try again later.');
    }
  });
};

export default routes;
