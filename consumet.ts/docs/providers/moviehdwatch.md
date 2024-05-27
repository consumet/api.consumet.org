<h1>MovieHdWatch</h1>

```ts
const moviesHd = new MOVIES.MovieHdWatch();
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
| query           | `string` | query to search for. (*In this case, We're searching for `Batman`*)                                                                        |
| page (optional) | `number` | page number (default: 1)                                                                                                                   |

```ts
moviesHd.search("Batman").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of movies/tv series. (*[`Promise<ISearch<IMovieResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L233-L241)*)\
output:
```js
{
  currentPage: 1, // current page
  hasNextPage: true, // if there is a next page
  results: [
    {
      id: 'tv/watch-batman-online-39276',
      title: 'Batman',
      url: 'https://movieshd.watch/tv/watch-batman-online-39276',
      image: 'https://img.movieshd.watch/xxrz/250x400/391/fb/f9/fbf9562059527ed2075e3e61bf7439c6/fbf9562059527ed2075e3e61bf7439c6.jpg',
      releaseDate: undefined,
      seasons: 3,
      duration: undefined,
      type: 'TV Series'
    },
    {
      id: 'movie/watch-batman-online-13647',
      title: 'Batman',
      url: 'https://movieshd.watch/movie/watch-batman-online-13647',
      image: 'https://img.movieshd.watch/xxrz/250x400/391/7d/df/7ddf28de1b0053327ad6ff1c974894e8/7ddf28de1b0053327ad6ff1c974894e8.jpg',
      releaseDate: '1966',
      seasons: undefined,
      duration: '105m',
      type: 'Movie'
    },
    {
      id: 'movie/watch-batman-online-18073',
      title: 'Batman',
      url: 'https://movieshd.watch/movie/watch-batman-online-18073',
      image: 'https://img.movieshd.watch/xxrz/250x400/391/d9/bc/d9bc77bc0c00049fbaba0896b51d361f/d9bc77bc0c00049fbaba0896b51d361f.jpg',
      releaseDate: '1989',
      seasons: undefined,
      duration: '126m',
      type: 'Movie'
    },
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
moviesHd.fetchMediaInfo('movie/watch-the-batman-online-16076').then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes). (*[`Promise<IMovieInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L243-L254)*)\
output:
```js
{
  id: 'movie/watch-the-batman-online-16076',
  title: 'The Batman',
  url: 'https://movieshd.watch/movie/watch-the-batman-online-16076',
  cover: 'https://img.movieshd.watch/xxrz/1200x600/391/34/98/3498b36949518ca118b1ebe321dbd7ca/3498b36949518ca118b1ebe321dbd7ca.jpg',
  image: 'https://img.movieshd.watch/xxrz/250x400/391/21/2d/212d2d95b9d515504a4de227d49a769f/212d2d95b9d515504a4de227d49a769f.jpg',
  description: "A point-of-view driven noir tale with heavy focus on Batman's detective work. A stand-alone story with no connection to the DCEU.",
  type: 'Movie',
  releaseDate: '2022-03-01',
  genres: [ 'Drama', 'Action', 'Crime', 'Mystery', 'Fantasy', 'Thriller' ],
  casts: [
    'Robert Pattinson',
    'Vanessa Kirby',
    'Jeffrey Wright',
    'Jonah Hill',
    'Peter Sarsgaard'
  ],
  production: 'DC Entertainment,Branded Entertainment/Batfilm Productions,Atlas Entertainment,Cruel & Unusual Films,Warner Bros. Pictures,6th & Idaho Productions,Mad Ghost Productions,DC Comics,DC Films,Dylan Clark Productions',
  country: [ 'United States of America' ],
  duration: '176min',
  rating: 7.9,
  recommendations: [
    {
      id: 'movie/watch-through-my-window-across-the-sea-online-97675',
      title: 'Through My Window: Across the Sea',
      image: 'https://img.movieshd.watch/xxrz/250x400/391/fd/fa/fdfaee0cf2c0321390292d5d2f60c9b4/fdfaee0cf2c0321390292d5d2f60c9b4.jpg',
      releaseDate: '2023',
      seasons: undefined,
      duration: '110m',
      type: 'Movie'
    },
    {
      id: 'tv/watch-the-walking-dead-dead-city-online-97540',
      title: 'The Walking Dead: Dead City',
      image: 'https://img.movieshd.watch/xxrz/250x400/391/96/2f/962fd0158f7f708e16fc62f8b763a276/962fd0158f7f708e16fc62f8b763a276.jpg',
      releaseDate: undefined,
      seasons: 1,
      duration: undefined,
      type: 'TV Series'
    },
    {...},
    ...  
  ],
  episodes: [
    {
      id: '16076',
      title: 'The Batman',
      url: 'https://movieshd.watch/ajax/movie/episodes/16076'
    }
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
moviesHd.fetchEpisodeSources('16076', 'movie/watch-the-batman-online-16076').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of episode sources and subtitles. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L300-L306)*)\
output:
```js
{
  headers: { Referer: 'https://dokicloud.one/embed-4/3F3nysmdRDMF?z=' },
  sources: [
    {
      url: 'https://eno.dokicloud.one/_v10/fd5de830b89416820504ffef6b23be58878b11bc91d26f99a884f7d4c0dc7c4c500b6ce5d53054d705a74628a3b34208a95bf0d5663142027d6284e4ce2424b9a8cbe9241fb0054f352fcf4d797b2af0fec364a840a38d0d1d3a340c564ad89bb1fecb219076d813667da0ad13266f8a589df412b39bcc03c7c07dc5bfe401c2601ce19dd9530fac08c20fc89104a5d0/1080/index.m3u8',
      quality: '1080',
      isM3U8: true
    },
    {
      url: 'https://eno.dokicloud.one/_v10/fd5de830b89416820504ffef6b23be58878b11bc91d26f99a884f7d4c0dc7c4c500b6ce5d53054d705a74628a3b34208a95bf0d5663142027d6284e4ce2424b9a8cbe9241fb0054f352fcf4d797b2af0fec364a840a38d0d1d3a340c564ad89bb1fecb219076d813667da0ad13266f8a589df412b39bcc03c7c07dc5bfe401c2601ce19dd9530fac08c20fc89104a5d0/720/index.m3u8',
      quality: '720',
      isM3U8: true
    },
    {
      url: 'https://eno.dokicloud.one/_v10/fd5de830b89416820504ffef6b23be58878b11bc91d26f99a884f7d4c0dc7c4c500b6ce5d53054d705a74628a3b34208a95bf0d5663142027d6284e4ce2424b9a8cbe9241fb0054f352fcf4d797b2af0fec364a840a38d0d1d3a340c564ad89bb1fecb219076d813667da0ad13266f8a589df412b39bcc03c7c07dc5bfe401c2601ce19dd9530fac08c20fc89104a5d0/360/index.m3u8',
      quality: '360',
      isM3U8: true
    },
    {
      url: 'https://eno.dokicloud.one/_v10/fd5de830b89416820504ffef6b23be58878b11bc91d26f99a884f7d4c0dc7c4c500b6ce5d53054d705a74628a3b34208a95bf0d5663142027d6284e4ce2424b9a8cbe9241fb0054f352fcf4d797b2af0fec364a840a38d0d1d3a340c564ad89bb1fecb219076d813667da0ad13266f8a589df412b39bcc03c7c07dc5bfe401c2601ce19dd9530fac08c20fc89104a5d0/playlist.m3u8',
      isM3U8: true,
      quality: 'auto'
    }
  ],
  subtitles: [
    {
      url: 'https://cc.2cdns.com/85/ca/85ca0405b2fc0f1f3edacf13e84a9277/85ca0405b2fc0f1f3edacf13e84a9277.vtt',
      lang: 'Arabic'
    },
    {
      url: 'https://cc.2cdns.com/9c/19/9c19c8fceb977034e8ef86bba8ec161e/9c19c8fceb977034e8ef86bba8ec161e.vtt',
      lang: 'Danish'
    },
    {
      url: 'https://cc.2cdns.com/c7/7f/c77fc58f1848b61b665e7de01f298223/eng-2.vtt',
      lang: 'English'
    },
    {
      url: 'https://cc.2cdns.com/a2/73/a2737a6c19b70eb7be88f852eb3f2b8a/a2737a6c19b70eb7be88f852eb3f2b8a.vtt',
      lang: 'Finnish'
    },
    {
      url: 'https://cc.2cdns.com/b2/18/b2180b98383a2ad8a3d3297af5ee9e7f/b2180b98383a2ad8a3d3297af5ee9e7f.vtt',
      lang: 'Indonesian'
    },
    {
      url: 'https://cc.2cdns.com/8f/4b/8f4bf106dc5aca724af13820acde367c/8f4bf106dc5aca724af13820acde367c.vtt',
      lang: 'Norwegian'
    },
    {
      url: 'https://cc.2cdns.com/37/3f/373fd3656dfbccd23746b325f0fdf917/373fd3656dfbccd23746b325f0fdf917.vtt',
      lang: 'Portuguese'
    },
    {
      url: 'https://cc.2cdns.com/b7/e5/b7e5765026f7031a883d19b9b919613a/b7e5765026f7031a883d19b9b919613a.vtt',
      lang: 'Spanish'
    }
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
moviesHd.fetchEpisodeServers('16076', 'movie/watch-the-batman-online-16076').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of episode servers. (*[`Promise<IEpisodeServer[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L115-L118)*)\
output:
```js
[
  { name: 'MixDrop', url: 'https://mixdrop.co/e/7r1l3erphjrn0o' },
  { name: 'DoodStream', url: 'https://dood.watch/e/6xi1hr51ghlb' },
  {
    name: 'Vidcloud',
    url: 'https://rabbitstream.net/embed-4/T2SqGLFECVhb?z='
  },
  {
    name: 'UpCloud',
    url: 'https://dokicloud.one/embed-4/3F3nysmdRDMF?z='
  }
  {...},
   ...
]
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/movies.md#">back to movie providers list</a>)</p>

### fetchRecentMovies

```ts
moviesHd.fetchRecentMovies().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of movies. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
 {
    id: 'movie/watch-worlds-best-online-97678',
    title: "World's Best",
    url: 'https://movieshd.watch/movie/watch-worlds-best-online-97678',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/39/a6/39a6f63d6aa29ed36b292e029d3d38f0/39a6f63d6aa29ed36b292e029d3d38f0.jpg',
    releaseDate: '2023',
    duration: '101m',
    type: 'Movie'
  },
  {
    id: 'movie/watch-through-my-window-across-the-sea-online-97675',
    title: 'Through My Window: Across the Sea',
    url: 'https://movieshd.watch/movie/watch-through-my-window-across-the-sea-online-97675',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/fd/fa/fdfaee0cf2c0321390292d5d2f60c9b4/fdfaee0cf2c0321390292d5d2f60c9b4.jpg',
    releaseDate: '2023',
    duration: '110m',
    type: 'Movie'
  },
  {
    id: 'movie/watch-the-perfect-find-online-97669',
    title: 'The Perfect Find',
    url: 'https://movieshd.watch/movie/watch-the-perfect-find-online-97669',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/c9/a7/c9a780f7d7cd1eb8a72c3e4ee5880426/c9a780f7d7cd1eb8a72c3e4ee5880426.jpg',
    releaseDate: '2023',
    duration: '99m',
    type: 'Movie'
  },
  {...},
]
```


### fetchRecentTvShows

```ts
moviesHd.fetchRecentTvShows().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of tv shows. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
  {
    id: 'tv/watch-deadloch-online-97072',
    title: 'Deadloch',
    url: 'https://movieshd.watch/tv/watch-deadloch-online-97072',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/9f/85/9f8594271eb6540e32b7fbda24747c6e/9f8594271eb6540e32b7fbda24747c6e.jpg',
    season: 1,
    latestEpisode: 6,
    type: 'TV Series'
  },
  {
    id: 'tv/watch-clone-high-online-96937',
    title: 'Clone High',
    url: 'https://movieshd.watch/tv/watch-clone-high-online-96937',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/ad/c5/adc55790c8c88d5538210f7558fec960/adc55790c8c88d5538210f7558fec960.jpg',
    season: 1,
    latestEpisode: 10,
    type: 'TV Series'
  },
  {
    id: 'tv/watch-and-just-like-that-online-75286',
    title: 'And Just Like That…',
    url: 'https://movieshd.watch/tv/watch-and-just-like-that-online-75286',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/b8/e2/b8e20a6264e28cf1133413f63425297d/b8e20a6264e28cf1133413f63425297d.jpg',
    season: 2,
    latestEpisode: 2,
    type: 'TV Series'
  },
  {...},
]
```


### fetchTrendingMovies

```ts
moviesHd.fetchTrendingMovies().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of movies. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
  {
    id: 'movie/watch-through-my-window-across-the-sea-online-97675',
    title: 'Through My Window: Across the Sea',
    url: 'https://movieshd.watch/movie/watch-through-my-window-across-the-sea-online-97675',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/fd/fa/fdfaee0cf2c0321390292d5d2f60c9b4/fdfaee0cf2c0321390292d5d2f60c9b4.jpg',
    releaseDate: '2023',
    duration: '110m',
    type: 'Movie'
  },
  {
    id: 'movie/watch-extraction-2-online-97549',
    title: 'Extraction 2',
    url: 'https://movieshd.watch/movie/watch-extraction-2-online-97549',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/9c/d5/9cd56c00c2b79598f7fba8ba33b2128d/9cd56c00c2b79598f7fba8ba33b2128d.jpg',
    releaseDate: '2023',
    duration: '123m',
    type: 'Movie'
  },
  {
    id: 'movie/watch-the-perfect-find-online-97669',
    title: 'The Perfect Find',
    url: 'https://movieshd.watch/movie/watch-the-perfect-find-online-97669',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/c9/a7/c9a780f7d7cd1eb8a72c3e4ee5880426/c9a780f7d7cd1eb8a72c3e4ee5880426.jpg',
    releaseDate: '2023',
    duration: '99m',
    type: 'Movie'
  },
  {...},
]
```


### fetchTrendingTvShows

```ts
moviesHd.fetchTrendingTvShows().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of tv shows. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
  {
    id: 'tv/watch-secret-invasion-online-88246',
    title: 'Secret Invasion',
    url: 'https://movieshd.watch/tv/watch-secret-invasion-online-88246',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/84/21/84218c778e006f43777e1f8fe18a2560/84218c778e006f43777e1f8fe18a2560.jpg',
    season: 1,
    latestEpisode: 1,
    type: 'TV Series'
  },
  {
    id: 'tv/watch-skull-island-online-97690',
    title: 'Skull Island',
    url: 'https://movieshd.watch/tv/watch-skull-island-online-97690',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/83/c1/83c19806235b273f762c328a49d4d91d/83c19806235b273f762c328a49d4d91d.jpg',
    season: 1,
    latestEpisode: 8,
    type: 'TV Series'
  },
  {
    id: 'tv/watch-black-mirror-online-39396',
    title: 'Black Mirror',
    url: 'https://movieshd.watch/tv/watch-black-mirror-online-39396',
    image: 'https://img.movieshd.watch/xxrz/250x400/391/d6/9d/d69d87285ef143fab74322227616bb04/d69d87285ef143fab74322227616bb04.jpg',
    season: 6,
    latestEpisode: 5,
    type: 'TV Series'
  },
  {...},
]
```
