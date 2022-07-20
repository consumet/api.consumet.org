import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { LIGHT_NOVELS } from 'consumet.ts';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const readlightnovels = new LIGHT_NOVELS.ReadLightNovels();

  fastify.get('/readlightnovels', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the readlightnovels provider: check out the provider's website @ https://readlightnovels.net/",
      routes: ['/:query', '/:id', '/chapterId'],
      documentation: 'https://docs.consumet.org/#tag/readlightnovels',
    });
  });

  fastify.get(
    '/readlightnovels/:query',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = (request.params as { query: string }).query;

      const res = await readlightnovels.search(query);

      reply.status(200).send(res);
    }
  );

  fastify.get(
    '/readlightnovels/info/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = decodeURIComponent((request.params as { id: string }).id);

      try {
        const res = await readlightnovels
          .fetchLightNovelInfo(id)
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
    '/readlightnovels/read/:chapterId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const chapterId = (request.params as { chapterId: string }).chapterId;

      try {
        const res = await readlightnovels
          .fetchChapterContent(chapterId)
          .catch((err) => reply.status(404).send(err));

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
