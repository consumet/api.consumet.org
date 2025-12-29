import { NEWS, Topics } from '@consumet/extensions';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const ann = new NEWS.ANN();

  fastify.get('/', {
    schema: {
      description: 'Get Anime News Network provider info and available routes',
      tags: ['ann'],
    },
  }, (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the Anime News Network provider: check out the provider's website @ https://www.animenewsnetwork.com/",
      routes: ['/recent-feeds', '/info'],
      documentation: 'https://docs.consumet.org/#tag/animenewsnetwork',
    });
  });

  fastify.get('/recent-feeds', {
    schema: {
      description: 'Get recent news feeds',
      tags: ['ann'],
      querystring: {
        type: 'object',
        properties: {
          topic: { type: 'string', description: 'News topic filter' },
        },
      },
    },
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    let { topic } = req.query as { topic?: Topics };

    try {
      const feeds = await ann.fetchNewsFeeds(topic);
      reply.status(200).send(feeds);
    } catch (e) {
      reply.status(500).send({
        message: (e as Error).message,
      });
    }
  });

  fastify.get('/info', {
    schema: {
      description: 'Get news article details',
      tags: ['ann'],
      querystring: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'News article ID' },
        },
        required: ['id'],
      },
    },
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.query as { id: string };

    if (typeof id === 'undefined')
      return reply.status(400).send({
        message: 'id is required',
      });

    try {
      const info = await ann.fetchNewsInfo(id);
      reply.status(200).send(info);
    } catch (error) {
      reply.status(500).send({
        message: (error as Error).message,
      });
    }
  });
};

export default routes;
