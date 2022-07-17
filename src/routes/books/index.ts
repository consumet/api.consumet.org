import { BOOKS } from '@consumet/extensions';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

import libgen from './libgen';
const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const lbgen = new BOOKS.Libgen();

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

    const data = await lbgen.search(bookTitle, maxResults);
    return reply.status(200).send(data);
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
    const data = await lbgen.fastSearch(bookTitle, maxResults);
    return reply.status(200).send(data);
  });

  await fastify.register(libgen, { prefix: '/libgen' });
};

export default routes;
