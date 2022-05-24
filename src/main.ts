import Fastify from 'fastify';
import books from './routes/books';

const startServer = async () => {
  const PORT = 3000;
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(books, { prefix: '/books' });
  // ... other routes, example:  await fastify.register(anime, { prefix: "/anime" });

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
