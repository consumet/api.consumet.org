import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { META, PROVIDERS_LIST } from '@consumet/extensions';
import { Genres } from '@consumet/extensions/dist/models';

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
    'anilist/advanced-search',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = (request.query as { query: string }).query;
      const page = (request.query as { page: number }).page;
      const perPage = (request.query as { perPage: number }).perPage;
      const type = (request.query as { type: string }).type;
      let genres = (request.query as { genres: string | string[] }).genres;
      const id = (request.query as { id: string }).id;
      const format = (request.query as { format: string }).format;
      let sort = (request.query as { sort: string | string[] }).sort;

      if (genres) {
        JSON.parse(genres as string).forEach((genre: string) => {
          if (!Object.values(Genres).includes(genre as Genres)) {
            return reply.status(400).send({ message: `${genre} is not a valid genre` });
          }
        });

        genres = JSON.parse(genres as string);
      }

      if (sort) sort = JSON.parse(sort as string);

      const res = await anilist.advancedSearch(
        query,
        type,
        page,
        perPage,
        format,
        sort as string[],
        genres as string[],
        id
      );

      reply.status(200).send(res);
    }
  );

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

  fastify.get('/anilist/genre', async (request: FastifyRequest, reply: FastifyReply) => {
    const genres = (request.query as { genres: string }).genres;
    const page = (request.query as { page: number }).page;
    const perPage = (request.query as { perPage: number }).perPage;

    if (typeof genres === 'undefined')
      return reply.status(400).send({ message: 'genres is required' });

    JSON.parse(genres).forEach((genre: string) => {
      if (!Object.values(Genres).includes(genre as Genres)) {
        return reply.status(400).send({ message: `${genre} is not a valid genre` });
      }
    });

    const res = await anilist.fetchAnimeGenres(JSON.parse(genres), page, perPage);

    reply.status(200).send(res);
  });

  fastify.get(
    '/anilist/recent-episodes',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const provider = (request.query as { provider: 'gogoanime' | 'zoro' }).provider;
      const page = (request.query as { page: number }).page;
      const perPage = (request.query as { perPage: number }).perPage;

      const res = await anilist.fetchRecentEpisodes(provider, page, perPage);

      reply.status(200).send(res);
    }
  ),
    fastify.get(
      '/anilist/random-anime',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const res = await anilist.fetchRandomAnime().catch((err) => {
          return reply.status(404).send({ message: 'Anime not found' });
        });
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
