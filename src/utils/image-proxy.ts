import axios from 'axios';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

class ImageProxy {
  #image = undefined;
  private getImage = async (url: string, options: {}): Promise<string> => {
    const data = await axios.get(url, {
      responseType: 'arraybuffer',
      ...options,
    });
    return data.data;
  };

  public getImageProxy = async (fastify: FastifyInstance, options: RegisterOptions) => {
    fastify.get('/image-proxy', async (request: FastifyRequest, reply: FastifyReply) => {
      const { url } = request.query as { url: string };
      // get headers from the query
      const { referer } = request.query as { referer: string };

      if (!url) {
        reply.status(400).send('No URL provided');
        return;
      }

      // return the image
      reply.header('Content-Type', 'image/jpeg');
      reply.header('Cache-Control', 'public, max-age=31536000');
      reply.header('Access-Control-Allow-Origin', '*');
      reply.header('Access-Control-Allow-Methods', 'GET');
      reply.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      reply.header('Access-Control-Allow-Credentials', 'true');
      reply.header('Referer', referer);
      reply.send(await this.getImage(url, { headers: { referer } }));
    });
  };
}

export default ImageProxy;
