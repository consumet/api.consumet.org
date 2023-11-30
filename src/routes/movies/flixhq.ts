import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MOVIES } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

import cache from '../../utils/cache';
import { redis } from '../../main';
import { Redis } from 'ioredis';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const flixhq = new MOVIES.FlixHQ();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the flixhq provider: check out the provider's website @ https://flixhq.to/",
      routes: ['/:query', '/info', '/watch'],
      documentation: 'https://docs.consumet.org/#tag/flixhq',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = decodeURIComponent((request.params as { query: string }).query);

    const page = (request.query as { page: number }).page;

    let res = redis
      ? await cache.fetch(
          redis as Redis,
          `flixhq:${query}:${page}`,
          async () => await flixhq.search(query, page ? page : 1),
          60 * 60 * 6,
        )
      : await flixhq.search(query, page ? page : 1);

    reply.status(200).send(res);
  });

  fastify.get('/recent-shows', async (request: FastifyRequest, reply: FastifyReply) => {
    let res = redis
      ? await cache.fetch(
          redis as Redis,
          `flixhq:recent-shows`,
          async () => await flixhq.fetchRecentTvShows(),
          60 * 60 * 3,
        )
      : await flixhq.fetchRecentTvShows();

    reply.status(200).send(res);
  });

  fastify.get('/recent-movies', async (request: FastifyRequest, reply: FastifyReply) => {
    let res = redis
      ? await cache.fetch(
          redis as Redis,
          `flixhq:recent-movies`,
          async () => await flixhq.fetchRecentMovies(),
          60 * 60 * 3,
        )
      : await flixhq.fetchRecentMovies();

    reply.status(200).send(res);
  });

  fastify.get('/trending', async (request: FastifyRequest, reply: FastifyReply) => {
    const type = (request.query as { type: string }).type;
    try {
      if (!type) {
        const res = {
          results: [
            ...(await flixhq.fetchTrendingMovies()),
            ...(await flixhq.fetchTrendingTvShows()),
          ],
        };
        return reply.status(200).send(res);
      }

      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `flixhq:trending:${type}`,
            async () =>
              type === 'tv'
                ? await flixhq.fetchTrendingTvShows()
                : await flixhq.fetchTrendingMovies(),
            60 * 60 * 3,
          )
        : type === 'tv'
          ? await flixhq.fetchTrendingTvShows()
          : await flixhq.fetchTrendingMovies();

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message:
          'Something went wrong. Please try again later. or contact the developers.',
      });
    }
  });

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (typeof id === 'undefined')
      return reply.status(400).send({
        message: 'id is required',
      });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `flixhq:info:${id}`,
            async () => await flixhq.fetchMediaInfo(id),
            60 * 60 * 3,
          )
        : await flixhq.fetchMediaInfo(id);

      reply.status(200).send(res);
    } catch (err) {
      reply.status(500).send({
        message:
          'Something went wrong. Please try again later. or contact the developers.',
      });
    }
  });

  fastify.get('/watch', async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.query as { episodeId: string }).episodeId;
    const mediaId = (request.query as { mediaId: string }).mediaId;
    const server = (request.query as { server: StreamingServers }).server;

    if (typeof episodeId === 'undefined')
      return reply.status(400).send({ message: 'episodeId is required' });
    if (typeof mediaId === 'undefined')
      return reply.status(400).send({ message: 'mediaId is required' });

    if (server && !Object.values(StreamingServers).includes(server))
      return reply.status(400).send({ message: 'Invalid server query' });

    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `flixhq:watch:${episodeId}:${mediaId}:${server}`,
            async () => await flixhq.fetchEpisodeSources(episodeId, mediaId, server),
            60 * 30,
          )
        : await flixhq.fetchEpisodeSources(episodeId, mediaId, server);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/servers', async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.query as { episodeId: string }).episodeId;
    const mediaId = (request.query as { mediaId: string }).mediaId;
    try {
      let res = redis
        ? await cache.fetch(
            redis as Redis,
            `flixhq:servers:${episodeId}:${mediaId}`,
            async () => await flixhq.fetchEpisodeServers(episodeId, mediaId),
            60 * 30,
          )
        : await flixhq.fetchEpisodeServers(episodeId, mediaId);

      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message:
          'Something went wrong. Please try again later. or contact the developers.',
      });
    }
  });
};

export default routes;
