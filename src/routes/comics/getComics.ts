import { COMICS } from '@consumet/extensions';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { libgenModel } from '../../models';
import { insertNewComic } from '../../utils';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  fastify.get('/s/:comicTitle', async (request: FastifyRequest, reply: FastifyReply) => {
    const { comicTitle } = request.params as { comicTitle: string };
    if (comicTitle.length < 4)
      return reply.status(400).send({
        message: 'length of comicTitle must be > 4 charactes',
        error: 'short_length',
      });
    const regex = new RegExp(comicTitle, 'i');
    let result: any = await libgenModel.find({ title: regex });
    if (result.length == 0) {
      const getComics = new COMICS.GetComics();
      const { containers } = await getComics.search(comicTitle);
      for (let container of containers) {
        try {
          insertNewComic(container);
        } catch (e) {
          console.log(e);
        }
      }
      result = containers;
    }
    return reply.status(200).send(result);
  });
};

export default routes;
