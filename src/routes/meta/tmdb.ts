import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { META, PROVIDERS_LIST, StreamingServers } from '@consumet/extensions';
import { tmdbApi } from '../../main';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get('/', {
    schema: {
      description: 'Get TMDB provider info and available routes',
      tags: ['tmdb'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the tmdb provider: check out the provider's website @ https://www.themoviedb.org/",
      routes: ['/:query', '/info/:id', '/watch/:episodeId'],
      documentation: 'https://docs.consumet.org/#tag/tmdb',
    });
  });

  fastify.get('/:query', {
    schema: {
      description: 'Search for movies or TV shows',
      tags: ['tmdb'],
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
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;
    const page = (request.query as { page: number }).page;
    const tmdb = new META.TMDB(tmdbApi);

    const res = await tmdb.search(query, page);

    reply.status(200).send(res);
  });

  fastify.get('/info/:id', {
    schema: {
      description: 'Get movie or TV show details by ID',
      tags: ['tmdb'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Media ID' },
        },
        required: ['id'],
      },
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'Type (movie or tv)', enum: ['movie', 'tv'] },
          provider: { type: 'string', description: 'Provider name' },
        },
        required: ['type'],
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.params as { id: string }).id;
    const type = (request.query as { type: string }).type;
    const provider = (request.query as { provider?: string }).provider;
    let tmdb = new META.TMDB(tmdbApi);

    if (!type) return reply.status(400).send({ message: "The 'type' query is required" });

    if (typeof provider !== 'undefined') {
      const possibleProvider = PROVIDERS_LIST.MOVIES.find(
        (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
      );
      tmdb = new META.TMDB(tmdbApi, possibleProvider);
    }

    const res = await tmdb.fetchMediaInfo(id, type);
    reply.status(200).send(res);
  });

  fastify.get('/trending', {
    schema: {
      description: 'Get trending movies and TV shows',
      tags: ['tmdb'],
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'Type (all, movie, tv)', default: 'all' },
          timePeriod: { type: 'string', description: 'Time period (day or week)', enum: ['day', 'week'], default: 'day' },
          page: { type: 'number', description: 'Page number', default: 1 },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const validTimePeriods = new Set(['day', 'week'] as const);
    type validTimeType = typeof validTimePeriods extends Set<infer T> ? T : undefined;

    const type = (request.query as { type?: string }).type || 'all';
    let timePeriod =
      (request.query as { timePeriod?: validTimeType }).timePeriod || 'day';

    // make day as default time period
    if (!validTimePeriods.has(timePeriod)) timePeriod = 'day';

    const page = (request.query as { page?: number }).page || 1;

    const tmdb = new META.TMDB(tmdbApi);

    try {
      const res = await tmdb.fetchTrending(type, timePeriod, page);
      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({ message: 'Failed to fetch trending media.' });
    }
  });

  const watchSchema = {
    schema: {
      description: 'Get streaming sources for an episode',
      tags: ['tmdb'],
      params: {
        type: 'object',
        properties: {
          episodeId: { type: 'string', description: 'Episode ID' },
        },
      },
      querystring: {
        type: 'object',
        properties: {
          episodeId: { type: 'string', description: 'Episode ID (alternative to param)' },
          id: { type: 'string', description: 'Media ID' },
          provider: { type: 'string', description: 'Provider name' },
          server: { type: 'string', description: 'Streaming server' },
        },
      },
    },
  };
  const watch = async (request: FastifyRequest, reply: FastifyReply) => {
    let episodeId = (request.params as { episodeId: string }).episodeId;
    if (!episodeId) {
      episodeId = (request.query as { episodeId: string }).episodeId;
    }
    const id = (request.query as { id: string }).id;
    const provider = (request.query as { provider?: string }).provider;
    const server = (request.query as { server?: StreamingServers }).server;

    let tmdb = new META.TMDB(tmdbApi);
    if (typeof provider !== 'undefined') {
      const possibleProvider = PROVIDERS_LIST.MOVIES.find(
        (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
      );
      tmdb = new META.TMDB(tmdbApi, possibleProvider);
    }
    try {
      const res = await tmdb
        .fetchEpisodeSources(episodeId, id, server)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  };
  fastify.get('/watch', watchSchema, watch);
  fastify.get('/watch/:episodeId', watchSchema, watch);
};

export default routes;
