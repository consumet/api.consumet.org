import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { PROVIDERS_LIST } from '@consumet/extensions';

import RapidCloud from './rapid-cloud';
import BilibiliUtilis from './bilibili';
import CrunchyrollManager from './crunchyroll-token';
import ImageProxy from './image-proxy';
import M3U8Proxy from './m3u8-proxy';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  //await fastify.register(new RapidCloud().returnSID);
  await fastify.register(new BilibiliUtilis('en_US').returnDASH);
  await fastify.register(new BilibiliUtilis('en_US').returnVTT);
  await fastify.register(new ImageProxy().getImageProxy);
  await fastify.register(new M3U8Proxy().getM3U8Proxy);

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Utils!');
  });
};

export default routes;
