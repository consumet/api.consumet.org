import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import CrunchyrollManager from '../../utils/crunchyroll-token';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  if (process.env.ACCESS_TOKEN === undefined) {
    console.error('Crunchyroll routes not loaded. ACCESS_TOKEN not found.');
    fastify.get('/crunchyroll', (_, rp) => {
      rp.status(200).send('Crunchyroll routes not loaded. ACCESS_TOKEN not found.');
    });
  } else {
    const crunchyroll = await ANIME.Crunchyroll.create(
      'en-US',
      (
        global as typeof globalThis & {
          CrunchyrollToken: string;
        }
      ).CrunchyrollToken
    );
    console.log(
      (
        global as typeof globalThis & {
          CrunchyrollToken: string;
        }
      ).CrunchyrollToken
    );
    fastify.get('/crunchyroll', (_, rp) => {
      rp.status(200).send({
        intro:
          "Welcome to the crunchyroll provider: check out the provider's website @ https://crunchyroll.to/",
        routes: ['/:query', '/info/:id', '/watch/:episodeId'],
        documentation: 'https://docs.consumet.org/#tag/crunchyroll',
      });
    });

    fastify.get(
      '/crunchyroll/:query',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const query = (request.params as { query: string }).query;
        const locale = (request.query as { locale: string }).locale;

        const crnchyroll = await ANIME.Crunchyroll.create(
          locale,
          (
            global as typeof globalThis & {
              CrunchyrollToken: string;
            }
          ).CrunchyrollToken
        );
        const res = await crnchyroll.search(query);

        reply.status(200).send(res);
      }
    );

    fastify.get(
      '/crunchyroll/info',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const id = (request.query as { id: string }).id;
        const mediaType = (request.query as { mediaType: string }).mediaType;
        const locale = (request.query as { locale: string }).locale;

        const crnchyroll = await ANIME.Crunchyroll.create(
          locale,
          (
            global as typeof globalThis & {
              CrunchyrollToken: string;
            }
          ).CrunchyrollToken
        );

        if (typeof id === 'undefined')
          return reply.status(400).send({ message: 'id is required' });

        if (typeof mediaType === 'undefined')
          return reply.status(400).send({ message: 'mediaType is required' });

        try {
          const res = await crnchyroll
            .fetchAnimeInfo(id, mediaType)
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
      '/crunchyroll/watch',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const episodeId = (request.query as { episodeId: string }).episodeId;
        const format = (request.query as { format?: string }).format;
        const type = (request.query as { type?: string }).type;

        if (typeof episodeId === 'undefined')
          return reply.status(400).send({ message: 'episodeId is required' });

        try {
          const res = await crunchyroll
            .fetchEpisodeSources(episodeId, format, type)
            .catch((err) => reply.status(404).send({ message: err }));

          reply.status(200).send(res);
        } catch (err) {
          reply
            .status(500)
            .send({ message: 'Something went wrong. Contact developer for help.' });
        }
      }
    );
  }
};

export default routes;
