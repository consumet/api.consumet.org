import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { LIGHT_NOVELS } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const readlightnovels = new LIGHT_NOVELS.ReadLightNovels();

  fastify.get(
    '/readlightnovels/:novel',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const queries: { novel: string } = { novel: '' };

      queries.novel = decodeURIComponent((request.params as { novel: string }).novel);

      const res = await readlightnovels.search(queries.novel);

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
          .catch((err) => reply.status(404).send(err));

        reply.status(200).send(res);
      } catch (err) {
        reply.status(500).send('Something went wrong. Please try again later.');
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
        reply.status(500).send('Something went wrong. Please try again later.');
      }
    }
  );
};

export default routes;
