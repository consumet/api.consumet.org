import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { MANGA } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const mangadex = new MANGA.MangaDex();

  fastify.get(
    '/mangadex/:manga',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const queries: { manga: string; page: number } = { manga: '', page: 1 };

      queries.manga = decodeURIComponent(
        (request.params as { manga: string; page: number }).manga
      );

      queries.page = (request.query as { manga: string; page: number }).page;

      const res = await mangadex.search(queries.manga, queries.page);

      reply.status(200).send(res);
    }
  );

  fastify.get(
    '/mangadex/info/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = decodeURIComponent((request.params as { id: string }).id);

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
    }
  );

  fastify.get(
    '/mangadex/read/:chapterId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const chapterId = (request.params as { chapterId: string }).chapterId;

      try {
        const res = await mangadex
          .fetchChapterPages(chapterId)
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
