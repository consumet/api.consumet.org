<h1>9Anime</h1>

>Note: This provider has a special way of initializing
```ts
const nineanime = await ANIME.NineAnime.create();
```

<h2>Methods</h2>

- [search](#search)
- [fetchAnimeInfo](#fetchanimeinfo)
- [fetchEpisodeSources](#fetchepisodesources)
- [fetchEpisodeServers](#fetchepisodeservers)

### search
> Note: This method is a subclass of the [`BaseParser`](https://github.com/consumet/extensions/blob/master/src/models/base-parser.ts) class. meaning it is available across most categories.


<h4>Parameters</h4>

| Parameter | Type     | Description                                                         |
| --------- | -------- | ------------------------------------------------------------------- |
| query     | `string` | query to search for. (*In this case, We're searching for `ojisan`*) |

```ts
nineanime.search("ojisan").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: false,
  results: [
    {
      id: 'uncle-from-another-world.oj9q8',
      title: 'UNCLE FROM ANOTHER WORLD',
      url: 'https://9anime.to/watch/uncle-from-another-world.oj9q8',
      image: 'https://static.bunnycdn.ru/i/cache/images/1/1e/1e014e4ca206a486abef62cf0795c919.jpg',
      subOrSub: 'sub',
      type: 'TV'
    },
    {
      id: 'ojisan-and-marshmallow.4qo',
      title: 'Ojisan and Marshmallow',
      url: 'https://9anime.to/watch/ojisan-and-marshmallow.4qo',
      image: 'https://static.bunnycdn.ru/i/cache/images/2018/04/7794c3d41b0cd0d2c521b034fcca6b23.jpg',
      subOrSub: 'sub',
      type: 'TV'
    },
    {...}
    ...
  ]
}
```

### fetchAnimeInfo

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                                               |
| --------- | -------- | --------------------------------------------------------------------------------------------------------- |
| id        | `string` | takes anime id as a parameter. (*anime id can be found in the anime search results or anime info object*) |


```ts
nineanime.fetchAnimeInfo("uncle-from-another-world.oj9q8").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes). (*[`Promise<IAnimeInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L28-L42)*)\
output:
```js
{
  id: 'uncle-from-another-world.oj9q8',
  title: 'UNCLE FROM ANOTHER WORLD',
  url: 'https://9anime.id/watch/uncle-from-another-world.oj9q8',
  jpTitle: 'Isekai Ojisan',
  genres: [ 'Adventure', 'Comedy', 'Fantasy', 'Isekai' ],
  image: 'https://static.bunnycdn.ru/i/cache/images/1/1e/1e014e4ca206a486abef62cf0795c919.jpg',
  description: "Seventeen years ago, Takafumi's uncle fell into a coma, but now he's back like a man...",
  type: 'TV',
  studios: [ { id: 'atelierpontdarc', title: 'AtelierPontdarc' } ],
  releaseDate: 'Jul 06, 2022',
  status: 'Ongoing',
  score: 7.95,
  premiered: 'Summer 2022',
  duration: '24 min',
  views: 316267,
  otherNames: [ 'Isekai Ojisan', 'UNCLE FROM ANOTHER WORLD' ],
  totalEpisodes: 4,
  episodes: [
    {
      id: '155250',
      number: 1,
      title: 'I`m Finally Back from the Fantasy World of Granbahamal After 17 Long Years!',
      isFiller: false,
      url: 'https://9anime.id/ajax/server/list/155250?vrf=TYRythk8'
    },
    {
      id: '155251',
      number: 2,
      title: '"Guardian Heroes" Shoulda Been Number One!',
      isFiller: false,
      url: 'https://9anime.id/ajax/server/list/155251?vrf=TYRythk9'
    },
    {...}
    ...
  ]
}
```

### fetchEpisodeSources

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                           |
| --------- | -------- | ------------------------------------------------------------------------------------- |
| episodeId | `string` | takes episode id as a parameter. (*episode id can be found in the anime info object*) |


In this example, we're getting the sources for the first episode of Overlord IV.
```ts
nineanime.fetchEpisodeSources("155250").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of episode sources. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L210-L214)*)\
output:
```js
lol jk. it doesnt work yet :).
```

### fetchEpisodeServers

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                                                   |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| episodeId | `string` | take an episode id or url as a parameter. (*episode id or episode url can be found in the anime info object*) |

```ts
nineanime.fetchEpisodeServers("155250").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of episode servers. (*[`Promise<IEpisodeServer[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L54-L57)*)\
output:
```js
[
  {
    name: 'vidstream',
    url: 'https://9anime.id/ajax/server/1080419?vrf=TYFtBg99w'
  },
  {
    name: 'mycloud',
    url: 'https://9anime.id/ajax/server/1080418?vrf=TYFtBg99g'
  },
  {
    name: 'filemoon',
    url: 'https://9anime.id/ajax/server/1219176?vrf=TYN2vR07%2BA'
  },
  {
    name: 'streamtape',
    url: 'https://9anime.id/ajax/server/1080423?vrf=TYFtBg%2BQ'
  },
  {
    name: 'mp4upload',
    url: 'https://9anime.id/ajax/server/1080422?vrf=TYFtBg%2BA'
  }
]
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/anime.md#">back to anime providers list</a>)</p>
