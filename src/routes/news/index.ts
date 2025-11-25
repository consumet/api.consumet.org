import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

import ann from './ann';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.register(ann, { prefix: '/ann' });

  fastify.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send('Welcome to Consumet News');
  });
};

export default routes;
