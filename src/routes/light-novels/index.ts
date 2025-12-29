import { FastifyInstance, RegisterOptions } from 'fastify';
import novelupdates from './novelupdates';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(novelupdates, { prefix: '/novelupdates' });

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Light Novels - Available providers: novelupdates');
  });
};

export default routes;
