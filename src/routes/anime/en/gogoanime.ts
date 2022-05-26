import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

import ANIME from 'consumet-extentions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get('/gogoanime', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send('Welcome to Consumet Gogoanime');
  });

  fastify.get(
    '/gogoanime/:anime',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { anime, page } = request.params as { anime: string; page: number };

      const gogoanime = new ANIME.en.Gogoanime();
      const res = await gogoanime.search(anime, page);

      reply.status(200).send(res);
    }
  );
};

export default routes;
