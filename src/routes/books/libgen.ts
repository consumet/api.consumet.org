import { BOOKS } from '@consumet/extensions';
import { LibgenBook } from '@consumet/extensions/dist/models';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { libgenModel } from '../../models';
import { insertNewBook } from '../../utils';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get('/s/:bookTitle', async (request: FastifyRequest, reply: FastifyReply) => {
    const { bookTitle } = request.params as { bookTitle: string };
    if (bookTitle.length < 4)
      return reply.status(400).send({
        message: 'length of bookTItle must be > 4 characters',
        error: 'short_length',
      });
    const regex = new RegExp(bookTitle, 'i');
    let result = (await libgenModel.find({ title: regex })) as LibgenBook[];
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
