import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const nineanime = new ANIME.NineAnime(
    process.env.NINE_ANIME_HELPER_URL,
    {
      url: process.env.NINE_ANIME_PROXY as string,
    },
    process.env?.NINE_ANIME_HELPER_KEY as string,
  );

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the 9anime provider: check out the provider's website @ https://9anime.id/",
      routes: ['/:query', '/info/:id', '/watch/:episodeId'],
      documentation: 'https://docs.consumet.org/#tag/9anime',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const page = (request.query as { page: number }).page;

    const res = await nineanime.search(query, page);

    reply.status(200).send(res);
  });

  fastify.get('/info/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.params as { id: string }).id;

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      const res = await nineanime.fetchAnimeInfo(id);

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

      const server = (request.query as { server: string }).server as StreamingServers;

      if (server && !Object.values(StreamingServers).includes(server))
        return reply.status(400).send({ message: 'server is invalid' });

      if (typeof episodeId === 'undefined')
        return reply.status(400).send({ message: 'id is required' });

      try {
        const res = await nineanime.fetchEpisodeSources(episodeId, server);

        reply.status(200).send(res);
      } catch (err) {
        console.error(err);
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

      try {
        const res = await nineanime.fetchEpisodeServers(episodeId);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Please try again later.' });
      }
    },
  );

  fastify.get('/helper', async (request: FastifyRequest, reply: FastifyReply) => {
    const actions = ['vrf', 'searchVrf', 'decrypt', 'vizcloud'];

    const action = (request.query as { action: string }).action;

    const query = (request.query as { query: string }).query;

    if (!action) return reply.status(400).send({ message: 'action is invalid' });

    if (typeof query === 'undefined')
      return reply.status(400).send({ message: 'query is required' });

    let res = {} as any;
    try {
      switch (action) {
        case 'vrf':
          res = await nineanime.ev(query, true);
          break;
        case 'searchVrf':
          res = await nineanime.searchVrf(query, true);
          break;
        case 'decrypt':
          res = await nineanime.decrypt(query, true);
          break;
        case 'vizcloud':
          res = await nineanime.vizcloud(query);
          break;
        default:
          res = await nineanime.customRequest(query, action);
          break;
      }

      reply.status(200).send(res);
    } catch (err) {
      console.error(err);
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });
};

export default routes;
