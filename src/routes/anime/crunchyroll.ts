import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: 'Welcome to the Crunchyroll provider.',
      routes: ['/:query', '/info/:id:mediaType', '/watch/:episodeId'],
      documentation: 'https://docs.consumet.org/#tag/crunchyroll',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const crunchyroll = await ANIME.Crunchyroll.create();
    const res = await crunchyroll.search(query);

    reply.status(200).send(res);
  });

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;
    const mediaType = (request.query as { mediaType: string }).mediaType;
    const allSeasons = (request.query as { allSeasons: boolean }).allSeasons ?? false;

    const crunchyroll = await ANIME.Crunchyroll.create();

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    if (typeof mediaType === 'undefined')
      return reply.status(400).send({ message: 'mediaType is required' });

    try {
      const res = await crunchyroll
        .fetchAnimeInfo(id, mediaType, allSeasons)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/watch', async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.query as { episodeId: string }).episodeId;

    if (typeof episodeId === 'undefined')
      return reply.status(400).send({ message: 'episodeId is required' });

    const crunchyroll = await ANIME.Crunchyroll.create();

    try {
      const res = await crunchyroll
        .fetchEpisodeSources(episodeId)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });
};

export default routes;
