import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers, IAnimeInfo, SubOrSub, MediaFormat } from '@consumet/extensions/dist/models';
import cache from '../../utils/cache';
import { redis } from '../../main';
import { Redis } from 'ioredis';
import axios from 'axios';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const gogoanime = new ANIME.Gogoanime(process.env.GOGOANIME_URL);
  const redisCacheTime = 60 * 60;
  const redisPrefix = 'gogoanime:';

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the gogoanime provider: check out the provider's website @ https://www1.gogoanime.bid/",
      routes: [
        '/:query',
        '/info/:id',
        '/watch/:episodeId',
        '/servers/:episodeId',
        '/genre/:genre',
        '/genre/list',
        '/top-airing',
        '/movies',
        '/popular',
        '/recent-episodes',
        '/anime-list',
        '/download',
      ],
      documentation: 'https://docs.consumet.org/#tag/gogoanime',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;
    const page = (request.query as { page: number }).page || 1;

    const res = redis ? await cache.fetch(
      redis as Redis,
      `${redisPrefix}search;${page};${query}`,
      async () => await gogoanime.search(query, page),
      redisCacheTime,
    ) : await gogoanime.search(query, page);

    reply.status(200).send(res);
  });

  fastify.get('/info/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = decodeURIComponent((request.params as { id: string }).id);

    try {
      let res = redis ? await cache.fetch(
        redis as Redis,
        `${redisPrefix}info;${id}`,
        async () => await gogoanime
        .fetchAnimeInfo(id)
        .catch(async (err) => {
           let api = await backupAPI( id );        
          if ( api != undefined ) 
            reply.status(200).send(api);
          else
            reply.status(404).send({ message: err });      
        }),
        redisCacheTime,
      ) : await gogoanime
      .fetchAnimeInfo(id)
      .catch((err) => reply.status(404).send({ message: err }));
      if ( res == undefined || res.episodes?.length == 0 )                 
          res = await backupAPI( id );      
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/genre/:genre', async (request: FastifyRequest, reply: FastifyReply) => {
    const genre = (request.params as { genre: string }).genre;
    const page = (request.query as { page: number }).page ?? 1;

    try {
      const res = redis ? await cache.fetch(
        redis as Redis,
        `${redisPrefix}genre;${page};${genre}`,
        async () => await gogoanime
        .fetchGenreInfo(genre, page)
        .catch((err) => reply.status(404).send({ message: err })),
        redisCacheTime,
      ) : await gogoanime
      .fetchGenreInfo(genre, page)
      .catch((err) => reply.status(404).send({ message: err }));
      reply.status(200).send(res);
    } catch {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

  fastify.get('/genre/list', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      
      const res = redis ? await cache.fetch(
        redis as Redis,
        `${redisPrefix}genre-list`,
        async () => await gogoanime
        .fetchGenreList()
        .catch((err) => reply.status(404).send({ message: err })),
        redisCacheTime * 24,
      ) : await gogoanime
      .fetchGenreList()
      .catch((err) => reply.status(404).send({ message: err }));
      reply.status(200).send(res);
    } catch {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });

   async function backupAPI(id:string) : Promise<IAnimeInfo | undefined> {
    let backup = await axios.get( 
      Buffer.from(
        'aHR0cHM6Ly9jc2MtbGFiLWFwaS54eXovYXBpL3NjcmFwZS9nb19hbmltZS9nZXRfaW5mb3JtYWNpb24/YW5pbWVfdXJsPS9jYXRlZ29yeS8=', 
        'base64'
      ).toString('utf-8') + id
    );
    if (backup != undefined && backup.data && backup.data.episodios && backup.data.episodios.length > 0) 
    {
      const obj : IAnimeInfo = {
        id: id,
        title: backup.data?.nombre,
        url: "https://anitaku.so/category/" + id + "/",
        genres: [],
        episodes: [],
        totalEpisodes: backup.data.episodios.length,
        status: backup.data.estado, 
        image: backup.data.portada, 
        subOrDub: SubOrSub.SUB,
        description: backup.data.sipnosis,
        type: MediaFormat.TV,
      };
      if (backup.data.episodios.length > 0 ) 
      {
        backup.data.episodios.forEach((episode: any) => {
          obj.episodes?.push({
            id: episode.url.replace("/", ""),
            number: episode.nombre.replace("Episode ", ""),
            url: "https://anitaku.so" + episode.url,
          });
        });
        backup.data.generos.forEach((genre: any) => {
          obj.genres?.push(genre);
        });
        obj.episodes?.reverse();
      }   
      return obj;
    }else{
      return undefined;
    }
  }

  fastify.get(
    '/watch/:episodeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;
      const server = (request.query as { server: StreamingServers }).server;

      if (server && !Object.values(StreamingServers).includes(server)) {
        reply.status(400).send('Invalid server');
      }

      try {
        const res = redis ? await cache.fetch(
          redis as Redis,
          `${redisPrefix}watch;${server};${episodeId}`,
          async () => await gogoanime
          .fetchEpisodeSources(episodeId, server)
          .catch((err) => reply.status(404).send({ message: err })),
          redisCacheTime,
        ) : await gogoanime
        .fetchEpisodeSources(episodeId, server)
        .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Please try again later.' });
      }
    },
  );

  fastify.get(
    '/servers/:episodeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;

      try {
        const res = redis ? await cache.fetch(
          redis as Redis,
          `${redisPrefix}servers;${episodeId}`,
          async () => await gogoanime
          .fetchEpisodeServers(episodeId)
          .catch((err) => reply.status(404).send({ message: err })),
          redisCacheTime,
        ) : await gogoanime
        .fetchEpisodeServers(episodeId)
        .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Please try again later.' });
      }
    },
  );

  fastify.get('/top-airing', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const page = (request.query as { page: number }).page ?? 1;

      const res = redis ? await cache.fetch(
        redis as Redis,
        `${redisPrefix}top-airing;${page}`,
        async () => await gogoanime.fetchTopAiring(page),
        redisCacheTime,
      ) : await gogoanime.fetchTopAiring(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developers for help.' });
    }
  });

  fastify.get('/movies', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const page = (request.query as { page: number }).page ?? 1;

      const res = redis ? await cache.fetch(
        redis as Redis,
        `${redisPrefix}movies;${page}`,
        async () => await gogoanime.fetchRecentMovies(page),
        redisCacheTime,
      ) : await gogoanime.fetchRecentMovies(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developers for help.' });
    }
  });

  fastify.get('/popular', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const page = (request.query as { page: number }).page ?? 1;

      const res = redis ? await cache.fetch(
        redis as Redis,
        `${redisPrefix}popular;${page}`,
        async () => await gogoanime.fetchPopular(page),
        redisCacheTime,
      ) : await gogoanime.fetchPopular(page);

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developers for help.' });
    }
  });

  fastify.get(
    '/recent-episodes',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const type = (request.query as { type: number }).type ?? 1;
        const page = (request.query as { page: number }).page ?? 1;

        const res = redis ? await cache.fetch(
          redis as Redis,
          `${redisPrefix}recent-episodes;${page};${type}`,
          async () => await gogoanime.fetchRecentEpisodes(page, type),
          redisCacheTime,
        ) : await gogoanime.fetchRecentEpisodes(page, type);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developers for help.' });
      }
    },
  );
  fastify.get(
    '/anime-list',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const page = (request.query as { page: number }).page ?? 1;

        const res = redis ? await cache.fetch(
          redis as Redis,
          `gogoanime:anime-list;${page}`,
          async () => await gogoanime.fetchAnimeList(page),
          redisCacheTime,
        ) : await gogoanime.fetchAnimeList(page);

        reply.status(200).send(res);
      } catch (err) {
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developers for help.' });
      }
    },
  );

  fastify.get('/download', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const downloadLink = (request.query as { link: string }).link;
      if(!downloadLink){
        reply.status(400).send('Invalid link');
      }
      const res = redis ? await cache.fetch(
        redis as Redis,
        `${redisPrefix}download-${downloadLink}`,
        async () => await gogoanime
        .fetchDirectDownloadLink(downloadLink)
        .catch((err) => reply.status(404).send({ message: err })),
        redisCacheTime * 24,
      ) : await gogoanime
      .fetchDirectDownloadLink(downloadLink, process.env.RECAPTCHATOKEN ?? '')
      .catch((err) => reply.status(404).send({ message: err }));
      reply.status(200).send(res);
    } catch {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });
};

export default routes;