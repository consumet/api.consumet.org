require('dotenv').config();
import Redis from 'ioredis';
import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';
import fs from 'fs';

import books from './routes/books';
import anime from './routes/anime';
import manga from './routes/manga';
import comics from './routes/comics';
import lightnovels from './routes/light-novels';
import movies from './routes/movies';
import meta from './routes/meta';
import news from './routes/news';
import chalk from 'chalk';
import Utils from './utils';

export const redis =
  process.env.REDIS_HOST &&
  new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  });

// Sets default TTL to 1 hour (3600 seconds) if not provided in .env
export const REDIS_TTL = Number(process.env.REDIS_TTL) || 3600;

const fastify = Fastify({
  maxParamLength: 1000,
  logger: true,
});

export const tmdbApi = process.env.TMDB_KEY && process.env.TMDB_KEY;

(async () => {
  const PORT = Number(process.env.PORT) || 3000;

  // Register CORS first
  await fastify.register(FastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Register Swagger for API documentation
  await fastify.register(FastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Consumet API',
        description: `
## Welcome to the Consumet API! 🎉

A powerful media streaming API providing access to anime, movies, TV shows, manga, comics, light novels, books, and news.

### 📚 Available Categories

| Category | Providers |
|----------|-----------|
| **Anime** | HiAnime, AnimePahe, AnimeKai, KickAssAnime, AnimeSaturn, AnimeUnity |
| **Movies & TV** | FlixHQ, DramaCool, Goku, SFlix, HiMovies, Turkish123 |
| **Manga** | MangaDex, MangaHere, MangaPill, MangaReader, MangaKakalot, ComicK, AsuraScans, WeebCentral |
| **Meta** | Anilist, MyAnimeList, TMDB |
| **Light Novels** | NovelUpdates |
| **Comics** | GetComics |
| **News** | Anime News Network |

### ✨ Key Features

- 🔍 **Search** - Search across all providers
- 📋 **Info** - Get detailed information about media
- ▶️ **Watch/Read** - Get streaming sources and reading pages
- 📖 **Proxy** - Image proxy for manga (bypass CORS/hotlink)
- ⭐ **Spotlight** - Featured/highlighted content (where supported)
- 📈 **Trending** - Trending content (where supported)
- 🆕 **Recent** - Recently added/updated content
- 🎯 **Filters** - Filter by genre, country, type, etc.

### 📖 Response Format

All responses are in JSON format.
        `,
        version: '1.0.0',
        contact: {
          name: 'Consumet API',
          url: 'https://github.com/consumet',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      tags: [
        // Anime Providers
        { name: 'hianime', description: '🎬 HiAnime - High quality anime streaming with sub/dub, spotlight, schedule' },
        { name: 'animepahe', description: '🎬 AnimePahe - Anime streaming provider' },
        { name: 'animekai', description: '🎬 AnimeKai - Anime streaming with MegaUp servers' },
        { name: 'kickassanime', description: '🎬 KickAssAnime - Anime streaming provider' },
        { name: 'animesaturn', description: '🎬 AnimeSaturn - Italian anime provider' },
        { name: 'animeunity', description: '🎬 AnimeUnity - Italian anime provider' },
        { name: 'animesama', description: '🎬 AnimeSama - French anime provider' },
        // Movie Providers
        { name: 'flixhq', description: '🎥 FlixHQ - Movies & TV shows with spotlight, trending, filters' },
        { name: 'dramacool', description: '🎥 DramaCool - Asian drama streaming with spotlight' },
        { name: 'goku', description: '🎥 Goku - Movies & TV shows streaming' },
        { name: 'sflix', description: '🎥 SFlix - Movies & TV shows with spotlight' },
        { name: 'himovies', description: '🎥 HiMovies - Movies & TV shows streaming' },
        { name: 'turkish123', description: '🎥 Turkish123 - Turkish drama streaming' },
        // Manga Providers
        { name: 'mangadex', description: '📖 MangaDex - Popular manga reading platform' },
        { name: 'mangahere', description: '📖 MangaHere - Manga reading with rankings and trending' },
        { name: 'mangapill', description: '📖 MangaPill - Manga reading provider' },
        { name: 'mangareader', description: '📖 MangaReader - Manga reading provider' },
        { name: 'mangakakalot', description: '📖 MangaKakalot - Manga with genres, suggestions' },
        { name: 'comick', description: '📖 ComicK - Manga reading platform' },
        { name: 'asurascans', description: '📖 AsuraScans - Manhwa/Manhua reading' },
        { name: 'weebcentral', description: '📖 WeebCentral - Manga reading provider' },
        // Meta Providers
        { name: 'anilist', description: '📊 Anilist - Anime/Manga metadata and tracking' },
        { name: 'anilist-manga', description: '📊 Anilist Manga - Manga metadata via Anilist' },
        { name: 'mal', description: '📊 MyAnimeList - Anime/Manga metadata' },
        { name: 'tmdb', description: '📊 TMDB - Movie/TV metadata' },
        // Light Novels
        { name: 'novelupdates', description: '📚 NovelUpdates - Light novel reading' },
        // Other
        { name: 'getcomics', description: '📚 GetComics - Comics download' },
        { name: 'ann', description: '📰 Anime News Network - Anime news' },
      ],
    },
  });

  // Register Swagger UI
  await fastify.register(FastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
    },
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request) => {
      // Dynamically set the server URL based on the incoming request
      const protocol = request.headers['x-forwarded-proto'] as string || request.protocol || 'http';
      const host = request.headers['x-forwarded-host'] as string || request.headers.host || `localhost:${PORT}`;
      const serverUrl = `${protocol}://${host}`;
      
      return {
        ...swaggerObject,
        servers: [
          {
            url: serverUrl,
            description: 'Current server',
          },
        ],
      };
    },
  });

  // Serve the JSON spec directly for tools that need it
  fastify.get('/openapi.json', async (request, reply) => {
    const spec = fastify.swagger();
    const protocol = request.headers['x-forwarded-proto'] as string || request.protocol || 'http';
    const host = request.headers['x-forwarded-host'] as string || request.headers.host || `localhost:${PORT}`;
    const serverUrl = `${protocol}://${host}`;
    
    return {
      ...spec,
      servers: [{ url: serverUrl, description: 'Current server' }],
    };
  });

  if (process.env.NODE_ENV === 'DEMO') {
    console.log(chalk.yellowBright('DEMO MODE ENABLED'));

    const map = new Map<string, { expiresIn: Date }>();
    // session duration in milliseconds (5 hours)
    const sessionDuration = 1000 * 60 * 60 * 5;

    fastify.addHook('onRequest', async (request, reply) => {
      const ip = request.ip;
      const session = map.get(ip);

      // check if the requester ip has a session (temporary access)
      if (session) {
        // if session is found, check if the session is expired
        const { expiresIn } = session;
        const currentTime = new Date();
        const sessionTime = new Date(expiresIn);

        // check if the session has been expired
        if (currentTime.getTime() > sessionTime.getTime()) {
          console.log('session expired');
          // if expired, delete the session and continue
          map.delete(ip);

          // redirect to the demo request page
          return reply.redirect('/apidemo');
        }
        console.log('session found. expires in', expiresIn);
        if (request.url === '/apidemo') return reply.redirect('/');
        return;
      }

      // if route is not /apidemo, redirect to the demo request page
      if (request.url === '/apidemo') return;

      console.log('session not found');
      reply.redirect('/apidemo');
    });

    fastify.post('/apidemo', async (request, reply) => {
      const { ip } = request;

      // check if the requester ip has a session (temporary access)
      const session = map.get(ip);

      if (session) return reply.redirect('/');

      // if no session, create a new session
      const expiresIn = new Date(Date.now() + sessionDuration);
      map.set(ip, { expiresIn });

      // redirect to the demo request page
      reply.redirect('/');
    });

    fastify.get('/apidemo', async (_, reply) => {
      try {
        const stream = fs.readFileSync(__dirname + '/../demo/apidemo.html');
        return reply.type('text/html').send(stream);
      } catch (err) {
        console.error(err);
        return reply.status(500).send({
          message: 'Could not load the demo page. Please try again later.',
        });
      }
    });

    // set interval to delete expired sessions every 1 hour
    setInterval(
      () => {
        const currentTime = new Date();
        for (const [ip, session] of map.entries()) {
          const { expiresIn } = session;
          const sessionTime = new Date(expiresIn);

          // check if the session is expired
          if (currentTime.getTime() > sessionTime.getTime()) {
            console.log('session expired for', ip);
            // if expired, delete the session and continue
            map.delete(ip);
          }
        }
      },
      1000 * 60 * 60,
    );
  }

  console.log(chalk.green(`Starting server on port ${PORT}... 🚀`));
  if (!process.env.REDIS_HOST) {
    console.warn(chalk.yellowBright('Redis not found. Cache disabled.'));
  } else {
    console.log(chalk.green(`Redis connected. Default Cache TTL: ${REDIS_TTL} seconds`));
  }

  if (!process.env.TMDB_KEY)
    console.warn(
      chalk.yellowBright('TMDB api key not found. the TMDB meta route may not work.'),
    );

  await fastify.register(books, { prefix: '/books' });
  await fastify.register(anime, { prefix: '/anime' });
  await fastify.register(manga, { prefix: '/manga' });
  await fastify.register(comics, { prefix: '/comics' });
  await fastify.register(lightnovels, { prefix: '/light-novels' });
  await fastify.register(movies, { prefix: '/movies' });
  await fastify.register(meta, { prefix: '/meta' });
  await fastify.register(news, { prefix: '/news' });
  await fastify.register(Utils, { prefix: '/utils' });

  try {
    fastify.get('/', (_, rp) => {
      rp.status(200).send({
        message: 'Welcome to Consumet API! 🎉',
        documentation: '/docs',
        routes: {
          anime: '/anime',
          movies: '/movies',
          manga: '/manga',
          'light-novels': '/light-novels',
          comics: '/comics',
          meta: '/meta',
          news: '/news',
          books: '/books',
          utils: '/utils',
        },
        demo: process.env.NODE_ENV === 'DEMO' 
          ? 'This is a demo of the API. You should only use this for testing purposes.'
          : undefined,
      });
    });
    fastify.get('*', (request, reply) => {
      reply.status(404).send({
        message: '',
        error: 'page not found',
      });
    });

    fastify.listen({ port: PORT, host: '0.0.0.0' }, (e, address) => {
      if (e) throw e;
      console.log(`Server listening on ${address}`);
      console.log(chalk.blueBright(`📚 Swagger documentation available at ${address}/docs`));
    });
  } catch (err: any) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
export default async function handler(req: any, res: any) {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
