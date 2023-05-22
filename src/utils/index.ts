import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { PROVIDERS_LIST } from '@consumet/extensions';

import RapidCloud from './rapid-cloud';
import BilibiliUtilis from './bilibili';
import ImageProxy from './image-proxy';
import M3U8Proxy from './m3u8-proxy';
import Providers from './providers';
import ZoroKey from './key';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  //await fastify.register(new RapidCloud().returnSID);
  await fastify.register(new BilibiliUtilis('en_US').returnDASH);
  await fastify.register(new BilibiliUtilis('en_US').returnVTT);
  await fastify.register(new ImageProxy().getImageProxy);
  await fastify.register(new M3U8Proxy().getM3U8Proxy);
  await fastify.register(new Providers().getProviders);
  await fastify.register(new ZoroKey().getKey);

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Utils!');
  });
};

export default routes;
