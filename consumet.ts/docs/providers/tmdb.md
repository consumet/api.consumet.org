<h1>TMDB</h1>
This is a custom provider that maps an movie provider (like flixhq) to TMDB.

`TMDB` class takes a [`MovieParser`](https://github.com/consumet/extensions/blob/master/src/models/movie-parser.ts) object as a parameter **(optional)**. This object is used to parse the anime episodes from the provider, then mapped to TMDB.

```ts
const tmdb = new META.TMDB();
```

<h2>Methods</h2>

- [fetchTrending](#fetchtrending)
- [search](#search)
- [fetchMediaInfo](#fetchmediainfo)
- [fetchEpisodeSources](#fetchepisodesources)

### fetchTrending

<h4>Parameters</h4>

| Parameter             | Type     | Description                                                                         |
| --------------------- | -------- | ----------------------------------------------------------------------------------- |
| type                  | `string` | type of trending option we want('movie', 'tv series', 'people' or 'all')            |
| timePeriod (optional) | `string` | the duration of trending we want ('day' or 'week')                                  |
| page (optional)       | `number` | page number to search for.                                                          |

```ts
tmdb.fetchTrending("the flash").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<(IMovieResult | IAnimeResult | IPeopleResult)[]>>`](https://github.com/consumet/consumet.ts/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
{
  currentPage: 1,
  results: [
        {
          id: 848326,
          title: 'Rebel Moon - Part One: A Child of Fire',
          image: 'https://image.tmdb.org/t/p/original/ui4DrH1cKk2vkHshcUcGt2lKxCm.jpg',
          type: 'Movie',
          rating: 6.457,
          releaseDate: '2023'
        },
        {
          id: 572802,
          title: 'Aquaman and the Lost Kingdom',
          image: 'https://image.tmdb.org/t/p/original/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg',
          type: 'Movie',
          rating: 6.551,
          releaseDate: '2023'
        },
        {
          id: 930564,
          title: 'Saltburn',
          image: 'https://image.tmdb.org/t/p/original/qjhahNLSZ705B5JP92YMEYPocPz.jpg',
          type: 'Movie',
          rating: 7.2,
          releaseDate: '2023'
        },
        {...}
        ...
  ]
}
```

### search

<h4>Parameters</h4>

| Parameter            | Type     | Description                                                                         |
| -------------------- | -------- | ----------------------------------------------------------------------------------- |
| query                | `string` | query to search for. (*In this case, We're searching for `Classroom of the elite`*) |
| page (optional)      | `number` | page number to search for.                                                          |

```ts
tmdb.search("the flash").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IMovieResult[]>>`](https://github.com/consumet/consumet.ts/blob/master/src/models/types.ts#L328-L336)*)\
output:
```js
{
  currentPage: 1,
  results: [
    {
      "id": 60735,
      "title": "The Flash",
      "image": "https://image.tmdb.org/t/p/original/lJA2RCMfsWoskqlQhXPSLFQGXEJ.jpg",
      "type": "TV Series",
      "rating": 7.807,
      "releaseDate": "2014"
    },
    {
      "id": 236,
      "title": "The Flash",
      "image": "https://image.tmdb.org/t/p/original/fi1GEdCbyWRDHpyJcB25YYK7fh4.jpg",
      "type": "TV Series",
      "rating": 7.464,
      "releaseDate": "1990"
    },
    {
      "id": 298618,
      "title": "The Flash",
      "image": "https://image.tmdb.org/t/p/original/oduJooXJya3u6wuA6FgljAFCEQp.jpg",
      "type": "Movie",
      "rating": 0,
      "releaseDate": "2023"
    },
    {...}
    ...
  ]
}
```



### fetchMediaInfo

<h4>Parameters</h4>

| Parameter      | Type      | Description                                                                                               |
| -------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| id             | `string`  | takes anime id as a parameter. (*anime id can be found in the anime search results or Movie info object*) |
| type           | `string`  | takes movie or tv as a parameter (*type can be found in the anime search results or Movie info object*)   |


```ts
tmdb.fetchMediaInfo("60735", "tv").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an movie info object (including the episodes). (*[`Promise<IMovieInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L28-L42)*)\
output:
```js
{
  "id": "tv/watch-the-flash-39535",
  "title": "The Flash",
  "image": "https://image.tmdb.org/t/p/original/lJA2RCMfsWoskqlQhXPSLFQGXEJ.jpg",
  "cover": "https://image.tmdb.org/t/p/original/41yaWnIT8AjIHiULHtTbKNzZTjc.jpg",
  "type": "TV Series",
  "rating": 7.807,
  "releaseDate": "2014-10-07",
  "description": "After a particle accelerator causes a freak storm, CSI Investigator Barry Allen is struck by lightning and falls into a coma. Months later he awakens with the power of super speed, granting him the ability to move through Central City like an unseen guardian angel. Though initially excited by his newfound powers, Barry is shocked to discover he is not the only \"meta-human\" who was created in the wake of the accelerator explosion -- and not everyone is using their new powers for good. Barry partners with S.T.A.R. Labs and dedicates his life to protect the innocent. For now, only a few close friends and associates know that Barry is literally the fastest man alive, but it won't be long before the world learns what Barry Allen has become...The Flash.",
  "genres": [
    "Drama",
    "Sci-Fi & Fantasy"
  ],
  "duration": 44,
  "totalEpisodes": 176,
  "totalSeasons": 9,
  "directors": [],
  "writers": [],
  "actors": [
    "Grant Gustin",
    "Candice Patton",
    "Danielle Panabaker",
    "Danielle Nicolet",
    "Kayla Compton",
    "Brandon McKnight",
    "Jon Cor"
  ],
  "trailer": {
    "id": "Mx7xTF8fKz4",
    "site": "YouTube",
    "url": "https://www.youtube.com/watch?v=Mx7xTF8fKz4"
  },
  "similar": [
    {
      "id": 12971,
      "title": "Dragon Ball Z",
      "image": "https://image.tmdb.org/t/p/original/jB9l4mp0bzBgzE5y4tvBH6AMeMk.jpg",
      "type": "TV Series",
      "rating": 8.311,
      "releaseDate": "1989-04-26"
    },
    {
      "id": 13023,
      "title": "El ChapulÃ­n Colorado",
      "image": "https://image.tmdb.org/t/p/original/qF8NDpVBSTDhdLlEjVAhNhfqB8K.jpg",
      "type": "TV Series",
      "rating": 7.932,
      "releaseDate": "1973-04-11"
    },
    {...}
  ],
  "seasons": [
    {
      "season": 1,
      "image": "https://image.tmdb.org/t/p/original/kHyXbcb2JGWIe1fyZa6PqBwlNJN.jpg",
      "episodes": [
        {
          "id": "2899",
          "title": "Pilot",
          "episode": 1,
          "season": 1,
          "releaseDate": "2014-10-07",
          "overview": "Barry discovers his powers and puts them to the test, only when he finds its no longer a test but the real thing when he encounters a certain someone.",
          "url": "https://flixhq.to/ajax/v2/episode/servers/2899",
          "img": "https://image.tmdb.org/t/p/original/piyGyhwbqqyIxcyuZXYmDUWSylb.jpg"
        },
        {
          "id": "2900",
          "title": "Fastest Man Alive",
          "episode": 2,
          "season": 1,
          "releaseDate": "2014-10-14",
          "overview": "Barry changes into the Flash when six gunmen storm a university event honoring a scientist, but his heroics don't match up to his expectations. Meanwhile, Iris becomes even more intrigued by the \"red streak.\"",
          "url": "https://flixhq.to/ajax/v2/episode/servers/2900",
          "img": "https://image.tmdb.org/t/p/original/mUgakZLNaMIjG63pz7VeJXJPMu4.jpg"
        },
        {...}
      ]
    }
  ]
}
```

### fetchEpisodeSources

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                                            |
| --------- | -------- | ------------------------------------------------------------------------------------------------------ |
| episodeId | `string` | takes episode id as a parameter. (*episode id can be found in the Movie info object*)                  |
| MediaId   | `string` | takes media id as a parameter. (*media id can be found in the Movie info seasons episodes object*)     |



```ts
tmdb.fetchEpisodeSources("2899", "tv/watch-the-flash-39535").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of episode sources. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L210-L214)*)\
output:
```js
{
  "headers": {
    "Referer": "https://dokicloud.one/embed-4/hkEpFgTBEN9G?z="
  },
  "sources": [
    {
      "url": "https://t-eu-2.magnewscontent.org/_v9/f1f4fc0acbf8baef134d6ba2f0e42815c4f3e58a6648e8f2b046410b81510d90e399b927c3135c88b026299880c0ca317d1bb065d7ec76af49cb38620a075678f1e005f1336207700b67e48f4f466b546bce3cdd11ddd1775f99b45a46311887eb1a74d2403405bd85443785566b85ab8394f8191c72a97b3dd951a30bc02479/1080/index.m3u8",
      "quality": "1080",
      "isM3U8": true
    },
    {
      "url": "https://t-eu-2.magnewscontent.org/_v9/f1f4fc0acbf8baef134d6ba2f0e42815c4f3e58a6648e8f2b046410b81510d90e399b927c3135c88b026299880c0ca317d1bb065d7ec76af49cb38620a075678f1e005f1336207700b67e48f4f466b546bce3cdd11ddd1775f99b45a46311887eb1a74d2403405bd85443785566b85ab8394f8191c72a97b3dd951a30bc02479/720/index.m3u8",
      "quality": "720",
      "isM3U8": true
    },
    {
      "url": "https://t-eu-2.magnewscontent.org/_v9/f1f4fc0acbf8baef134d6ba2f0e42815c4f3e58a6648e8f2b046410b81510d90e399b927c3135c88b026299880c0ca317d1bb065d7ec76af49cb38620a075678f1e005f1336207700b67e48f4f466b546bce3cdd11ddd1775f99b45a46311887eb1a74d2403405bd85443785566b85ab8394f8191c72a97b3dd951a30bc02479/360/index.m3u8",
      "quality": "360",
      "isM3U8": true
    },
    {
      "url": "https://t-eu-2.magnewscontent.org/_v9/f1f4fc0acbf8baef134d6ba2f0e42815c4f3e58a6648e8f2b046410b81510d90e399b927c3135c88b026299880c0ca317d1bb065d7ec76af49cb38620a075678f1e005f1336207700b67e48f4f466b546bce3cdd11ddd1775f99b45a46311887eb1a74d2403405bd85443785566b85ab8394f8191c72a97b3dd951a30bc02479/playlist.m3u8",
      "isM3U8": true,
      "quality": "auto"
    }
  ],
  "subtitles": [
    {
      "url": "https://cc.2cdns.com/4a/02/4a027259c5bd865a75e756cc09f54cbb/4a027259c5bd865a75e756cc09f54cbb.vtt",
      "lang": "English"
    },
    {
      "url": "https://cc.2cdns.com/48/66/4866edc69de4b4fd17c89b59efa726a5/4866edc69de4b4fd17c89b59efa726a5.vtt",
      "lang": "Portuguese"
    },
    {
      "url": "https://prev.2cdns.com/_m_preview/15/1568bec9a3267e03fcca2a1fb86b3b59/thumbnails/sprite.vtt",
      "lang": "Default (maybe)"
    }
  ]
}
```

Make sure to check the `headers` property of the returned object. It contains the referer header, which is needed to bypass the 403 error and allow you to stream the video without any issues.

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/meta.md#">back to meta providers list</a>)</p>
