require('dotenv').config();

import Fastify from 'fastify';

import { connectToDB } from './utils';

import books from './routes/books';
import anime from './routes/anime';
import manga from './routes/manga';
import lightnovels from './routes/light-novels';

const startServer = async () => {
  await connectToDB();

  const PORT = 3000;
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(books, { prefix: '/books' });
  await fastify.register(anime, { prefix: '/anime' });
  await fastify.register(manga, { prefix: '/manga' });
  await fastify.register(lightnovels, { prefix: '/light-novels' });

  try {
    fastify.get('/', (request, reply) => {
      reply.status(200).send('Welcome to Consumet API');
    });

    fastify.listen({ port: PORT }, (err, address) => {
      if (err) throw err;
      console.log(`server listening on ${address.replace('[::]', 'localhost')}`);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
