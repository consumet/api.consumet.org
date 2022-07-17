import { BOOKS } from '@consumet/extensions';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const libgen = new BOOKS.Libgen();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the libgen provider. check out the provider's website @ http://libgen.rs/",
      routes: ['/s', '/fs'],
      documentation: 'https://docs.consumet.org/#tag/libgen',
    });
  });

  fastify.get('/s', async (request: FastifyRequest, reply: FastifyReply) => {
    const { bookTitle, maxResults } = request.query as {
      bookTitle: string;
      maxResults: number;
    };
    if (bookTitle.length < 4)
      return reply.status(400).send({
        message: 'length of bookTItle must be > 4 characters',
        error: 'short_length',
      });
    if (isNaN(maxResults)) {
      return reply.status(400).send({
        message: 'page number is valid',
        error: 'invalid_input',
      });
    }
    const data = await libgen.search(bookTitle, maxResults);
    return reply.status(200).send(data);
  });

  fastify.get('/fs', async (request: FastifyRequest, reply: FastifyReply) => {
    const { bookTitle, maxResults } = request.query as {
      bookTitle: string;
      maxResults: number;
    };
    if (bookTitle.length < 4)
      return reply.status(400).send({
        message: 'length of bookTItle must be > 4 characters',
        error: 'short_length',
      });
    if (isNaN(maxResults)) {
      return reply.status(400).send({
        message: 'page number is valid',
        error: 'invalid_input',
      });
    }
    const data = await libgen.fastSearch(bookTitle, maxResults);
    return reply.status(200).send(data);
  });
};

export default routes;
