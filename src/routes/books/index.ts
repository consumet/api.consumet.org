import { BOOKS } from '@consumet/extensions';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

import libgen from './libgen';
const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const lbgen = new BOOKS.Libgen();

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Books 📚');
  });

  fastify.get('/s', async (request: FastifyRequest, reply: FastifyReply) => {
    const { bookTitle, page } = request.query as {
      bookTitle: string;
      page: number;
    };
    if (!bookTitle)
      return reply.status(400).send({
        message: 'bookTitle query needed',
        error: 'invalid_input',
      });
    try {
      const data = await lbgen.search(bookTitle, page);
      return reply.status(200).send(data);
    } catch (e) {
      return reply.status(500).send({
        message: e,
        error: 'internal_error',
      });
    }
  });

  await fastify.register(libgen, { prefix: '/libgen' });
};

export default routes;
