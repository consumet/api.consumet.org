import axios from 'axios';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

class M3U8Proxy {
  private getM3U8 = async (url: string, options: {}): Promise<string> => {
    const data = await axios.get(url, options);

    return data.data;
  };

  public getM3U8Proxy = async (fastify: FastifyInstance, options: RegisterOptions) => {
    fastify.get('/m3u8-proxy', async (request: FastifyRequest, reply: FastifyReply) => {
      const { url } = request.query as { url: string };
      // get headers from the query
      const { referer } = request.query as { referer: string };

      if (!url) {
        reply.status(400).send('No URL provided');
        return;
      }

      // return the image
      reply.send(
        await this.getM3U8(JSON.parse(url)[0], {
          headers: {
            referer: referer,
            'User-Agent':
              'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35',
          },
        })
      );
    });
  };
}

export default M3U8Proxy;
