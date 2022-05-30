import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import ANIME, { PROVIDERS_LIST } from 'consumet-extentions';
import mongoose from 'mongoose';

import gogoanime from './en/gogoanime';
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
        // const gogoanime = new ANIME.en.Gogoanime();
        // const res = await gogoanime.search(queries.animeProvider, queries.page);

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
    currentProvider: 'gogoanime.gg',
    hasNextPage: false,
    currentPage: 1,
    results: [],
  };
  // default route for animes
  const animeModel = mongoose.model('Anime', animeSchema);
  const res = await animeModel
    .find(
      {
        $or: [
          {
            otherNames: { $regex: queries.animeProvider, $options: 'i' },
            title: { $regex: queries.animeProvider, $options: 'i' },
          },
        ],
      },
      { _id: 0 }
    )
    .skip(((queries.page ?? 1) - 1) * 10)
    .limit(10);

  results.results = res;
  results.hasNextPage =
    (
      await animeModel
        .find(
          {
            $or: [
              {
                otherNames: { $regex: queries.animeProvider, $options: 'i' },
                title: { $regex: queries.animeProvider, $options: 'i' },
              },
            ],
          },
          { _id: 0 }
        )
        .skip(((queries.page ?? 1) + 1 - 1) * 10)
        .limit(10)
    ).length > 0;

  results.currentPage = queries.page ?? 1;

  return results;
};

export default routes;
