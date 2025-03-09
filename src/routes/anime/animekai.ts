import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers, SubOrSub } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const animekai = new ANIME.AnimeKai(process.env.ANIMEKAI_URL);
  let baseUrl = 'https://animekai.to';
  if (process.env.ANIMEKAI_URL) {
    baseUrl = `https://${process.env.ANIMEKAI_URL}`;
  }

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the animekai provider: check out the provider's website @ ${baseUrl}`,
      routes: [
        '/:query',
        '/latest-completed',
        '/new-releases',
        '/recent-added',
        '/recent-episodes',
        '/schedule/:date',
        '/spotlight',
        '/search-suggestions/:query',
        '/info',
        '/watch/:episodeId',
        '/genre/list',
        '/genre/:genre',
        '/movies',
        '/ona',
        '/ova',
        '/specials',
        '/tv',
      ],
      documentation: 'https://docs.consumet.org/#tag/animekai',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const page = (request.query as { page: number }).page;

    const res = await animekai.search(query, page);

    reply.status(200).send(res);
  });

  fastify.get(
    '/latest-completed',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;
      try {
        const res = await animekai.fetchLatestCompleted(page);
        reply.status(200).send(res);
      } catch (error) {
        reply.status(500).send({
          message: 'Something went wrong. Contact developer for help.',
        });
      }
    },
  );

  fastify.get('/new-releases', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      const res = await animekai.fetchNewReleases(page);
      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/recent-added', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      const res = await animekai.fetchRecentlyAdded(page);
      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/recent-episodes', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      const res = await animekai.fetchRecentlyUpdated(page);
      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/schedule/:date', async (request: FastifyRequest, reply: FastifyReply) => {
    const date = (request.params as { date: string }).date;
    try {
      const res = await animekai.fetchSchedule(date);
      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get('/spotlight', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const res = await animekai.fetchSpotlight();
      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message: 'Something went wrong. Contact developer for help.',
      });
    }
  });

  fastify.get(
    '/search-suggestions/:query',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = (request.params as { query: string }).query;

      if (typeof query === 'undefined')
        return reply.status(400).send({ message: 'query is required' });

      try {
        const res = await animekai.fetchSearchSuggestions(query);
        reply.status(200).send(res);
      } catch (error) {
        reply.status(500).send({
          message: 'Something went wrong. Contact developer for help.',
        });
      }
    },
  );

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      const res = await animekai
        .fetchAnimeInfo(id)
        .catch((err) => reply.status(404).send({ message: err }));

      return reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get(
    '/watch/:episodeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;
      const server = (request.query as { server: string }).server as StreamingServers;

      let dub = (request.query as { dub?: string | boolean }).dub;
      if (dub === 'true' || dub === '1') dub = true;
      else dub = false;

      if (server && !Object.values(StreamingServers).includes(server))
        return reply.status(400).send({ message: 'server is invalid' });

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'id is required' });
      try {
        const res = await animekai
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
    },
  );

  fastify.get(
    '/servers/:episodeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;
      let dub = (request.query as { dub?: string | boolean }).dub;
      if (dub === 'true' || dub === '1') dub = true;
      else dub = false;

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'id is required' });

      try {
        const res = await animekai
          .fetchEpisodeServers(episodeId, dub === true ? SubOrSub.DUB : SubOrSub.SUB)
          .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get('/genre/list', async (_, reply) => {
    try {
      const res = await animekai.fetchGenres();
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
      const res = await animekai.genreSearch(genre, page);
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
      const res = await animekai.fetchMovie(page);
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
      const res = await animekai.fetchONA(page);
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
      const res = await animekai.fetchOVA(page);
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
      const res = await animekai.fetchSpecial(page);
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
      const res = await animekai.fetchTV(page);
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });
};

export default routes;
