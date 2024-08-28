import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { META } from '@consumet/extensions';
import { PROVIDERS_LIST } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  // TODO: Allocate new provider per request rather
  // than global
  let anilist = new META.Anilist.Manga();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: `Welcome to the anilist manga provider: check out the provider's website @ ${anilist.provider.toString.baseUrl}`,
      routes: ['/:query', '/info', '/read'],
      documentation: 'https://docs.consumet.org/#tag/anilist',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const res = await anilist.search(query);

    reply.status(200).send(res);
  });

  fastify.get('/info/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.params as { id: string }).id;
    const provider = (request.query as { provider: string }).provider;

    if (typeof provider !== 'undefined') {
      const possibleProvider = PROVIDERS_LIST.MANGA.find(
        (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
      );
      anilist = new META.Anilist.Manga(possibleProvider);
    }

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });

    try {
      const res = await anilist
        .fetchMangaInfo(id)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
      anilist = new META.Anilist.Manga();
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/read', async (request: FastifyRequest, reply: FastifyReply) => {
    const chapterId = (request.query as { chapterId: string }).chapterId;
    const provider = (request.query as { provider: string }).provider;

    if (typeof provider !== 'undefined') {
      const possibleProvider = PROVIDERS_LIST.MANGA.find(
        (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
      );
      anilist = new META.Anilist.Manga(possibleProvider);
    }

    if (typeof chapterId === 'undefined')
      return reply.status(400).send({ message: 'chapterId is required' });

    try {
      const res = await anilist
        .fetchChapterPages(chapterId)
        .catch((err: Error) => reply.status(404).send({ message: err.message }));

      anilist = new META.Anilist.Manga();
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });
};

export default routes;
