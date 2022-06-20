import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import BOOKS, { PROVIDERS_LIST } from 'consumet-extentions';
import { BaseProvider } from 'consumet-extentions/dist/models';

import libgen from './en/libgen';
import { IBookProviderParams } from '../../models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(libgen, { prefix: '/libgen' });

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Books');
  });

  fastify.get('/s/:bookTitle', async (request: FastifyRequest, reply: FastifyReply) => {
    const { bookTitle } = request.params as { bookTitle: string };
    reply.redirect(`/libgen/s/${bookTitle}`);
  });
};

export default routes;
