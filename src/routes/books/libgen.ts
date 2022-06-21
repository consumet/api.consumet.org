import { BOOKS } from '@consumet/extensions';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { libgenModel } from '../../models';
import { insertNewBook } from '../../scripts/libgen';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send('Welcome to Consumet Libgen');
  });
  fastify.get('/s/:bookTitle', async (request: FastifyRequest, reply: FastifyReply) => {
    const { bookTitle } = request.params as { bookTitle: string };
    if (bookTitle.length < 4)
      return reply.status(400).send({ error: 'length of param must be > 4' });
    const regex = new RegExp(bookTitle, 'i');
    let result = await libgenModel.find({ title: regex });
    if (result.length == 0) {
      const libgen = new BOOKS.Libgen();
      const data = await libgen.search(bookTitle);
      for (let i of data) {
        try {
          insertNewBook(i);
        } catch (e) {
          console.log(e);
        }
      }
      result = data;
    }
    return reply.status(200).send(result);
  });
};

export default routes;
