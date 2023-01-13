import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const mangadex = new MANGA.MangaDex();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the mangadex provider: check out the provider's website @ https://mangadex.org/",
      routes: ['/:query', '/info/:id', '/read/:chapterId'],
      documentation: 'https://docs.consumet.org/#tag/mangadex',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const page = (request.query as { page: number }).page;

    const res = await mangadex.search(query, page);

    reply.status(200).send(res);
  });

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = decodeURIComponent((request.query as { id: string }).id);

    if (typeof id === 'undefined')
      return reply.status(400).send({ message: 'id is required' });
    
    try {
      const res = await mangadex
        .fetchMangaInfo(id)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get(
    '/read',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const chapterId = (request.query as { chapterId: string }).chapterId;
      
      if (typeof chapterId === 'undefined')
        return reply.status(400).send({ message: 'chapterId is required' });
      
      try {
        const res = await mangadex.fetchChapterPages(chapterId);

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
