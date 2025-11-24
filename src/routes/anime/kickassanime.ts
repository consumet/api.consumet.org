import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const kickassanime = new ANIME.KickAssAnime();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the kickassanime provider: check out the provider's website @ https://www1.kickassanime.mx`,
      routes: ['/:query', '/info', '/watch/:episodeId', '/servers/:episodeId'],
      documentation: 'https://docs.consumet.org/#tag/kickassanime',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;
    const page = (request.query as { page: number }).page;

    const res = await kickassanime.search(query, page);

    reply.status(200).send(res);
  });

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      const res = await kickassanime
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

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'episodeId is required' });

      try {
        const res = await kickassanime
          .fetchEpisodeSources(episodeId, server)
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

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'episodeId is required' });

      try {
        const res = await kickassanime
          .fetchEpisodeServers(episodeId)
          .catch((err) => reply.status(404).send({ message: err }));

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
