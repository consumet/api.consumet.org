import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

import libgen from './libgen';
const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(libgen, { prefix: '/libgen' });

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Books 📚');
  });

  fastify.get('/s', async (request: FastifyRequest, reply: FastifyReply) => {
    const { bookTitle, maxResults } = request.query as {
      bookTitle: string;
      maxResults: number;
    };
    if (!bookTitle)
      return reply.status(400).send({
        message: 'bookTitle query needed',
        error: 'invalid_input',
      });
    reply
      .status(300)
      .redirect(`../libgen/s?bookTitle=${bookTitle}&maxResults=${maxResults}`);
  });

  fastify.get('/fs', async (request: FastifyRequest, reply: FastifyReply) => {
    const { bookTitle, maxResults } = request.query as {
      bookTitle: string;
      maxResults: number;
    };
    if (!bookTitle)
      return reply.status(400).send({
        message: 'bookTitle query needed',
        error: 'invalid_input',
      });
    reply
      .status(300)
      .redirect(`../libgen/fs?bookTitle=${bookTitle}&maxResults=${maxResults}`);
  });
};

export default routes;
