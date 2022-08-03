require('dotenv').config();

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyRateLimit from '@fastify/rate-limit';

import books from './routes/books';
import anime from './routes/anime';
import manga from './routes/manga';
import comics from './routes/comics';
import lightnovels from './routes/light-novels';
import movies from './routes/movies';
import meta from './routes/meta';

(async () => {
  const PORT = Number(process.env.PORT);
  const fastify = Fastify({
    logger: true,
  });
  await fastify.register(FastifyCors, {
    origin: '*',
    methods: 'GET',
  });

  await fastify.register(FastifyRateLimit, {
    global: true,
    max: 60,
    timeWindow: 2000,
    allowList: [],
    errorResponseBuilder(req, context) {
      return {
        message: 'if you are a human, please wait a bit before trying again.',
      };
    },
  });

  await fastify.register(books, { prefix: '/books' });
  await fastify.register(anime, { prefix: '/anime' });
  await fastify.register(manga, { prefix: '/manga' });
  await fastify.register(comics, { prefix: '/comics' });
  await fastify.register(lightnovels, { prefix: '/light-novels' });
  await fastify.register(movies, { prefix: '/movies' });
  await fastify.register(meta, { prefix: '/meta' });

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
