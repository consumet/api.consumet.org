import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const gogoanime = new ANIME.Gogoanime();

  fastify.get(
    '/gogoanime/:anime',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const queries: { anime: string; page: number } = { anime: '', page: 1 };

      queries.anime = decodeURIComponent(
        (request.params as { anime: string; page: number }).anime
      );

      queries.page = (request.query as { anime: string; page: number }).page;

      const res = await gogoanime.search(queries.anime, queries.page);

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
};

export default routes;
