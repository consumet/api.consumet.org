<h1>Gogoanime</h1>

```ts
const gogoanime = new ANIME.Gogoanime();
```

<h2>Methods</h2>

- [search](#search)
- [fetchRecentEpisodes](#fetchrecentepisodes)
- [fetchTopAiring](#fetchtopairing)
- [fetchAnimeList](#fetchanimelist)
- [fetchAnimeInfo](#fetchanimeinfo)
- [fetchEpisodeSources](#fetchepisodesources)
- [fetchEpisodeServers](#fetchepisodeservers)

### search
> Note: This method is a subclass of the [`BaseParser`](https://github.com/consumet/extensions/blob/master/src/models/base-parser.ts) class. meaning it is available across most categories.


<h4>Parameters</h4>

| Parameter       | Type     | Description                                                            |
| --------------- | -------- | ---------------------------------------------------------------------- |
| query           | `string` | query to search for. (*In this case, We're searching for `One Piece`*) |
| page (optional) | `number` | page number (default: 1)                                               |

```ts
gogoanime.search("One Piece").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  currentPage: 1, // current page
  hasNextPage: true, // if there is a next page
  results: [
    {
      id: 'one-piece', // anime id
      title: 'One Piece',
      url: 'https://gogoanime.gg//category/one-piece', // anime url
      image: 'https://gogocdn.net/images/anime/One-piece.jpg',
      releaseDate: 'Released: 1999',
      subOrDub: 'sub'
    },
    {
      id: 'toriko-dub',
      title: 'Toriko (Dub)',
      url: 'https://gogoanime.gg//category/toriko-dub',
      image: 'https://gogocdn.net/cover/toriko-dub.png',
      releaseDate: 'Released: 2011',
      subOrDub: 'dub'
    },
    {...},
    ...
  ]
}
```

### fetchRecentEpisodes

<h4>Parameters</h4>

| Parameter       | Type     | Description                                                                                                                         |
| --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| page (optional) | `number` | page number (default: 1)                                                                                                            |
| type (optional) | `string` | type of anime (default: `1`). `1`: Japanese with subtitles, `2`: english/dub with no subtitles, `3`: chinese with english subtitles |

```ts
gogoanime.fetchRecentEpisodes().then(data => {
  console.log(data);
})
```

output:
```js
{
  currentPage: 1, // current page
  hasNextPage: true, // if there is a next page
  results: [
    {
      id: 'hellsing',
      episodeId: 'hellsing-episode-13',
      episodeNumber: 13,
      title: 'Hellsing',
      image: 'https://gogocdn.net/images/anime/H/hellsing.jpg',
      url: 'https://gogoanime.gg//hellsing-episode-13'
    },
    {...}
    ...
  ]
}
```

### fetchTopAiring

return top airing anime list.

<h4>Parameters</h4>

| Parameter       | Type     | Description              |
| --------------- | -------- | ------------------------ |
| page (optional) | `number` | page number (default: 1) |

```ts
gogoanime.fetchTopAiring().then(data => {
  console.log(data);
})
```

output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  results: [
    {
      id: 'ore-dake-level-up-na-ken',
      title: 'Ore dake Level Up na Ken',
      image: 'https://gogocdn.net/cover/ore-dake-level-up-na-ken-1708917521.png',
      url: 'https://gogoanime3.co/category/ore-dake-level-up-na-ken',
      genres: [ 'Action', 'Adventure', 'Fantasy' ],
      episodeId: 'ore-dake-level-up-na-ken-episode-9',
      episodeNumber: 9
    }
    {...}
    ...
  ]
}
```

### fetchAnimeList

return gogo anime list.

<h4>Parameters</h4>

| Parameter       | Type     | Description              |
| --------------- | -------- | ------------------------ |
| page (optional) | `number` | page number (default: 1) |

```ts
gogoanime.fetchAnimeList().then(data => {
  console.log(data);
})
```

output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  results: [
    {
      id: 'hackgu-returner',
      title: '.Hack//G.U. Returner',
      image: 'https://gogocdn.net/images/anime/5745.jpg',
      url: 'https://gogoanime3.co/category/hackgu-returner',
      genres: [ 'Adventure', 'Drama', 'Game', 'Harem', 'Martial Arts', 'Seinen' ],
      releaseDate: 'Released: 2007'
    }
    {...}
    ...
  ]
}
```

### fetchAnimeInfo

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                                        |
| --------- | -------- | -------------------------------------------------------------------------------------------------- |
| animeUrl  | `string` | takes anime url or id as a parameter. (*anime id or url can be found in the anime search results*) |

```ts
gogoanime.fetchAnimeInfo("one-piece").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes). (*[`Promise<IAnimeInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L28-L42)*)\
output:
```js
{
  id: 'one-piece',
  title: 'One Piece',
  url: 'https://gogoanime.gg/category/one-piece',
  genres: [
    'Action',
    'Adventure',
    '...'
  ],
  totalEpisodes: 1022,
  image: 'https://gogocdn.net/images/anime/One-piece.jpg',
  releaseDate: '1999',
  description: 'One Piece is a story about  Monkey D. Luffy, who wants to become a sea-robber. In a world mystical...',
  subOrDub: 'sub',
  type: 'TV Series',
  status: 'Ongoing',
  otherName: '',
  episodes: [
    {
      id: 'one-piece-episode-1022',
      number: 1022,
      url: 'https://gogoanime.gg//one-piece-episode-1022'
    },
    {
      id: 'one-piece-episode-1021',
      number: 1021,
      url: 'https://gogoanime.gg//one-piece-episode-1021'
    },
    {...},
    ...
  ]
}
```

### fetchEpisodeSources

<h4>Parameters</h4>

| Parameter         | Type                                                                                                 | Description                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| episodeId         | `string`                                                                                             | takes episode id as a parameter. (*episode id can be found in the anime info object*)                                                                     |
| server (optional) | [`StreamingServers`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L76-L82) | takes server enum as a parameter. *default: [`StreamingServers.GogoCDN`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L76-L82)* |


```ts
gogoanime.fetchEpisodeSources("one-piece-episode-1022").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of episode sources. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L210-L214)*)\
output:
```js
{
  headers: {
    Referer: 'https://goload.pro/streaming.php?id=MTg4MTgx&title=One+Piece+Episode+1022&typesub=SUB'
  },
  sources: [
    {
      url: 'https://manifest.prod.boltdns.net/manifest/v1/hls/v4/clear/6310593120001/6b17f612-a8e1-4fac-82ca-384537746607/6s/master.m3u8?fastly_token=NjJiNTU3Y2ZfZjdkZTc0MDYxODAwYTJkNTEzMGNiOTZhYjllNTA4MGVhNGFmZDNkMzNmZTQ2ZDdhNjc2MWI0NDU1YmRjYjcwZA%3D%3D',
      isM3U8: true
    },
    {
      url: 'https://www07.gogocdn.stream/hls/0b594d900f47daabc194844092384914/ep.1022.1655606306.m3u8',
      isM3U8: true
    }
  ]
}
```

### fetchEpisodeServers

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                                                   |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| episodeId | `string` | take an episode id or url as a parameter. (*episode id or episode url can be found in the anime info object*) |

```ts
gogoanime.fetchEpisodeServers("one-piece-episode-1022").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of episode servers. (*[`Promise<IEpisodeServer[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L54-L57)*)\
output:
```js
[
  {
    name: 'Vidstreaming',
    url: 'https://goload.pro/streaming.php?id=MTg4MTgx&title=One+Piece+Episode+1022&typesub=SUB'
  },
  {
    name: 'Gogo server',
    url: 'https://goload.pro/embedplus?id=MTg4MTgx&token=Ii6QxAl2Y3IHtOerPM6n7Q&expires=1656041793'
  },
  { name: 'Streamsb', url: 'https://ssbstream.net/e/a7xk4se5f1w9' },
  {...},
   ...
]
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/anime.md#">back to anime providers list</a>)</p>
