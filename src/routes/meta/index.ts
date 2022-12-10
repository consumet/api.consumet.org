import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { PROVIDERS_LIST } from '@consumet/extensions';

import anilist from './anilist';
import anilistManga from './anilist-manga';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(anilist, { prefix: '/' });
  await fastify.register(anilistManga, { prefix: '/' });

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Meta');
  });

  fastify.get('/:metaProvider', async (request: FastifyRequest, reply: FastifyReply) => {
    const queries: { metaProvider: string; page: number } = {
      metaProvider: '',
      page: 1,
    };

    queries.metaProvider = decodeURIComponent(
      (request.params as { metaProvider: string; page: number }).metaProvider
    );

    queries.page = (request.query as { metaProvider: string; page: number }).page;

    if (queries.page! < 1) queries.page = 1;

    const provider = PROVIDERS_LIST.META.find(
      (provider: any) => provider.toString.name === queries.metaProvider
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
