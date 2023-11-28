import axios, { AxiosRequestConfig } from 'axios';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

class ImageProxy {
  public async getImageProxy(fastify: FastifyInstance, options: RegisterOptions) {
    const getImage = async (
      url: string,
      options: AxiosRequestConfig,
    ): Promise<string> => {
      const data = await axios
        .get(url, {
          responseType: 'arraybuffer',
          ...options,
        })
        .catch((err) => {
          return { data: err.response.data };
        });
      return data.data;
    };
    fastify.get('/image-proxy', async (request: FastifyRequest, reply: FastifyReply) => {
      const { url } = request.query as { url: string };
      // get headers from the query
      const { headers } = request.query as { headers: any };

      if (!url || !headers) {
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
        'Origin, X-Requested-With, Content-Type, Accept',
      );
      reply.header('Access-Control-Allow-Credentials', 'true');
      reply.send(await getImage(url, { headers: JSON.parse(headers) }));
    });
  }
}

export default ImageProxy;
