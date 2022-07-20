import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const gogoanime = new ANIME.Gogoanime();

  fastify.get('/gogoanime', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the gogoanime provider: check out the provider's website @ https://gogoanime.gg/",
      routes: [
        '/:query',
        '/info/:id',
        '/watch/:episodeId',
        '/servers/:episodeId',
        '/top-airing',
        '/recent-episodes',
      ],
      documentation: 'https://docs.consumet.org/#tag/gogoanime',
    });
  });

  fastify.get(
    '/gogoanime/:query',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = (request.params as { query: string }).query;
      const page = (request.query as { page: number }).page || 1;

      const res = await gogoanime.search(query, page);

      reply.status(200).send(res);
    }
  );

  fastify.get(
    '/gogoanime/info/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = decodeURIComponent((request.params as { id: string }).id);

      try {
        const res = await gogoanime
          .fetchAnimeInfo(id)
          .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Please try again later.' });
      }
    }
  );

  fastify.get(
    '/gogoanime/watch/:episodeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;
      const server = (request.query as { server: StreamingServers }).server;

      if (server && !Object.values(StreamingServers).includes(server)) {
        reply.status(400).send('Invalid server');
      }

      try {
        const res = await gogoanime
          .fetchEpisodeSources(episodeId, server)
          .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Please try again later.' });
      }
    }
  );

  fastify.get(
    '/gogoanime/servers/:episodeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;

      try {
        const res = await gogoanime
          .fetchEpisodeServers(episodeId)
          .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Please try again later.' });
      }
    }
  );

  fastify.get(
    '/gogoanime/top-airing',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const page = (request.query as { page: number }).page;

        const res = await gogoanime.fetchTopAiring(page);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developers for help.' });
      }
    }
  );

  fastify.get(
    '/gogoanime/recent-episodes',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const type = (request.query as { type: number }).type;
        const page = (request.query as { page: number }).page;

        const res = await gogoanime.fetchRecentEpisodes(page, type);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developers for help.' });
      }
    }
  );
};

export default routes;
