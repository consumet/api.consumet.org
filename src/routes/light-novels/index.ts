import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { PROVIDERS_LIST } from '@consumet/extensions';
import mongoose from 'mongoose';

import readlightnovels from './readlightnovels';
import { IAnimeProviderParams, animeSchema } from '../../models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(readlightnovels, { prefix: '/' });

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Light Novels');
  });

  fastify.get('/:animeProvider', async (request: FastifyRequest, reply: FastifyReply) => {
    const queries: IAnimeProviderParams = { animeProvider: '', page: 1 };

    queries.animeProvider = decodeURIComponent(
      (request.params as IAnimeProviderParams).animeProvider
    );

    queries.page = (request.query as IAnimeProviderParams).page;

    if (queries.page! < 1) queries.page = 1;

    const provider = PROVIDERS_LIST.ANIME.find(
      (provider: any) => provider.toString.name === queries.animeProvider
    );

    try {
      if (provider) {
        reply.redirect(`/light-novels/${provider.toString.name}`);
      } else {
        reply
          .status(404)
          .send(
            "Anime not found. if you're looking for a provider, please check the provider list."
          );
      }
    } catch (err) {
      reply.status(500).send('Something went wrong. Please try again later.');
    }
  });
};

export default routes;
