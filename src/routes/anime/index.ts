import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import ANIME, { PROVIDERS_LIST } from 'consumet-extentions';
import { BaseProvider } from 'consumet-extentions/dist/models';

import gogoanime from './en/gogoanime';
import { IAnimeProviderParams } from '../../models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(gogoanime, { prefix: '/' });

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Anime');
  });

  fastify.get('/:animeProvider', async (request: FastifyRequest, reply: FastifyReply) => {
    const { animeProvider, page } = request.params as IAnimeProviderParams;

    const provider = PROVIDERS_LIST.ANIME.find(
      (provider: BaseProvider) => provider.toString.name === animeProvider
    );

    if (provider) {
      reply.redirect(`/anime/${provider.toString.name}`);
    } else {
      // default route for animes
      const gogoanime = new ANIME.en.Gogoanime();
      const res = await gogoanime.search(animeProvider, page);

      if (res.length > 0) {
        reply.status(200).send(res);
      } else {
        reply
          .status(200)
          .send(
            "Anime not found. if you're looking for a provider, please check the provider list."
          );
      }
    }
  });
};

export default routes;
