import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

import gogoanime from './en/gogoanime';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(gogoanime, { prefix: '/' });

  fastify.get('/:animeProvider', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.redirect(`/anime/${(request.params as { bookProvider: string }).bookProvider}`);
  });
  // default route for animes
  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Anime');
  });
};

export default routes;
