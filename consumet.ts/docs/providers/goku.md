<h1>Goku</h1>

```ts
const goku = new MOVIES.Goku();
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
goku.search("Batman").then(data => {
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
      id: 'watch-movie/watch-batman-13647',
      title: 'Batman',
      url: 'https://goku.sx/watch-movie/watch-batman-13647',
      image: 'https://img.goku.sx/xxrz/250x400/576/7d/df/7ddf28de1b0053327ad6ff1c974894e8/7ddf28de1b0053327ad6ff1c974894e8.jpg',
      releaseDate: '1966',
      rating: 6.5,
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
goku.fetchMediaInfo("watch-movie/watch-batman-begins-19636").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes). (*[`Promise<IMovieInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L243-L254)*)\
output:
```js
{
  id: 'watch-movie/watch-batman-begins-19636',
  title: 'Batman Begins',
  url: 'https://goku.sx/watch-movie/watch-batman-begins-19636',
  image: 'https://img.goku.sx/xxrz/250x400/576/15/33/1533eaa2c80dbc5ea003c7cc4f6669ff/1533eaa2c80dbc5ea003c7cc4f6669ff.jpg',
  description: 'Billionaire Bruce Wayne is driven by tragedy to expose and defeat the corruption that haunts his hometown of Gotham City. Because he is unable to work within the system, he establishes a new identity as The Batman, a symbol of fear for the criminal underworld. ',
  type: 'Movie',
  genres: [ 'Action', 'Crime', 'Drama' ],
  casts: [
    'Tom Wilkinson',
    'Vincent Wong',
    'Morgan Freeman',
    'Katie Holmes',
    'Ken Watanabe'
  ],
  production: 'DC Comics,Legendary Entertainment,DC Entertainment,Syncopy,Patalex III Productions Limited,Warner Bros. Pictures',
  duration: '140 m',
  episodes: [
    {
      id: '1064170',
      title: 'Batman Begins',
      url: 'https://goku.sx/watch-movie/watch-batman-begins-19636/1064170'
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
goku.fetchEpisodeSources('1064170', 'watch-movie/watch-batman-begins-19636').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of episode sources and subtitles. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L300-L306)*)\
output:
```js
{
  headers: { Referer: 'https://dokicloud.one/embed-4/K6ki8JPP1SkJ?autoPlay=0' },
  sources: [
    {
      url: 'https://eno.dokicloud.one/_v10/2af246bae4e0d217720d27dba17e4a0f4e8f550c693738169f21cf8cc72f2198e352e26e99193ebd3dce37463b7c7fcb891ee7fda32f63c11374de4c1b5bf6c7dbfc2851e0463aafed7be7e5e481ececc3b638fc02a47e512968fd9a297ae7344582c2dde5e2b37efab41bbcafbc11b60de37d5e6fc50ce45f70ce940bf10f16bb7fcfb0a02f3bdbdd69999e636a61f4/1080/index.m3u8',
      quality: '1080',
      isM3U8: true
    },
    {
      url: 'https://eno.dokicloud.one/_v10/2af246bae4e0d217720d27dba17e4a0f4e8f550c693738169f21cf8cc72f2198e352e26e99193ebd3dce37463b7c7fcb891ee7fda32f63c11374de4c1b5bf6c7dbfc2851e0463aafed7be7e5e481ececc3b638fc02a47e512968fd9a297ae7344582c2dde5e2b37efab41bbcafbc11b60de37d5e6fc50ce45f70ce940bf10f16bb7fcfb0a02f3bdbdd69999e636a61f4/720/index.m3u8',
      quality: '720',
      isM3U8: true
    },
    {
      url: 'https://eno.dokicloud.one/_v10/2af246bae4e0d217720d27dba17e4a0f4e8f550c693738169f21cf8cc72f2198e352e26e99193ebd3dce37463b7c7fcb891ee7fda32f63c11374de4c1b5bf6c7dbfc2851e0463aafed7be7e5e481ececc3b638fc02a47e512968fd9a297ae7344582c2dde5e2b37efab41bbcafbc11b60de37d5e6fc50ce45f70ce940bf10f16bb7fcfb0a02f3bdbdd69999e636a61f4/360/index.m3u8',
      quality: '360',
      isM3U8: true
    },
    {
      url: 'https://eno.dokicloud.one/_v10/2af246bae4e0d217720d27dba17e4a0f4e8f550c693738169f21cf8cc72f2198e352e26e99193ebd3dce37463b7c7fcb891ee7fda32f63c11374de4c1b5bf6c7dbfc2851e0463aafed7be7e5e481ececc3b638fc02a47e512968fd9a297ae7344582c2dde5e2b37efab41bbcafbc11b60de37d5e6fc50ce45f70ce940bf10f16bb7fcfb0a02f3bdbdd69999e636a61f4/playlist.m3u8',
      isM3U8: true,
      quality: 'auto'
    }
  ],
  subtitles: [
    {
      url: 'https://cc.2cdns.com/19/09/19094c8682ed23d7d4ebf16ed2272164/19094c8682ed23d7d4ebf16ed2272164.vtt',
      lang: 'English'
    },
    {
      url: 'https://cc.2cdns.com/12/1b/121bb7314feb9661f55597aa441d7551/121bb7314feb9661f55597aa441d7551.vtt',
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
goku.fetchEpisodeServers('1064170', 'watch-movie/watch-batman-begins-19636').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of episode servers. (*[`Promise<IEpisodeServer[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L115-L118)*)\
output:
```js
[
  {
    name: 'UpCloud',
    url: 'https://dokicloud.one/embed-4/K6ki8JPP1SkJ?autoPlay=0'
  },
  {
    name: 'Vidcloud',
    url: 'https://rabbitstream.net/embed-4/eq17GDB0o3mj?autoPlay=0'
  },
  {
    name: 'Upstream',
    url: 'https://upstream.to/embed-ncw8o5bt6ie5.html'
  },
  { 
    name: 'MixDrop',
    url: 'https://mixdrop.co/e/kn9l3gelc3d4med' 
  }    
  {...},
   ...
]
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/movies.md#">back to movie providers list</a>)</p>

### fetchRecentMovies

```ts
goku.fetchRecentMovies().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of movies. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
  {
    id: 'watch-movie/watch-the-wedding-contract-97651',
    title: 'The Wedding Contract',
    url: 'https://goku.sx/watch-movie/watch-the-wedding-contract-97651',
    image: 'https://img.goku.sx/xxrz/250x400/576/33/10/33107bd51d8b311170c90b6f300fa362/33107bd51d8b311170c90b6f300fa362.jpg',
    releaseDate: '2023',
    duration: '84min',
    type: 'Movie'
  },
  {
    id: 'watch-movie/watch-the-nudels-of-nudeland-97648',
    title: 'The Nudels of Nudeland',
    url: 'https://goku.sx/watch-movie/watch-the-nudels-of-nudeland-97648',
    image: 'https://img.goku.sx/xxrz/250x400/576/f2/89/f289a6f11fac3f1633bac1d6c172d54d/f289a6f11fac3f1633bac1d6c172d54d.jpg',
    releaseDate: '2022',
    duration: '95min',
    type: 'Movie'
  },
  {
    id: 'watch-movie/watch-the-machine-97645',
    title: 'The Machine',
    url: 'https://goku.sx/watch-movie/watch-the-machine-97645',
    image: 'https://img.goku.sx/xxrz/250x400/576/eb/8d/eb8ddc18d6b098be9f04203c2d3d0a6b/eb8ddc18d6b098be9f04203c2d3d0a6b.jpg',
    releaseDate: '2023',
    duration: '112min',
    type: 'Movie'
  },
  {...},
]
```


### fetchRecentTvShows

```ts
goku.fetchRecentTvShows().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of tv shows. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
  {
    id: 'watch-series/watch-deadloch-97072',
    title: 'Deadloch',
    url: 'https://goku.sx/watch-series/watch-deadloch-97072',
    image: 'https://img.goku.sx/xxrz/250x400/576/9f/85/9f8594271eb6540e32b7fbda24747c6e/9f8594271eb6540e32b7fbda24747c6e.jpg',
    season: '1',
    latestEpisode: '6',
    type: 'TV Series'
  },
  {
    id: 'watch-series/watch-clone-high-96937',
    title: 'Clone High',
    url: 'https://goku.sx/watch-series/watch-clone-high-96937',
    image: 'https://img.goku.sx/xxrz/250x400/576/ad/c5/adc55790c8c88d5538210f7558fec960/adc55790c8c88d5538210f7558fec960.jpg',
    season: '1',
    latestEpisode: '10',
    type: 'TV Series'
  },
  {
    id: 'watch-series/watch-and-just-like-that-75286',
    title: 'And Just Like That…',
    url: 'https://goku.sx/watch-series/watch-and-just-like-that-75286',
    image: 'https://img.goku.sx/xxrz/250x400/576/b8/e2/b8e20a6264e28cf1133413f63425297d/b8e20a6264e28cf1133413f63425297d.jpg',
    season: '2',
    latestEpisode: '2',
    type: 'TV Series'
  },
  {...},
]
```


### fetchTrendingMovies

```ts
goku.fetchTrendingMovies().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of movies. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
 {
    id: 'watch-movie/watch-extraction-2-97549',
    title: 'Extraction 2',
    url: 'https://goku.sx/watch-movie/watch-extraction-2-97549',
    image: 'https://img.goku.sx/xxrz/250x400/576/9c/d5/9cd56c00c2b79598f7fba8ba33b2128d/9cd56c00c2b79598f7fba8ba33b2128d.jpg',
    releaseDate: '2023',
    duration: '123min',
    type: 'Movie'
  },
  {
    id: 'watch-movie/watch-the-flash-97519',
    title: 'The Flash',
    url: 'https://goku.sx/watch-movie/watch-the-flash-97519',
    image: 'https://img.goku.sx/xxrz/250x400/576/f7/97/f7975e92348f8055ee359ea5218d1aa5/f7975e92348f8055ee359ea5218d1aa5.jpg',
    releaseDate: '2023',
    duration: '144min',
    type: 'Movie'
  },
  {
    id: 'watch-movie/watch-fast-and-furious-10-8846',
    title: 'Fast X',
    url: 'https://goku.sx/watch-movie/watch-fast-and-furious-10-8846',
    image: 'https://img.goku.sx/xxrz/250x400/576/a9/9b/a99ba7cd6b251e75c6723da994bc02b4/a99ba7cd6b251e75c6723da994bc02b4.jpg',
    releaseDate: '2023',
    duration: '142min',
    type: 'Movie'
  },
  {...},
]
```


### fetchTrendingTvShows

```ts
goku.fetchTrendingTvShows().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of tv shows. (*[`Promise<IMovieResult[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
[
  {
    id: 'watch-series/watch-secret-invasion-88246',
    title: 'Secret Invasion',
    url: 'https://goku.sx/watch-series/watch-secret-invasion-88246',
    image: 'https://img.goku.sx/xxrz/250x400/576/84/21/84218c778e006f43777e1f8fe18a2560/84218c778e006f43777e1f8fe18a2560.jpg',
    season: '1',
    latestEpisode: '1',
    type: 'TV Series'
  },
  {
    id: 'watch-series/watch-black-mirror-39396',
    title: 'Black Mirror',
    url: 'https://goku.sx/watch-series/watch-black-mirror-39396',
    image: 'https://img.goku.sx/xxrz/250x400/576/d6/9d/d69d87285ef143fab74322227616bb04/d69d87285ef143fab74322227616bb04.jpg',
    season: '6',
    latestEpisode: '5',
    type: 'TV Series'
  },
  {
    id: 'watch-series/watch-demon-slayer-kimetsu-no-yaiba-42177',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    url: 'https://goku.sx/watch-series/watch-demon-slayer-kimetsu-no-yaiba-42177',
    image: 'https://img.goku.sx/xxrz/250x400/576/d7/38/d7380c0e22b5493e8f2257c539d8a6fa/d7380c0e22b5493e8f2257c539d8a6fa.jpg',
    season: '3',
    latestEpisode: '11',
    type: 'TV Series'
  },
  {...},
]
```
