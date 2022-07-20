import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { META } from 'consumet.ts';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const anilist = new META.Anilist();

  fastify.get('/anilist', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the anilist provider: check out the provider's website @ https://anilist.co/",
      routes: ['/:query', '/info/:id', '/watch/:episodeId'],
      documentation: 'https://docs.consumet.org/#tag/anilist',
    });
  });

  fastify.get('/anilist/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const res = await anilist.search(query);

    reply.status(200).send(res);
  });

  fastify.get(
    '/anilist/info/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = decodeURIComponent((request.params as { id: string }).id);

      const isDub = (request.query as { dub?: boolean }).dub;

      try {
        const res = await anilist
          .fetchAnimeInfo(id, isDub)
          .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    }
  );

  fastify.get(
    '/anilist/watch/:episodeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;

      try {
        const res = await anilist
          .fetchEpisodeSources(episodeId)
          .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    }
  );
};

export default routes;
