import { COMICS } from '@consumet/extensions';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the getComics provider: check out the provider's website @ https://getcomics.info/",
      routes: ['/s'],
      documentation: 'https://docs.consumet.org/#tag/getComics',
    });
  });

  fastify.get('/s/:comicTitle', async (request: FastifyRequest, reply: FastifyReply) => {
    const { comicTitle, page } = request.query as { comicTitle: string; page: number };
    if (comicTitle.length < 4)
      return reply.status(400).send({
        message: 'length of comicTitle must be > 4 charactes',
        error: 'short_length',
      });
    const getComics = new COMICS.GetComics();
    const result = await getComics.search(comicTitle, page);

    return reply.status(200).send(result);
  });
};

export default routes;
