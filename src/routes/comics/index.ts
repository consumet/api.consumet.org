import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import getComics from './getComics';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(getComics, { prefix: '/getComics' });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send('Welcome to Consumet Comics 🦸‍♂️');
  });

  fastify.get('/s/:comicTitle', async (request: FastifyRequest, reply: FastifyReply) => {
    const { comicTitle } = request.params as { comicTitle: string };
    reply.status(300).redirect(`../getComics/s/${comicTitle}`);
  });
};

export default routes;
