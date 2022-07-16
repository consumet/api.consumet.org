import { BOOKS } from '@consumet/extensions';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get('/s/:bookTitle', async (request: FastifyRequest, reply: FastifyReply) => {
    const { bookTitle } = request.params as { bookTitle: string };
    if (bookTitle.length < 4)
      return reply.status(400).send({
        message: 'length of bookTItle must be > 4 characters',
        error: 'short_length',
      });
    const regex = new RegExp(bookTitle, 'i');
    const libgen = new BOOKS.Libgen();
    const data = await libgen.search(bookTitle);
    return reply.status(200).send(data);
  });
};

export default routes;
