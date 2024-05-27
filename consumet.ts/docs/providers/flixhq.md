<h1>FlixHQ</h1>

```ts
const flixhq = new MOVIES.FlixHQ();
```

<h2>Methods</h2>

- [search](#search)
- [fetchMediaInfo](#fetchmediainfo)
- [fetchEpisodeSources](#fetchepisodesources)
- [fetchEpisodeServers](#fetchepisodeservers)
- [fetchRecentMovies](#fetchrecentmovies)
- [fetchRecentTvShows](#fetchrecenttvshows)
- [fetchTrendingMovies](#fetchtrendingmovies)
- [fetchTrendingTvShows](#fetchtrendingtvshows)

### search
> Note: This method is a subclass of the [`BaseParser`](https://github.com/consumet/extensions/blob/master/src/models/base-parser.ts) class. meaning it is available across most categories.


<h4>Parameters</h4>

| Parameter       | Type     | Description                                                                                                                                |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| query           | `string` | query to search for. (*In this case, We're searching for `Vincenzo`*) P.S: `vincenzo` is a really good korean drama i highly recommend it. |
| page (optional) | `number` | page number (default: 1)                                                                                                                   |

```ts
flixhq.search("Vincenzo").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of movies/tv series. (*[`Promise<ISearch<IMovieResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L233-L241)*)\
output:
```js
{
  currentPage: 1, // current page
  hasNextPage: false, // if there is a next page
  results: [
    {
      id: 'tv/watch-vincenzo-67955', // media id
      title: 'Vincenzo',
      url: 'https://flixhq.to/tv/watch-vincenzo-67955', // media url
      image: 'https://img.flixhq.to/xxrz/250x400/379/79/6b/796b32989cf1308b9e0619524af5b022/796b32989cf1308b9e0619524af5b022.jpg',
      type: 'TV Series'
    }
    {...},
    ...
  ]
}
```

### fetchMediaInfo

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                                                                     |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| mediaId   | `string` | takes media id or url as a parameter. (*media id or url can be found in the media search results as shown on the above method*) |

```ts
flixhq.fetchMediaInfo("tv/watch-vincenzo-67955").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes). (*[`Promise<IMovieInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L243-L254)*)\
output:
```js
{
  id: 'tv/watch-vincenzo-67955', // media id
  title: 'Vincenzo',
  url: 'https://flixhq.to/tv/watch-vincenzo-67955', // media url
  image: 'https://img.flixhq.to/xxrz/250x400/379/79/6b/796b32989cf1308b9e0619524af5b022/796b32989cf1308b9e0619524af5b022.jpg',
  description: '\n' +
    '        At age of 8, Park Joo-Hyung went to Italy after he was adopted. He is now an adult and has the name of Vincenzo Cassano. ...\n' +
    '    ',
  type: 'TV Series',
  releaseDate: '2021-02-20',
  genres: [ 'Action', 'Adventure', '...' ],
  casts: [
    'Kwak Dong-yeon',
    'Kim Yeo-jin',
      ...
  ],
  tags: [
    'Watch Vincenzo Online Free,',
    'Vincenzo Online Free,',
    ...
  ],
  production: 'Studio Dragon',
  duration: '60 min',
  rating: 8.4,
  episodes: [
    {
      id: '1167571',
      title: 'Eps 1: Episode #1.1',
      number: 1,
      season: 1, // the number of episodes resets to 1 every season
      url: 'https://flixhq.to/ajax/v2/episode/servers/1167571'
    },
    {...},
    ...
  ]
}
```

### fetchEpisodeSources

<h4>Parameters</h4>

| Parameter         | Type                                                                                                 | Description                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| episodeId         | `string`                                                                                             | takes episode id as a parameter. (*episode id can be found in the media info object*)                                                                      |
| mediaId           | `string`                                                                                             | takes media id as a parameter. (*media id can be found in the media info object*)                                                                          |
| server (optional) | [`StreamingServers`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L144-L157) | takes server enum as a parameter. *default: [`StreamingServers.VidCloud`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L150)* |


```ts
flixhq.fetchEpisodeSources("1167571", "tv/watch-vincenzo-67955").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of episode sources and subtitles. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L300-L306)*)\
output:
```js
{
  headers: { Referer: 'https://rabbitstream.net/embed-4/gBOHFKQ0sOxE?z=' },
  sources: [
    {
      url: 'https://b-g-ca-5.feetcdn.com:2223/v2-hls-playback/01b3e0bf48e643923f849702a32bd97a5c4360797759b0838c8f34597271ed8bf541e616b85a255a1320417863fe198040e65edb91d55f65c2f187d38c159aac95365664aa55f6121e784c83e8719033f811224effd0aefb9b88c77caf71b2d8943454dee7f505d5e1aae5f70dea1472a541a7c283a37782ea8253b156aad0f83701ef208196d2a5b75a864b6d6e3a2d454e55ea1885f3d5df798053a843cc223d6e41ecb1af3f6d6a07fc72a41bce18/playlist.m3u8',
      isM3U8: true
    }
  ],
  subtitles: [
    {
      url: 'https://cc.1clickcdn.ru/26/7f/267fbca84e18437aa7c7df80179b0751/ara-3.vtt',
      lang: 'Arabic - Arabic'
    },
    {
      url: 'https://cc.1clickcdn.ru/26/7f/267fbca84e18437aa7c7df80179b0751/chi-4.vtt',
      lang: 'Chinese - Chinese Simplified'
    },
    {...}
    ...
  ]
}
```

### fetchEpisodeServers

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                                                   |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| episodeId | `string` | take an episode id or url as a parameter. (*episode id or episode url can be found in the media info object*) |
| mediaId   | `string` | takes media id as a parameter. (*media id can be found in the media info object*)                             |

```ts
flixhq.fetchEpisodeServers('1167571', 'tv/watch-vincenzo-67955').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of episode servers. (*[`Promise<IEpisodeServer[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L115-L118)*)\
output:
```js
[
  {
    name: 'upcloud',
    url: 'https://flixhq.to/watch-tv/watch-vincenzo-67955.4829542'
  },
  {
    name: 'vidcloud',
    url: 'https://flixhq.to/watch-tv/watch-vincenzo-67955.4087001'
  },
  {
    name: 'streamlare',
    url: 'https://flixhq.to/watch-tv/watch-vincenzo-67955.7041439'
  },
  {
    name: 'voe',
    url: 'https://flixhq.to/watch-tv/watch-vincenzo-67955.7823107'
  },
  {...},
   ...
]
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/movies.md#">back to movie providers list</a>)</p>

### fetchRecentMovies

```ts
flixhq.fetchRecentMovies().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of movies. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
  {
    id: 'movie/watch-violent-night-91333',
    title: 'Violent Night',
    url: 'https://flixhq.to/movie/watch-violent-night-91333',
    image: 'https://img.flixhq.to/xxrz/250x400/379/cc/ff/ccff5242232b96b36ed22f0a0dda8234/ccff5242232b96b36ed22f0a0dda8234.jpg',
    releaseDate: '2022',
    duration: '112m',
    type: 'Movie'
  },
  {
    id: 'movie/watch-holiday-heritage-91552',
    title: 'Holiday Heritage',
    url: 'https://flixhq.to/movie/watch-holiday-heritage-91552',
    image: 'https://img.flixhq.to/xxrz/250x400/379/b9/4c/b94c9ef8b80fe5d71e9e4750602d086c/b94c9ef8b80fe5d71e9e4750602d086c.jpg',
    releaseDate: '2022',
    duration: '84m',
    type: 'Movie'
  },
  {
    id: 'movie/watch-high-heat-91549',
    title: 'High Heat',
    url: 'https://flixhq.to/movie/watch-high-heat-91549',
    image: 'https://img.flixhq.to/xxrz/250x400/379/4e/56/4e56d050f6d2578f1495dbf348e0becf/4e56d050f6d2578f1495dbf348e0becf.jpg',
    releaseDate: '2022',
    duration: '84m',
    type: 'Movie'
  },
  {...},
]
```


### fetchRecentTvShows

```ts
flixhq.fetchRecentTvShows().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of tv shows. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
 {
    id: 'tv/watch-yellowstone-38684',
    title: 'Yellowstone',
    url: 'https://flixhq.to/tv/watch-yellowstone-38684',
    image: 'https://img.flixhq.to/xxrz/250x400/379/86/ba/86bacd45c63959587ef16c92927fe8eb/86bacd45c63959587ef16c92927fe8eb.jpg',
    season: 'SS 5',
    latestEpisode: 'EPS 7',
    type: 'TV Series'
  },
  {
    id: 'tv/watch-his-dark-materials-34639',
    title: 'His Dark Materials',
    url: 'https://flixhq.to/tv/watch-his-dark-materials-34639',
    image: 'https://img.flixhq.to/xxrz/250x400/379/0e/41/0e41301e8f1152499dcf51253b64a29f/0e41301e8f1152499dcf51253b64a29f.jpg',
    season: 'SS 3',
    latestEpisode: 'EPS 8',
    type: 'TV Series'
  },
  {
    id: 'tv/watch-dangerous-liaisons-89965',
    title: 'Dangerous Liaisons',
    url: 'https://flixhq.to/tv/watch-dangerous-liaisons-89965',
    image: 'https://img.flixhq.to/xxrz/250x400/379/fc/5b/fc5ba1c5d4445eb29d0b002f2c8425db/fc5ba1c5d4445eb29d0b002f2c8425db.jpg',
    season: 'SS 1',
    latestEpisode: 'EPS 7',
    type: 'TV Series'
  },
  {...},
]
```


### fetchTrendingMovies

```ts
flixhq.fetchTrendingMovies().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of movies. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
 {
    id: 'movie/watch-avatar-the-way-of-water-79936',
    title: 'Avatar: The Way of Water',
    url: 'https://flixhq.to/movie/watch-avatar-the-way-of-water-79936',
    image: 'https://img.flixhq.to/xxrz/250x400/379/1e/c6/1ec694a9d587d509ec7a9be815aacfac/1ec694a9d587d509ec7a9be815aacfac.jpg',
    releaseDate: '2022',
    duration: '192m',
    type: 'Movie'
  },
  {
    id: 'movie/watch-the-banshees-of-inisherin-91351',
    title: 'The Banshees of Inisherin',
    url: 'https://flixhq.to/movie/watch-the-banshees-of-inisherin-91351',
    image: 'https://img.flixhq.to/xxrz/250x400/379/6e/d2/6ed2e9486552bf0bda5dd3be8db0baec/6ed2e9486552bf0bda5dd3be8db0baec.jpg',
    releaseDate: '2022',
    duration: '114m',
    type: 'Movie'
  },
  {
    id: 'movie/watch-avatar-19690',
    title: 'Avatar',
    url: 'https://flixhq.to/movie/watch-avatar-19690',
    image: 'https://img.flixhq.to/xxrz/250x400/379/9d/0f/9d0fe6f16f205e483df14817753c1b0d/9d0fe6f16f205e483df14817753c1b0d.jpg',
    releaseDate: '2009',
    duration: '162m',
    type: 'Movie'
  },
  {...},
]
```


### fetchTrendingTvShows

```ts
flixhq.fetchTrendingTvShows().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of tv shows. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
{
    id: 'tv/watch-1923-91522',
    title: '1923',
    url: 'https://flixhq.to/tv/watch-1923-91522',
    image: 'https://img.flixhq.to/xxrz/250x400/379/96/f3/96f3c8dfd9583a855473e2e9039c8bda/96f3c8dfd9583a855473e2e9039c8bda.jpg',
    season: 'SS 1',
    latestEpisode: 'EPS 1',
    type: 'TV Series'
  },
  {
    id: 'tv/watch-the-recruit-91507',
    title: 'The Recruit',
    url: 'https://flixhq.to/tv/watch-the-recruit-91507',
    image: 'https://img.flixhq.to/xxrz/250x400/379/0e/bd/0ebd5fe83f5a5f7055089d3390727e1c/0ebd5fe83f5a5f7055089d3390727e1c.jpg',
    season: 'SS 1',
    latestEpisode: 'EPS 8',
    type: 'TV Series'
  },
  {
    id: 'tv/watch-wednesday-90553',
    title: 'Wednesday',
    url: 'https://flixhq.to/tv/watch-wednesday-90553',
    image: 'https://img.flixhq.to/xxrz/250x400/379/9b/70/9b70e344f895fd9ed9cbac46d95b21a2/9b70e344f895fd9ed9cbac46d95b21a2.jpg',
    season: 'SS 1',
    latestEpisode: 'EPS 8',
    type: 'TV Series'
  },
  {...},
]
```

### fetchByCountry

<h4>Parameters</h4>

| Parameter       | Type     | Description                                                             |
| --------------- | -------- | ----------------------------------------------------------------------- |
| country         | `string` | param to filter by country. (*In this case, We're filtering by `KR`*)   |
| page (optional) | `number` | page number (default: 1)                                                |

```ts
flixhq.fetchByCountry('KR').then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of movies/tv series. (*[`Promise<ISearch<IMovieResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L233-L241)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  results: [
    {
      id: 'tv/watch-wedding-impossible-106609',
      title: 'Wedding Impossible',
      url: 'https://flixhq.to/tv/watch-wedding-impossible-106609',
      image: 'https://img.flixhq.to/xxrz/250x400/379/d1/8c/d18c569318ce319a57ba681c69b01d73/d18c569318ce319a57ba681c69b01d73.jpg',
      season: 'SS 1',
      latestEpisode: 'EPS 1',
      type: 'TV Series'
    },
    {
      id: 'tv/watch-a-killer-paradox-106036',
      title: 'A Killer Paradox',
      url: 'https://flixhq.to/tv/watch-a-killer-paradox-106036',
      image: 'https://img.flixhq.to/xxrz/250x400/379/89/a0/89a0eede251cff2c9acf24fe64e2fe01/89a0eede251cff2c9acf24fe64e2fe01.jpg',
      season: 'SS 1',
      latestEpisode: 'EPS 8',
      type: 'TV Series'
    },
    {...}
  ]
}
```

### fetchByGenre

<h4>Parameters</h4>

| Parameter       | Type     | Description                                                            |
| --------------- | -------- | ---------------------------------------------------------------------- |
| genre           | `string` | param to filter by genre. (*In this case, We're filtering by `drama`*) |
| page (optional) | `number` | page number (default: 1)                                               |

```ts
flixhq.fetchByGenre('drama').then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of movies/tv series. (*[`Promise<ISearch<IMovieResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L233-L241)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  results: [
    {
      id: 'movie/watch-no-new-friends-105202',
      title: 'No New Friends',
      url: 'https://flixhq.to/movie/watch-no-new-friends-105202',
      image: 'https://img.flixhq.to/xxrz/250x400/379/16/30/16304d1c6302e6b078f6b74d5ff58347/16304d1c6302e6b078f6b74d5ff58347.jpg',
      releaseDate: '2024',
      seasons: undefined,
      type: 'Movie'
    },
    {
      id: 'tv/watch-shogun-106618',
      title: 'Shōgun',
      url: 'https://flixhq.to/tv/watch-shogun-106618',
      image: 'https://img.flixhq.to/xxrz/250x400/379/a7/fc/a7fca6a36c98856de5e71d120a16e521/a7fca6a36c98856de5e71d120a16e521.jpg',
      releaseDate: undefined,
      seasons: 1,
      type: 'TV Series'
    },
    {...}
  ]
}
```
