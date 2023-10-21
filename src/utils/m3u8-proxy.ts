import axios, { AxiosRequestConfig } from 'axios';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

class M3U8Proxy {
  private getM3U8 = async (url: string, options: AxiosRequestConfig): Promise<any> => {
    const data = await axios.get(url, options);

    return data.data;
  };

  private toQueryString = (obj: any) => {
    const parts = [];
    for (const i in obj) {
      if (obj[i]) {
        parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
      }
    }
    return parts.join('&');
  };

  public getM3U8Proxy = async (fastify: FastifyInstance, options: RegisterOptions) => {
    fastify.get('/m3u8-proxy/*', async (request: FastifyRequest, reply: FastifyReply) => {
      // split params
      const params = (request.params as any)['*'].split('/');
      const queries = request.query as any;
      console.log('params', params);

      // last element is the url
      const url = params.pop();
      // decode safe base64
      const decodedUrl = Buffer.from(url, 'base64').toString('ascii');

      const domain = Buffer.from(params.join(''), 'base64').toString('ascii');

      // queries to object
      const data = await this.getM3U8(
        decodedUrl.startsWith('https')
          ? decodedUrl
          : domain + url + '?' + this.toQueryString(queries),
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35',
            watchsb: 'streamsb',
          },
        },
      );

      //const decodedData = Buffer.from(data, 'binary').toString('utf8');
      reply.header(
        'Content-Type',
        decodedUrl.startsWith('https') ? 'application/vnd.apple.mpegurl' : 'video/mp2t',
      );
      reply.header('Access-Control-Allow-Origin', '*');
      reply.header('Access-Control-Allow-Headers', '*');
      reply.header('Access-Control-Allow-Methods', '*');

      reply.send(data);
    });

    fastify.get('/m3u8/*', async (request: FastifyRequest, reply: FastifyReply) => {
      const params = (request.params as any)['*'];

      var url = Buffer.from(params, 'base64').toString('utf8');
      try {
        var req = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
          },
        });

        const pattern = new RegExp('https://', 'g');
        const final = req.data
          .toString()
          .replace(pattern, `https://cors.proxy.consumet.org/https://`);

        reply
          .header('Content-Type', 'application/vnd.apple.mpegurl')
          .header('Content-Disposition', 'attachment; filename=stream.m3u8')
          .status(200)
          .send(Buffer.from(final));
      } catch (error) {
        reply.status(400).send(error);
      }
    });
  };
}

export default M3U8Proxy;
