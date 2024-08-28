import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  //await fastify.register(getcomics, { prefix: '/getcomics' });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send('Welcome to Consumet Comics 🦸‍♂️');
  });

  fastify.get('/s', async (request: FastifyRequest, reply: FastifyReply) => {
    const { comicTitle, page } = request.query as { comicTitle: string; page: number };
    reply.status(300).redirect(`getcomics/s?comicTitle=${comicTitle}&page=${page}`);
  });
};

export default routes;
