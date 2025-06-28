import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers, SubOrSub } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const animeowl = new ANIME.AnimeOwl(process.env.ANIMEOWL_URL);
  let baseUrl = 'https://animeowl.me';
  if (process.env.ANIMEOWL_URL) {
    baseUrl = `https://${process.env.ANIMEOWL_URL}`;
  }

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the animeowl provider: check out the provider's website @ ${baseUrl}`,
      routes: [
        '/:query',
        '/recent-episodes',
        '/top-airing',
        '/spotlight',
        '/search-suggestions/:query',
        '/info?id',
        '/watch/:episodeId',
        '/watch?episodeId',
        '/genre/list',
        '/genre/:genre',
        '/movies',
        '/ona',
        '/ova',
        '/specials',
        '/tv',
      ],
      documentation: 'https://docs.consumet.org/#tag/animeowl',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const page = (request.query as { page: number }).page;

    const res = await animeowl.search(query, page);

    reply.status(200).send(res);
  });

  fastify.get(
    '/recent-episodes',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;

      const res = await animeowl.fetchRecentlyUpdated(page);

      reply.status(200).send(res);
    },
  );

  fastify.get('/top-airing', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    const res = await animeowl.fetchTopAiring(page);

    reply.status(200).send(res);
  });


  fastify.get('/spotlight', async (request: FastifyRequest, reply: FastifyReply) => {
    const res = await animeowl.fetchSpotlight();

    reply.status(200).send(res);
  });

  fastify.get(
    '/search-suggestions/:query',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = (request.params as { query: string }).query;

      const res = await animeowl.fetchSearchSuggestions(query);

      reply.status(200).send(res);
    },
  );

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      const res = await animeowl
        .fetchAnimeInfo(id)
        .catch((err) => reply.status(404).send({ message: err }));

      return reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });
  const watch = async (request: FastifyRequest, reply: FastifyReply) => {
    let episodeId = (request.params as { episodeId: string }).episodeId;
    if (!episodeId) {
      episodeId = (request.query as { episodeId: string }).episodeId;
    }

    const server = (request.query as { server: string }).server as StreamingServers;
    let dub = (request.query as { dub?: string | boolean }).dub;
    if (dub === 'true' || dub === '1') dub = true;
    else dub = false;

    if (server && !Object.values(StreamingServers).includes(server))
      return reply.status(400).send({ message: 'server is invalid' });

    if (typeof episodeId === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      const res = await animeowl
        .fetchEpisodeSources(
          episodeId,
          server,
          dub === true ? SubOrSub.DUB : SubOrSub.SUB,
        )
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  };
  fastify.get('/watch', watch);
  fastify.get('/watch/:episodeId', watch);

  fastify.get('/genre/list', async (_, reply) => {
    try {
      const res = await animeowl.fetchGenres();
      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/genre/:genre', async (request: FastifyRequest, reply: FastifyReply) => {
    const genre = (request.params as { genre: string }).genre;
    const page = (request.query as { page: number }).page;

    if (typeof genre === 'undefined')
      return reply.status(400).send({ message: 'genre is required' });

    try {
      const res = await animeowl.genreSearch(genre, page);
      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/movies', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      const res = await animeowl.fetchMovie(page);
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/ona', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      const res = await animeowl.fetchONA(page);
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/ova', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      const res = await animeowl.fetchOVA(page);
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/specials', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      const res = await animeowl.fetchSpecial(page);
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/tv', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      const res = await animeowl.fetchTV(page);
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });
};

export default routes;
