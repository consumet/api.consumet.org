<h1>Anify</h1>

```ts
const anify = new ANIME.Anify();
```

<h2>Methods</h2>

- [search](#search)
- [fetchAnimeInfo](#fetchanimeinfo)
- [fetchEpisodeSources](#fetchepisodesources)

### search
> Note: This method is a subclass of the [`BaseParser`](https://github.com/consumet/extensions/blob/master/src/models/base-parser.ts) class. meaning it is available across most categories.


<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| query     | `string` | query to search for. (*In this case, We're searching for `Overlord IV`*) |
| page      | `number` | page number to search for.                                               |
| perPage   | `number` | number of results per page.                                              |

```ts
anify.search("Overlord IV").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  results: [
    {
      id: '133844',
      anilistId: 133844,
      malId: 48895,
      title: 'Overlord IV',
      image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx133844-E32FjKZ0XxEs.jpg',
      cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/133844-uIaUmh5aJX3M.jpg',
      releaseDate: 2022,
      description: 'The fourth season of <i>Overlord</i>.',
      genres: [ 'Action', 'Fantasy', 'Adventure' ],
      rating: 8,
      status: 'RELEASING',
      mappings: [
        {
          id: "/watch/overlord-iv.r77y",
          providerId: "9anime",
          providerType: "ANIME",
          similarity: 1
        },
        {
          id: "48895",
          providerId: "mal",
          providerType: "META",
          similarity: 1
        }
      ]
    },
    {...},
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
anify.fetchAnimeInfo("133844").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes). (*[`Promise<IAnimeInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L28-L42)*)\
output:
```js
{
  id: '133844',
  anilistId: 133844,
  malId: 48895,
  title: 'Overlord IV',
  image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx133844-E32FjKZ0XxEs.jpg',
  cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/133844-uIaUmh5aJX3M.jpg',
  releaseDate: 2022,
  description: 'The fourth season of <i>Overlord</i>.',
  genres: [ 'Action', 'Fantasy', 'Adventure' ],
  rating: 8,
  status: 'RELEASING',
  mappings: [
    {
      id: "/watch/overlord-iv.r77y",
      providerId: "9anime",
      providerType: "ANIME",
      similarity: 1
    },
    {
      id: "48895",
      providerId: "mal",
      providerType: "META",
      similarity: 1
    }
  ],
  episodes: [
   {
      id: '/overlord-iv-episode-6',
      number: 6,
      title: 'The Impending Crisis',
      isFiller: false,
      description: null,
      image: null,
      rating: null
    },
    {
      id: '/overlord-iv-episode-5',
      number: 5,
      title: 'In Pursuit of the Land of Dwarves',
      isFiller: false,
      description: null,
      image: null,
      rating: null
    },
    {...},
    ...
  ]
}
```

### fetchEpisodeSources

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                           |
| --------- | -------- | ------------------------------------------------------------------------------------- |
| episodeId | `string` | takes episode id as a parameter. (*episode id can be found in the anime info object*) |
| episodeNumber | `number` | takes episode number as a parameter. (*episode number can be found in the anime info object*) |
| id | `string` | takes anime ID as a parameter. (*anime id can be found in the anime search results or anime info object*) |


In this example, we're getting the sources for the first episode of Overlord IV.
```ts
anify.fetchEpisodeSources("/overlord-iv-episode-5", 11, "133844").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of episode sources. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L210-L214)*)\
output:
```js
{
  headers: {
    Referer: 'https://goload.io/streaming.php?id=MTkwMzEy&title=Overlord+IV+Episode+6'
  },
  sources: [
    {
      url: 'https://www050.vipanicdn.net/streamhls/42f4d05521ce0b276e0d779493c16837/ep.11.1697533391.360.m3u8',
      quality: '360p'
    }
  ],
  subtitles: [],
  audio: [],
  intro: { start: 0, end: 0 },
  outro: { start: 0, end: 0 }
}
```

Make sure to check the `headers` property of the returned object. It contains the referer header, which is needed to bypass the 403 error and allow you to stream the video without any issues.

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/anime.md#">back to anime providers list</a>)</p>
