import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers, SubOrSub } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const hianime = new ANIME.Hianime();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the hianime provider: check out the provider's website @ https://hianime.to`,
      routes: [
        '/:query',
        '/info',
        '/watch/:episodeId',
        '/advanced-search',
        '/top-airing',
        '/most-popular',
        '/most-favorite',
        '/latest-completed',
        '/recently-updated',
        '/recently-added',
        '/top-upcoming',
        '/studio/:studio',
        '/subbed-anime',
        '/dubbed-anime',
        '/movie',
        '/tv',
        '/ova',
        '/ona',
        '/special',
        '/genres',
        '/genre/:genre',
        '/schedule',
        '/spotlight',
        '/search-suggestions/:query',
      ],
      documentation: 'https://docs.consumet.org/#tag/hianime',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;
    const page = (request.query as { page: number }).page;

    const res = await hianime.search(query, page);

    reply.status(200).send(res);
  });

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      const res = await hianime
        .fetchAnimeInfo(id)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
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
      const server = (request.query as { server: StreamingServers }).server;
      const category = (request.query as { category: SubOrSub }).category;

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'episodeId is required' });

      try {
        const res = await hianime
          .fetchEpisodeSources(episodeId, server, category)
          .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get('/genres', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const res = await hianime.fetchGenres();

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/schedule', async (request: FastifyRequest, reply: FastifyReply) => {
    const date = (request.query as { date: string }).date;

    try {
      const res = await hianime.fetchSchedule(date);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/spotlight', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const res = await hianime.fetchSpotlight();

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get(
    '/search-suggestions/:query',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = (request.params as { query: string }).query;

      try {
        const res = await hianime.fetchSearchSuggestions(query);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get(
    '/advanced-search',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        page = 1,
        type,
        status,
        rated,
        score,
        season,
        language,
        startDate,
        endDate,
        sort,
        genres,
      } = request.query as {
        page?: number;
        type?: string;
        status?: string;
        rated?: string;
        score?: number;
        season?: string;
        language?: string;
        startDate?: string;
        endDate?: string;
        sort?: string;
        genres?: string;
      };

      try {
        let parsedStartDate, parsedEndDate;
        if (startDate) {
          const [year, month, day] = startDate.split('-').map(Number);
          parsedStartDate = { year, month, day };
        }
        if (endDate) {
          const [year, month, day] = endDate.split('-').map(Number);
          parsedEndDate = { year, month, day };
        }

        const genresArray = genres ? genres.split(',') : undefined;

        const res = await hianime.fetchAdvancedSearch(
          page,
          type,
          status,
          rated,
          score,
          season,
          language,
          parsedStartDate,
          parsedEndDate,
          sort,
          genresArray,
        );

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get('/top-airing', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      const res = await hianime.fetchTopAiring(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/most-popular', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      const res = await hianime.fetchMostPopular(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/most-favorite', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      const res = await hianime.fetchMostFavorite(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get(
    '/latest-completed',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;

      try {
        const res = await hianime.fetchLatestCompleted(page);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get(
    '/recently-updated',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const page = (request.query as { page: number }).page;

      try {
        const res = await hianime.fetchRecentlyUpdated(page);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  fastify.get('/recently-added', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      const res = await hianime.fetchRecentlyAdded(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/top-upcoming', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      const res = await hianime.fetchTopUpcoming(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/studio/:studio', async (request: FastifyRequest, reply: FastifyReply) => {
    const studio = (request.params as { studio: string }).studio;
    const page = (request.query as { page: number }).page;

    try {
      const res = await hianime.fetchStudio(studio, page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/subbed-anime', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      const res = await hianime.fetchSubbedAnime(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/dubbed-anime', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      const res = await hianime.fetchDubbedAnime(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/movie', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      const res = await hianime.fetchMovie(page);

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
      const res = await hianime.fetchTV(page);

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
      const res = await hianime.fetchOVA(page);

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
      const res = await hianime.fetchONA(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/special', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;

    try {
      const res = await hianime.fetchSpecial(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/genre/:genre', async (request: FastifyRequest, reply: FastifyReply) => {
    const genre = (request.params as { genre: string }).genre;
    const page = (request.query as { page: number }).page;

    try {
      const res = await hianime.genreSearch(genre, page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });
};

export default routes;
