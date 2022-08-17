import { BOOKS } from '@consumet/extensions';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const libgen = new BOOKS.Libgen();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the libgen provider. check out the provider's website @ http://libgen.rs/",
      routes: ['/s', '/fs'],
      documentation: 'https://docs.consumet.org/#tag/libgen (needs to be updated)',
    });
  });

  fastify.get('/s', async (request: FastifyRequest, reply: FastifyReply) => {
    const { bookTitle, page } = request.query as {
      bookTitle: string;
      page: number;
    };
    if (bookTitle.length < 4)
      return reply.status(400).send({
        message: 'length of bookTitle must be > 4 characters',
        error: 'short_length',
      });
    if (isNaN(page)) {
      return reply.status(400).send({
        message: 'page is missing',
        error: 'invalid_input',
      });
    }
    try {
      const data = await libgen.search(bookTitle, page);
      return reply.status(200).send(data);
    } catch (e) {
      return reply.status(400).send(e);
    }
  });
};

export default routes;
