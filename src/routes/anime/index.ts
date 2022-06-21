import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { PROVIDERS_LIST } from '@consumet/extensions';
import mongoose from 'mongoose';

import gogoanime from './gogoanime';
import { IAnimeProviderParams, animeSchema } from '../../models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(gogoanime, { prefix: '/' });

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Anime');
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
        reply.redirect(`/anime/${provider.toString.name}`);
      } else {
        const res = await handleSearch(queries);

        if (res.results.length > 0) {
          reply.status(200).send(res);
        } else {
          reply
            .status(404)
            .send(
              "Anime not found. if you're looking for a provider, please check the provider list."
            );
        }
      }
    } catch (err) {
      reply.status(500).send('Something went wrong. Please try again later.');
    }
  });
};

/**
 * Fast search
 */
const handleSearch = async (queries: IAnimeProviderParams) => {
  const results: {
    currentProvider: string;
    hasNextPage: boolean;
    currentPage: number;
    results: any[];
  } = {
    currentProvider: 'gogoanime',
    hasNextPage: false,
    currentPage: 1,
    results: [],
  };

  results.currentPage = queries.page ?? 1;

  // default route for animes
  const animeModel = mongoose.model('Anime', animeSchema);
  let res = await handleQuery(animeModel, results.currentPage, {
    title: new RegExp(queries.animeProvider, 'i'),
  });

  if (res.length < 1) {
    res = await handleQuery(animeModel, results.currentPage, {
      otherNames: new RegExp(queries.animeProvider, 'i'),
    });
  }

  results.results = res;

  let nextPage = await handleQuery(animeModel, results.currentPage + 1, {
    title: new RegExp(queries.animeProvider, 'i'),
  });
  if (nextPage.length < 1) {
    nextPage = await handleQuery(animeModel, results.currentPage + 1, {
      otherNames: new RegExp(queries.animeProvider, 'i'),
    });
  }

  results.hasNextPage = nextPage.length > 0;

  return results;
};

const handleQuery = async (
  model: mongoose.Model<any, {}, {}, {}>,
  page: number,
  properties: { [key: string]: RegExp }
) => {
  const res = await model
    .find(properties, { _id: 0 })
    .skip((page - 1) * 10)
    .limit(10);

  return res;
};

export default routes;
