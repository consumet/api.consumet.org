<h1>Anime Saturn</h1>

```ts
const animesaturn = new ANIME.AnimeSaturn();
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
| query     | `string` | query to search for. (*In this case, We're searching for `Tokyo Revengers`*) |

```ts
animesaturn.search("Tokyo Revengers").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
    hasNextPage: false,
    results: [
        {
            id: 'Tokyo-Revengers-aaaaaa',
            title: 'Tokyo Revengers',
            image: 'https://cdn.animesaturn.tv/static/images/copertine/4af2d1048aeb86aeb9b585f3619275601626143497_full.jpg',
            url: 'https://www.animesaturn.tv/anime/Tokyo-Revengers-aaaaaa'
        },
        {
            id: 'Tokyo-Revengers-ITA-aa',
            title: 'Tokyo Revengers (ITA)',
            image: 'https://cdn.animesaturn.tv/static/images/copertine/4af2d1048aeb86aeb9b585f3619275601626143497_full.jpg',
            url: 'https://www.animesaturn.tv/anime/Tokyo-Revengers-ITA-aa'
        },
        {
            id: 'Tokyo-Revengers-Seiya-Kessen-hen-aa',
            title: 'Tokyo Revengers: Seiya Kessen-hen',
            image: 'https://cdn.animesaturn.tv/static/images/copertine/26084_1_1.png',
            url: 'https://www.animesaturn.tv/anime/Tokyo-Revengers-Seiya-Kessen-hen-aa'
        }
    ]
}
```

### fetchAnimeInfo

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                                               |
| --------- | -------- | --------------------------------------------------------------------------------------------------------- |
| id        | `string` | takes anime id as a parameter. (*anime id can be found in the anime search results or anime info object*) |


```ts
animesaturn.fetchAnimeInfo("Tokyo-Revengers-aaaaaa").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes). (*[`Promise<IAnimeInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L28-L42)*)\
output:
```js
{
    id: 'Tokyo-Revengers-aaaaaa',
    title: 'Tokyo Revengers Sub ITA',
    genres: [ 'Azione', 'Drammatico', 'Scolastico', 'Shounen', 'Soprannaturale' ],
    image: 'https://cdn.animesaturn.tv/static/images/locandine/Zkczy.png',
    cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/120120-oRfDsJjrpoQ4.jpg',
    description: '',
    episodes: [
        { number: 1, id: 'Tokyo-Revengers-ep-1' },
        { number: 2, id: 'Tokyo-Revengers-ep-2' },
        { number: 3, id: 'Tokyo-Revengers-ep-3' },
        { number: 4, id: 'Tokyo-Revengers-ep-4' },
        { number: 5, id: 'Tokyo-Revengers-ep-5' },
        { number: 6, id: 'Tokyo-Revengers-ep-6' },
        { number: 7, id: 'Tokyo-Revengers-ep-7' },
        { number: 8, id: 'Tokyo-Revengers-ep-8' },
        { number: 9, id: 'Tokyo-Revengers-ep-9' },
        { number: 10, id: 'Tokyo-Revengers-ep-10' },
        { number: 11, id: 'Tokyo-Revengers-ep-11' },
        { number: 12, id: 'Tokyo-Revengers-ep-12' },
        { number: 13, id: 'Tokyo-Revengers-ep-13' },
        { number: 14, id: 'Tokyo-Revengers-ep-14' },
        { number: 15, id: 'Tokyo-Revengers-ep-15' },
        { number: 16, id: 'Tokyo-Revengers-ep-16' },
        { number: 17, id: 'Tokyo-Revengers-ep-17' },
        { number: 18, id: 'Tokyo-Revengers-ep-18' },
        { number: 19, id: 'Tokyo-Revengers-ep-19' },
        { number: 20, id: 'Tokyo-Revengers-ep-20' },
        { number: 21, id: 'Tokyo-Revengers-ep-21' },
        { number: 22, id: 'Tokyo-Revengers-ep-22' },
        { number: 23, id: 'Tokyo-Revengers-ep-23' },
        { number: 24, id: 'Tokyo-Revengers-aszb-ep-24' }
    ]
}
```

### fetchEpisodeSources

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                           |
| --------- | -------- | ------------------------------------------------------------------------------------- |
| episodeId | `string` | takes episode id as a parameter. (*episode id can be found in the anime info object*) |


In this example, we're getting the sources for the first episode of Tokyo Revengers.
```ts
animesaturn.fetchEpisodeSources("Tokyo-Revengers-ep-1").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of episode sources (the second sources url is recommended as more stable). (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L210-L214)*)\
output:
```js
{
    headers: {},
    subtitles: [
        {
            url: 'https://www.saturnspeed75.org/DDL/ANIME/TokyoRevengers/01/subtitles.vtt',
            lang: 'Spanish'
        }
    ],
    sources: [
        {
            url: 'https://www.saturnspeed75.org/DDL/ANIME/TokyoRevengers/01/playlist.m3u8',
            isM3U8: true
        },
        {
            url: 'https://streamtape.com/get_video?id=0ZamyRrDpBFbX01&expires=1694799037&ip=DxWsE0InDS9X&token=1Ut-RohY4oCE',
            isM3U8: false
        }
    ]
}
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/anime.md#">back to anime providers list</a>)</p>
