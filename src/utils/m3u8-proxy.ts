import axios, { AxiosRequestConfig } from 'axios';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

class M3U8Proxy {
  private streamsbDomain: string = ""
  private getM3U8 = async (url: string, options: AxiosRequestConfig): Promise<string> => {
    const data = await axios.get(url, options);

    return data.data;
  };

  public getM3U8Proxy = async (fastify: FastifyInstance, options: RegisterOptions) => {
    fastify.get(
      '/m3u8-proxy/:url',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { url } = request.params as {url: string}

        if (!url) {
          reply.status(400).send('No URL provided');
          return;
        }

        reply.header('Content-Type', 'application/x-mpegURL');
        reply.header('Access-Control-Allow-Origin', '*');
        
        if (!streamsbDomain) reply.send('domain is null')

        // return the image
        reply.send(
          await this.getM3U8(this.streamsbDomain + decodeURIComponent(url), {
            headers: {
              referer: referer,
              'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35',
            },
          })
        );
      }
    );
    
    fastify.get(
      '/m3u8-proxy/m3u8',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { url } = request.query as { url: string };
        const { domain } = request.query as { domain: string }
        // get headers from the query
        const { referer } = request.query as { referer: string };

        if (!url) {
          reply.status(400).send('No URL provided');
          return;
        }
        
        this.streamsbDomain = domain

        reply.header('Content-Type', 'application/x-mpegURL');
        reply.header('Access-Control-Allow-Origin', '*');

        // return the image
        reply.send(
          await this.getM3U8(decodeURIComponent(url), {
            headers: {
              referer: referer,
              'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35',
            },
          })
        );
      }
    );
  };
}

export default M3U8Proxy;
