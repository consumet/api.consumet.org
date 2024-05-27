<h1>ViewAsian</h1>

```ts
const viewAsian = new MOVIES.ViewAsian();
```

<h2>Methods</h2>

- [search](#search)
- [fetchMediaInfo](#fetchmediainfo)
- [fetchEpisodeSources](#fetchepisodesources)

### search
> Note: This method is a subclass of the [`BaseParser`](https://github.com/consumet/extensions/blob/master/src/models/base-parser.ts) class. meaning it is available across most categories.


<h4>Parameters</h4>

| Parameter       | Type     | Description                                                                                                                                |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| query           | `string` | query to search for. (*In this case, We're searching for `Vincenzo`*) P.S: `vincenzo` is a really good korean drama i highly recommend it. |
| page (optional) | `number` | page number (default: 1)                                                                                                                   |

```ts
viewAsian.search("Vincenzo").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of movies/tv series. (*[`Promise<ISearch<IMovieResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L233-L241)*)\
output:
```js
{
    currentPage: 1,
    hasNextPage: false,
    results: [
        {
            id: 'drama/vincenzo',
            title: 'Vincenzo (2021)',
            url: 'https://viewasian.co/drama/vincenzo',
            image: 'https://imagecdn.me/cover/vincenzo.png',
            releaseDate: undefined
        }
    ]
}
```

### fetchMediaInfo

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                                                                     |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| mediaId   | `string` | takes media id or url as a parameter. (*media id or url can be found in the media search results as shown on the above method*) |

```ts
viewAsian.fetchMediaInfo("drama/vincenzo").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes). (*[`Promise<IMovieInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L243-L254)*)\
output:
```js
{
    id: 'drama/vincenzo',
    title: 'Vincenzo (2021)',
    otherNames: [ '빈센조', 'Binsenjo' ],
    description: 'At the age of 8, Park Ju Hyeong is adopted and sent off to Italy.  Now an adult, he is known as Vincenzo Casano.\n' +
        'He is a Mafia lawyer and consigliere. ( Advisor and dispute reconciliation expert.) Warring factions within the Mafia force him to flee to South Korea. There he falls in love with Hong Cha Young. a lawyer who will do anything to win a case. Vincenzo manages to achieve some social justice there, and in his own way.\n' +
        'Jang Jun Woo is an intelligent and hardworking first-year law intern at the firm, who is polite and sincere. Despite his boyish charm and good looks, Jun Woo can come a cross as awkward and naive. Prone to making mistakes, he is often trouble at work.',
    genre: [
        'Comedy',   'Crime',
        'Drama',    'Law',
        'Mafia',    'Romance',
        'Suspense'
    ],
    director: 'Kim Hee Won [김희원]',
    country: 'Korean',
    releaseDate: '2021',
    episodes: [
        {
            id: '/watch/vincenzo/watching.html$episode$20',
            title: 'Episode 20',
            episode: '20',
            url: 'https://viewasian.co/watch/vincenzo/watching.html?ep=20'
        },
        {...},
    ]
}
```

### fetchEpisodeSources

<h4>Parameters</h4>

| Parameter         | Type                                                                                                 | Description                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| episodeId         | `string`                                                                                             | takes episode id as a parameter. (*episode id can be found in the media info object*)                                                                      |
| mediaId           | `string`                                                                                             | takes media id as a parameter. (*media id can be found in the media info object*)                                                                          |
| server (optional) | [`StreamingServers`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L76-L82) | takes server enum as a parameter. *default: [`StreamingServers.AsianLoad`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L139-L152)* |


```ts
viewAsian.fetchEpisodeSources("/watch/vincenzo/watching.html$episode$20").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of episode sources and subtitles. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L295-L300)*)\
output:
```js
{
    sources: [
        {
            url: 'https://hlsx02.dracache.com/newvideos/newhls/sYIDXKabb521QT8JdzkPpg/1668712072/248711_194.35.232.200/db287e9dc37d8c5b67c2498e3ef07c5a/ep.20.v0.1657641277.m3u8',
            isM3U8: true
        },
        {
            url: 'https://hlsx02.dracache.com/newvideos/newhls/sYIDXKabb521QT8JdzkPpg/1668712072/248711_194.35.232.200/db287e9dc37d8c5b67c2498e3ef07c5a/ep.20.v0.1657641277.m3u8',
            isM3U8: true
        }
    ],
    subtitles: [
        {
            url: 'https://asiancdn.com/images/db287e9dc37d8c5b67c2498e3ef07c5a/20.vtt',
            lang: 'Default (maybe)'
        }
    ]
}
```
<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/movies.md#">back to movie providers list</a>)</p>