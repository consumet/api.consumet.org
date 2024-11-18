<h1>AnimeFox</h1>

```ts
const animefox = new ANIME.AnimeFox();
```

<h2>Methods</h2>

- [search](#search)
- [fetchAnimeInfo](#fetchanimeinfo)
- [fetchEpisodeSources](#fetchepisodesources)
- [fetchRecentEpisodes](#fetchrecentepisodes)

### fetchRecentEpisodes

<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| page (optional) | `number` | page number (default 1) |

```ts
animefox.fetchRecentEpisodes().then(data => {
  console.log(data);
})
```


```js
{
    currentPage: 1,
    hasNextPage: true,
    results: [
        {
          id: 'kinsou-no-vermeil-gakeppuchi-majutsushi-wa-saikyou-no-yakusai-to-mahou-sekai-wo-tsukisusumu-episode-6',
          image: 'https://cdn.animefox.tv/cover/kinsou-no-vermeil-gakeppuchi-majutsushi-wa-saikyou-no-yakusai-to-mahou-sekai-wo-tsukisusumu.png',
          title: 'Kinsou no Vermeil: Gakeppuchi Majutsushi wa Saikyou no Yakusai to Mahou Sekai wo Tsukisusumu',
          url: 'https://animefox.tv/watch/kinsou-no-vermeil-gakeppuchi-majutsushi-wa-saikyou-no-yakusai-to-mahou-sekai-wo-tsukisusumu-episode-6!',
          episode: 6
        },
        {
          id: 'overlord-iv-episode-6',
          image: 'https://cdn.animefox.tv/cover/overlord-iv.png',
          title: 'Overlord IV',
          url: 'https://animefox.tv/watch/overlord-iv-episode-6!',
          episode: 6
        },
        {
          id: 'sekai-no-owari-ni-shiba-inu-to-episode-5',
          image: 'https://cdn.animefox.tv/cover/sekai-no-owari-ni-shiba-inu-to.png',
          title: 'Sekai no Owari ni Shiba Inu to',
          url: 'https://animefox.tv/watch/sekai-no-owari-ni-shiba-inu-to-episode-5!',
          episode: 5
        },
    {...},
    ...
    ]
}
```

### search


<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| query     | `string` | query to search for. (*In this case, We're searching for `Overlord IV`*) |

```ts
animefox.search("Overlord IV").then(data => {
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
        id: 'overlord-iv',
        title: 'Overlord IV',
        type: 'Overlord IV',
        image: 'Summer 2022 ',
        url: 'https://animefox.tv/anime/overlord-iv',
        episode: 6
    },
    {
        id: 'overlord-iv-dub',
        title: 'Overlord IV (Dub)',
        type: 'Overlord IV (Dub)',
        image: 'TV Series',
        url: 'https://animefox.tv/anime/overlord-iv-dub',
        episode: 3
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
animefox.fetchAnimeInfo("overlord-iv").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes). (*[`Promise<IAnimeInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L28-L42)*)\
output:
```js
{
    id: 'overlord-iv',
    title: 'Overlord IV',
    image: 'https://cdn.animefox.tv/cover/overlord-iv.png',
    description: 'Fourth season of Overlord.',
    type: 'Summer 2022',
    releaseYear: '2022',
    status: 'Ongoing',
    totalEpisodes: 6,
    url: 'https://animefox.tv/overlord-iv',
      episodes: [
        {
          id: 'overlord-iv-episode-1',
          number: 1,
          title: 'Overlord IV Episode 1',
          url: 'https://animefox.tv/watch/overlord-iv-episode-1'
        },
        {
          id: 'overlord-iv-episode-2',
          number: 2,
          title: 'Overlord IV Episode 2',
          url: 'https://animefox.tv/watch/overlord-iv-episode-2'
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


In this example, we're getting the sources for the first episode of Overlord IV.
```ts
animefox.fetchEpisodeSources("overlord-iv").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of episode sources. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L210-L214)*)\
output:
```js
{
    sources: [
    {
        url: 'https://wwwx20.gogocdn.stream/videos/hls/NbM2m1QH_oxhhOUt6gLkSg/1660076576/188769/ca09dc1ce88568467994ea8e756c4493/ep.1.1657688625.m3u8',
        isM3U8: true
    },
    {
        url: 'https://wwwx20.gogocdn.stream/videos/hls/NbM2m1QH_oxhhOUt6gLkSg/1660076576/188769/ca09dc1ce88568467994ea8e756c4493/ep.1.1657688625.m3u8',
        isM3U8: true
    }
    ]
}
```

Make sure to check the `headers` property of the returned object. It contains the referer header, which might be needed to bypass the 403 error and allow you to stream the video without any issues.

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/anime.md#">back to anime providers list</a>)</p>
