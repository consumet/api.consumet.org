import { COMICS } from '@consumet/extensions';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get('/s/:comicTitle', async (request: FastifyRequest, reply: FastifyReply) => {
    const { comicTitle } = request.params as { comicTitle: string };
    if (comicTitle.length < 4)
      return reply.status(400).send({
        message: 'length of comicTitle must be > 4 charactes',
        error: 'short_length',
      });
    const getComics = new COMICS.GetComics();
    const result = await getComics.search(comicTitle);

    return reply.status(200).send(result);
  });
};

export default routes;
