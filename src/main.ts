require('dotenv').config();

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';

import books from './routes/books';
import anime from './routes/anime';
import manga from './routes/manga';
import comics from './routes/comics';
import lightnovels from './routes/light-novels';
import movies from './routes/movies';
import meta from './routes/meta';

import RapidCloud from './utils/rapid-cloud';
import BilibiliUtilis from './utils/bilibili';
import CrunchyrollManager from './utils/crunchyroll-token';
import ImageProxy from './utils/image-proxy';
import M3U8Proxy from './utils/m3u8-proxy';

(async () => {
  const PORT = Number(process.env.PORT);
  if (process.env.ACCESS_TOKEN !== undefined)
    (
      global as typeof globalThis & {
        CrunchyrollToken: string;
      }
    ).CrunchyrollToken = (await CrunchyrollManager.create()).token!;

  const fastify = Fastify({
    logger: true,
  });
  await fastify.register(FastifyCors, {
    origin: '*',
    methods: 'GET',
  });

  await fastify.register(books, { prefix: '/books' });
  await fastify.register(anime, { prefix: '/anime' });
  await fastify.register(manga, { prefix: '/manga' });
  //await fastify.register(comics, { prefix: '/comics' });
  await fastify.register(lightnovels, { prefix: '/light-novels' });
  await fastify.register(movies, { prefix: '/movies' });
  await fastify.register(meta, { prefix: '/meta' });

  //await fastify.register(new RapidCloud().returnSID, { prefix: '/utils' });
  await fastify.register(new BilibiliUtilis('en_US').returnDASH, { prefix: '/utils' });
  await fastify.register(new BilibiliUtilis('en_US').returnVTT, { prefix: '/utils' });
  await fastify.register(new ImageProxy().getImageProxy, { prefix: '/utils' });
  await fastify.register(new M3U8Proxy().getM3U8Proxy, { prefix: '/utils' });

  try {
    fastify.get('/', (_, rp) => {
      rp.status(200).send('Welcome to consumet api! 🎉');
    });
    fastify.get('*', (request, reply) => {
      reply.status(404).send({
        message: '',
        error: 'page not found',
      });
    });

    fastify.listen({ port: PORT, host: '0.0.0.0' }, (e, address) => {
      if (e) throw e;
      console.log(`server listening on ${address}`);
    });
  } catch (err: any) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
