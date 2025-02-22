import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MOVIES } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const multimovies = new MOVIES.MultiMovies(process.env.MULTIMOVIES_URL);
  let baseUrl = 'https://multimovies.life';
  if (process.env.MULTIMOVIES_URL) {
    baseUrl = `https://${process.env.MULTIMOVIES_URL}`;
  }

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the multimovies provider: check out the provider's website @ ${baseUrl}`,
      routes: ['/:query', '/info', '/watch', '/servers', '/popular', '/genre/:genre'],
      documentation: 'https://docs.consumet.org/#tag/multimovies',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = decodeURIComponent((request.params as { query: string }).query);

      const page = (request.query as { page: number }).page;

      const res = await multimovies.search(query, page);

      reply.status(200).send(res);
    } catch (err) {
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
      const res = await multimovies
        .fetchMediaInfo(id)
        .catch((err) => reply.status(404).send({ message: err }));

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
    try {
      const res = await multimovies
        .fetchEpisodeSources(episodeId, mediaId, server)
        .catch((err) => reply.status(404).send({ message: 'Media Not found.' }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/servers', async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.query as { episodeId: string }).episodeId;

    if (typeof episodeId === 'undefined')
      return reply.status(400).send({ message: 'episodeId is required' });

    try {
      const res = await multimovies.fetchEpisodeServers(episodeId);
      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({
        message:
          'Something went wrong. Please try again later. or contact the developers.',
      });
    }
  });

  fastify.get('/popular', async (request: FastifyRequest, reply: FastifyReply) => {
    const page = (request.query as { page: number }).page;
    try {
      const res = await multimovies.fetchPopular(page ? page : 1);
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/genre/:genre', async (request: FastifyRequest, reply: FastifyReply) => {
    const genre = (request.params as { genre: string }).genre;
    const page = (request.query as { page: number }).page ?? 1;
    try {
      const res = await multimovies.fetchByGenre(genre, page);
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
