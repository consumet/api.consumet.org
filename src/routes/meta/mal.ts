import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { META, PROVIDERS_LIST } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  let mal = new META.Myanimelist();

  fastify.get('/', {
    schema: {
      description: 'Get MyAnimeList provider info and available routes',
      tags: ['mal'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the mal provider: check out the provider's website @ https://mal.co/",
      routes: ['/:query', '/info/:id', '/watch/:episodeId'],
      documentation: 'https://docs.consumet.org/#tag/mal',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for anime',
      tags: ['mal'],
      params: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Page number', default: 1 },
          perPage: { type: 'number', description: 'Results per page', default: 20 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const page = (request.query as { page: number }).page;
    const perPage = (request.query as { perPage: number }).perPage;

    const res = await mal.search(query, page);

    reply.status(200).send(res);
  });

  // mal info with episodes
  fastify.get('/info/:id', {
    schema: {
      description: 'Get anime info with episodes',
      tags: ['mal'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Anime ID' },
        },
        required: ['id'],
      },
      querystring: {
        type: 'object',
        properties: {
          provider: { type: 'string', description: 'Provider name' },
          fetchFiller: { type: 'boolean', description: 'Fetch filler episodes', default: false },
          dub: { type: 'boolean', description: 'Get dubbed version', default: false },
          locale: { type: 'string', description: 'Locale for episode titles' },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.params as { id: string }).id;

    const provider = (request.query as { provider?: string }).provider;
    let fetchFiller = (request.query as { fetchFiller?: string | boolean }).fetchFiller;
    let isDub = (request.query as { dub?: string | boolean }).dub;
    const locale = (request.query as { locale?: string }).locale;

    if (typeof provider !== 'undefined') {
      const possibleProvider = PROVIDERS_LIST.ANIME.find(
        (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
      );

      mal = new META.Myanimelist(possibleProvider);
    }

    if (isDub === 'true' || isDub === '1') isDub = true;
    else isDub = false;

    if (fetchFiller === 'true' || fetchFiller === '1') fetchFiller = true;
    else fetchFiller = false;

    try {
      const res = await mal.fetchAnimeInfo(id, isDub as boolean, fetchFiller as boolean);

      mal = new META.Myanimelist(undefined);
      reply.status(200).send(res);
    } catch (err: any) {
      reply.status(500).send({ message: err.message });
    }
  });

  fastify.get(
    '/watch/:episodeId',
    {
      schema: {
        description: 'Get streaming sources for an episode',
        tags: ['mal'],
        params: {
          type: 'object',
          properties: {
            episodeId: { type: 'string', description: 'Episode ID' },
          },
          required: ['episodeId'],
        },
        querystring: {
          type: 'object',
          properties: {
            provider: { type: 'string', description: 'Provider name' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;
      const provider = (request.query as { provider?: string }).provider;

      if (typeof provider !== 'undefined') {
        const possibleProvider = PROVIDERS_LIST.ANIME.find(
          (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
        );

        mal = new META.Myanimelist(possibleProvider);
      }
      try {
        const res = await mal
          .fetchEpisodeSources(episodeId)
          .catch((err) => reply.status(404).send({ message: err }));

        mal = new META.Myanimelist(undefined);
        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );
};

export default routes;
