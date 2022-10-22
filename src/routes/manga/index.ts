import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { PROVIDERS_LIST } from '@consumet/extensions';

import mangadex from './mangadex';
import mangahere from './mangahere';
import mangakakalot from './mangakakalot';
import mangasee123 from './mangasee123';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(mangadex, { prefix: '/' });
  await fastify.register(mangahere, { prefix: '/' });
  await fastify.register(mangakakalot, { prefix: '/' });
  await fastify.register(mangasee123, { prefix: '/' });

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Manga');
  });

  fastify.get('/:mangaProvider', async (request: FastifyRequest, reply: FastifyReply) => {
    const queries: { mangaProvider: string; page: number } = {
      mangaProvider: '',
      page: 1,
    };

    queries.mangaProvider = decodeURIComponent(
      (request.params as { mangaProvider: string; page: number }).mangaProvider
    );

    queries.page = (request.query as { mangaProvider: string; page: number }).page;

    if (queries.page! < 1) queries.page = 1;

    const provider = PROVIDERS_LIST.MANGA.find(
      (provider: any) => provider.toString.name === queries.mangaProvider
    );

    try {
      if (provider) {
        reply.redirect(`/manga/${provider.toString.name}`);
      } else {
        reply
          .status(404)
          .send({ message: 'Page not found, please check the provider list.' });
      }
    } catch (err) {
      reply.status(500).send('Something went wrong. Please try again later.');
    }
  });
};

export default routes;
