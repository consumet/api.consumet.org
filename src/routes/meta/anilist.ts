import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { META, PROVIDERS_LIST } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  let anilist = new META.Anilist();

  fastify.get('/anilist', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the anilist provider: check out the provider's website @ https://anilist.co/",
      routes: ['/:query', '/info/:id', '/watch/:episodeId'],
      documentation: 'https://docs.consumet.org/#tag/anilist',
    });
  });

  fastify.get('/anilist/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const page = (request.query as { page: number }).page;
    const perPage = (request.query as { perPage: number }).perPage;

    const res = await anilist.search(query, page, perPage);

    reply.status(200).send(res);
  });

  fastify.get(
    '/anilist/trending',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;
      const perPage = (request.query as { perPage: number }).perPage;

      const res = await anilist.fetchTrendingAnime(page, perPage);

      reply.status(200).send(res);
    }
  );

  fastify.get(
    '/anilist/popular',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;
      const perPage = (request.query as { perPage: number }).perPage;

      const res = await anilist.fetchPopularAnime(page, perPage);

      reply.status(200).send(res);
    }
  );

  fastify.get(
    '/anilist/airing-schedule',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;
      const perPage = (request.query as { perPage: number }).perPage;
      const weekStart = (request.query as { weekStart: number }).weekStart;
      const weekEnd = (request.query as { weekEnd: number }).weekEnd;
      const notYetAired = (request.query as { notYetAired: boolean }).notYetAired;

      const res = await anilist.fetchAiringSchedule(
        page,
        perPage,
        weekStart,
        weekEnd,
        notYetAired
      );

      reply.status(200).send(res);
    }
  );

  fastify.get(
    '/anilist/info/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = (request.params as { id: string }).id;

      const provider = (request.query as { provider?: string }).provider;
      let isDub = (request.query as { dub?: string | boolean }).dub;

      if (typeof provider !== 'undefined') {
        const possibleProvider = PROVIDERS_LIST.ANIME.find(
          (p) => p.name.toLowerCase() === provider.toLocaleLowerCase()
        );
        anilist = new META.Anilist(possibleProvider);
      }

      if (isDub === 'true' || isDub === '1') isDub = true;
      else isDub = false;

      try {
        const res = await anilist
          .fetchAnimeInfo(id, isDub as boolean)
          .catch((err) => reply.status(404).send({ message: err }));

        anilist = new META.Anilist();
        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    }
  );

  fastify.get(
    '/anilist/watch/:episodeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;
      const provider = (request.query as { provider?: string }).provider;

      if (typeof provider !== 'undefined') {
        const possibleProvider = PROVIDERS_LIST.ANIME.find(
          (p) => p.name.toLowerCase() === provider.toLocaleLowerCase()
        );
        anilist = new META.Anilist(possibleProvider);
      }
      try {
        const res = await anilist
          .fetchEpisodeSources(episodeId)
          .catch((err) => reply.status(404).send({ message: err }));

        anilist = new META.Anilist();
        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    }
  );
};

export default routes;
