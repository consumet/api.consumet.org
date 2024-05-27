<h1>Zoro</h1>

```ts
const zoro = new ANIME.Zoro();
```

<h2>Methods</h2>

- [search](#search)
- [fetchAnimeInfo](#fetchanimeinfo)
- [fetchEpisodeSources](#fetchepisodesources)
- [fetchTopAiring](#fetchTopAiring)
- [fetchMostPopular](#fetchMostPopular)
- [fetchMostFavorite](#fetchMostFavorite)
- [fetchLatestCompleted](#fetchLatestCompleted)
- [fetchRecentlyUpdated](#fetchRecentlyUpdated)
- [fetchRecentlyAdded](#fetchRecentlyAdded)
- [fetchTopUpcoming](#fetchTopUpcoming)
- [fetchSchedule](#fetchSchedule)
- [fetchStudio](#fetchStudio)
- [fetchSpotlight](#fetchSpotlight)
- [fetchSearchSuggestions] (#fetchSearchSuggestions)

### search
> Note: This method is a subclass of the [`BaseParser`](https://github.com/consumet/extensions/blob/master/src/models/base-parser.ts) class. meaning it is available across most categories.


<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| query     | `string` | query to search for. (*In this case, We're searching for `Spy x Family`*) |

```ts
zoro.search("spy x family").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  totalPages: 3,
  results: [
    {
      id: 'spy-x-family-17977',
      title: 'Spy x Family',                           url: 'https://aniwatch.to/spy-x-family-17977?ref=search',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/88/bd/88bd17534dc4884f23027035d23d74e5/88bd17534dc4884f23027035d23d74e5.jpg',
      type: 'TV',
      duration: '24m',
      japaneseTitle: 'Spy x Family',
      nsfw: false,
      sub: 12,
      dub: 12,
      episodes: 12
    },
    {
      id: 'spy-x-family-part-2-18152',                title: 'Spy x Family, Part 2',
      url: 'https://aniwatch.to/spy-x-family-part-2-18152?ref=search',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/53/d2/53d283223e562b22a14023d8dc1e934d/53d283223e562b22a14023d8dc1e934d.jpg',
      type: 'TV',
      duration: '23m',                                 japaneseTitle: 'Spy x Family Part 2',
      nsfw: false,
      sub: 13,
      dub: 13,
      episodes: 13
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
zoro.fetchAnimeInfo("overlord-iv-18075").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes and optionally MAL and Anilist ID ). (*[`Promise<IAnimeInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L28-L42)*)\
output:
```js
{
  id: 'overlord-iv-18075',
  title: 'Overlord IV',
  malID: 48895,
  alID: 133844,
  image: 'https://img.zorores.com/_r/300x400/100/ef/1d/ef1d1028cf6c177587805651b78282a6/ef1d1028cf6c177587805651b78282a6.jpg',
  description: 'Fourth season of Overlord',
  type: 'TV',
  url: 'https://zoro.to/overlord-iv-18075',
  totalEpisodes: 3,
  episodes: [
    {
      id: 'overlord-iv-18075$episode$92599',
      number: 1,
      title: 'Sorcerous Nation of Ainz Ooal Gown',
      isFiller: false,
      url: 'https://zoro.to/watch/overlord-iv-18075?ep=92599'
    },
    {
      id: 'overlord-iv-18075$episode$92769',
      number: 2,
      title: 'Re-Estize Kingdom',
      isFiller: false,
      url: 'https://zoro.to/watch/overlord-iv-18075?ep=92769'
    },
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
zoro.fetchEpisodeSources("overlord-iv-18075$episode$92599").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of episode sources. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L210-L214)*)\
output:
```js
{
  headers: { Referer: 'https://rapid-cloud.ru/embed-6/hMN2fYuGi1E2?z=' },
  intro: {
    start: 0,
    end: 100
  }
  sources: [
    {
      url: 'https://c-an-ca3.betterstream.cc:2223/v2-hls-playback/584bca0a36f1cfe0153bc80d79d62f9171c193441d424b2804000153234bb744f6eb7197bd91842408660ab8516c67f5ad565acd0d18e9b565c6abf2b5c0e55879ca70bef239d78711bf0845ddb6005baf5a5e957a17efc7bb6f1b4f3a87fb3723cfc56a1330960ec99ce338d86d49211bc6e8c2830d50842034ed99335c654529d2b0ca1e19045357a6b01876ae12ea313473387cb8c5272b37c7ba8a2bbc3b185c0cc72517ee0237ce673914ac3e54/index-f1-v1-a1.m3u8',
      quality: '1080p',
      isM3U8: true
    },
    {
      url: 'https://c-an-ca3.betterstream.cc:2223/v2-hls-playback/584bca0a36f1cfe0153bc80d79d62f9171c193441d424b2804000153234bb744f6eb7197bd91842408660ab8516c67f5ad565acd0d18e9b565c6abf2b5c0e55879ca70bef239d78711bf0845ddb6005baf5a5e957a17efc7bb6f1b4f3a87fb3723cfc56a1330960ec99ce338d86d49211bc6e8c2830d50842034ed99335c654529d2b0ca1e19045357a6b01876ae12ea313473387cb8c5272b37c7ba8a2bbc3b185c0cc72517ee0237ce673914ac3e54/index-f2-v1-a1.m3u8',
      quality: '720p',
      isM3U8: true
    },
    {
      url: 'https://c-an-ca3.betterstream.cc:2223/v2-hls-playback/584bca0a36f1cfe0153bc80d79d62f9171c193441d424b2804000153234bb744f6eb7197bd91842408660ab8516c67f5ad565acd0d18e9b565c6abf2b5c0e55879ca70bef239d78711bf0845ddb6005baf5a5e957a17efc7bb6f1b4f3a87fb3723cfc56a1330960ec99ce338d86d49211bc6e8c2830d50842034ed99335c654529d2b0ca1e19045357a6b01876ae12ea313473387cb8c5272b37c7ba8a2bbc3b185c0cc72517ee0237ce673914ac3e54/index-f3-v1-a1.m3u8',
      quality: '360p',
      isM3U8: true
    }
  ],
  subtitles: [
    {
      url: 'https://cc.zorores.com/5f/b4/5fb4481163961694ef0dc661a1bf51d7/eng-2.vtt',
      lang: 'English'
    },
    {
      url: 'https://cc.zorores.com/5f/b4/5fb4481163961694ef0dc661a1bf51d7/por-3.vtt',
      lang: 'Portuguese - Portuguese(Brazil)'
    },
    {
      url: 'https://cc.zorores.com/5f/b4/5fb4481163961694ef0dc661a1bf51d7/rus-5.vtt',
      lang: 'Russian'
    },
    {
      url: 'https://cc.zorores.com/5f/b4/5fb4481163961694ef0dc661a1bf51d7/spa-4.vtt',
      lang: 'Spanish - Spanish(Latin_America)'
    },
    {
      url: 'https://preview.zorores.com/53/531eb74affebbec2613a6ba0883754f3/thumbnails/sprite.vtt',
      lang: 'Default (maybe)'
    }
  ]
}
```

### fetchTopAiring

<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| page (optional) | `number` | page number (default 1) |

```ts
zoro.fetchTopAiring().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{                                                        currentPage: 1,
  hasNextPage: true,
  totalPages: 9,
  results: [
    {
      id: 'one-piece-100',
      title: 'One Piece',
      url: 'https://aniwatch.to/one-piece-100',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/54/90/5490cb32786d4f7fef0f40d7266df532/5490cb32786d4f7fef0f40d7266df532.jpg',
      type: 'TV',
      duration: '24m',
      japaneseTitle: 'One Piece',
      nsfw: false,
      sub: 1089,
      dub: 1048,
      episodes: 0
    },
    {
      id: 'attack-on-titan-the-final-season-part-3-1839',
      title: 'Attack on Titan: The Final Season Part 3',
      url: 'https://aniwatch.to/attack-on-titan-the-final-season-part-3-18329',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/54/d3/54d3f59bcc7caf1539c701eb0a064ec9/54d3f59bcc7caf1539c701eb0a064ec9.png',
      type: 'TV',
      duration: '61m',
      japaneseTitle: 'Shingeki no Kyojin: The Final Season - Kanketsu-hen',
      nsfw: true,
      sub: 2,
      dub: 2,
      episodes: 0
    },
    {...}
    ...
  ]
}
```

### fetchMostPopular

<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| page (optional) | `number` | page number (default 1) |

```ts
zoro.fetchMostPopular().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{                                                        currentPage: 1,
  hasNextPage: true,
  totalPages: 50,
  results: [
    {
      id: 'one-piece-100',
      title: 'One Piece',
      url: 'https://aniwatch.to/one-piece-100',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/54/90/5490cb32786d4f7fef0f40d7266df532/5490cb32786d4f7fef0f40d7266df532.jpg',
      type: 'TV',
      duration: '24m',
      japaneseTitle: 'One Piece',
      nsfw: false,
      sub: 1089,
      dub: 1048,
      episodes: 0
    },
    {
      id: 'naruto-shippuden-355',
      title: 'Naruto: Shippuden',
      url: 'https://aniwatch.to/naruto-shippuden-355',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/9c/bc/9cbcf87f54194742e7686119089478f8/9cbcf87f54194742e7686119089478f8.jpg',
      type: 'TV',
      duration: '23m',
      japaneseTitle: 'Naruto: Shippuuden',
      nsfw: false,
      sub: 500,
      dub: 500,
      episodes: 500
    },
    {...}
    ...
  ]
}
```

### fetchMostFavorite

<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| page (optional) | `number` | page number (default 1) |

```ts
zoro.fetchMostFavorite().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  totalPages: 166,
  results: [
    {
      id: 'one-piece-100',
      title: 'One Piece',
      url: 'https://aniwatch.to/one-piece-100',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/54/90/5490cb32786d4f7fef0f40d7266df532/5490cb32786d4f7fef0f40d7266df532.jpg',
      type: 'TV',
      duration: '24m',
      japaneseTitle: 'One Piece',
      nsfw: false,
      sub: 1089,
      dub: 1048,
      episodes: 0
    },
    {
      id: 'chainsaw-man-17406',
      title: 'Chainsaw Man',
      url: 'https://aniwatch.to/chainsaw-man-17406',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/b3/da/b3da1326e07269ddd8d73475c5dabf2c/b3da1326e07269ddd8d73475c5dabf2c.jpg',
      type: 'TV',
      duration: '24m',
      japaneseTitle: 'Chainsaw Man',
      nsfw: true,
      sub: 12,
      dub: 12,
      episodes: 12
    },
    {...}
    ...
  ]
}
```

### fetchLatestCompleted

<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| page (optional) | `number` | page number (default 1) |

```ts
zoro.fetchLatestCompleted().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  totalPages: 162,
  results: [
    {
      id: 'love-flops-18173',
      title: 'Love Flops',
      url: 'https://aniwatch.to/love-flops-18173',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/8c/08/8c08b4fd12e27ac4e1dc4e72af8e9568/8c08b4fd12e27ac4e1dc4e72af8e9568.jpg',
      type: 'TV',
      duration: '24m',
      japaneseTitle: 'Renai Flops',
      nsfw: true,
      sub: 12,
      dub: 7,
      episodes: 12
    },
    {
      id: 'nurarihyon-no-mago-gekitou-dai-futsal-taikai-nuragumi-w-cup-5796',
      title: 'Nurarihyon no Mago: Gekitou Dai Futsal Taikai! Nuragumi W Cup!!',
      url: 'https://aniwatch.to/nurarihyon-no-mago-gekitou-dai-futsal-taikai-nuragumi-w-cup-5796',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/bd/72/bd722d8e64272fb484a7f48e75eb9716/bd722d8e64272fb484a7f48e75eb9716.jpg',
      type: 'Special',
      duration: '13m',
      japaneseTitle: 'Nurarihyon no Mago: Gekitou Dai Futsal Taikai! Nuragumi W Cup!!',
      nsfw: false,
      sub: 1,
      dub: 0,
      episodes: 0
    },
    {...}
    ...
  ]
}
```

### fetchRecentlyUpdated

<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| page (optional) | `number` | page number (default 1) |

```ts
zoro.fetchRecentlyUpdated().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  totalPages: 166,
  results: [
    {
      id: 'pokemon-horizons-the-series-18397',
      title: 'Pokémon Horizons: The Series',
      url: 'https://aniwatch.to/pokemon-horizons-the-series-18397',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/4b/14/4b145f650126e400b69e783e3d6cdd2a/4b145f650126e400b69e783e3d6cdd2a.jpg',
      type: 'TV',
      duration: '24m',
      japaneseTitle: 'Pokemon (2023)',
      nsfw: false,
      sub: 35,
      dub: 0,
      episodes: 0
    },
    {
      id: 'bang-brave-bang-bravern-18733',
      title: 'Bang Brave Bang Bravern',
      url: 'https://aniwatch.to/bang-brave-bang-bravern-18733',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/ad/1d/ad1d79d4c929278f23b91f2e787e5a50/ad1d79d4c929278f23b91f2e787e5a50.jpg',
      type: 'TV',
      duration: '25m',
      japaneseTitle: 'Yuuki Bakuhatsu Bang Bravern',
      nsfw: false,
      sub: 1,
      dub: 0,
      episodes: 0
    },
    {...}
    ...
  ]
}
```

### fetchRecentlyAdded

<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| page (optional) | `number` | page number (default 1) |

```ts
zoro.fetchRecentlyAdded().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  totalPages: 162,
  results: [
    {
      id: 'love-flops-18173',
      title: 'Love Flops',
      url: 'https://aniwatch.to/love-flops-18173',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/8c/08/8c08b4fd12e27ac4e1dc4e72af8e9568/8c08b4fd12e27ac4e1dc4e72af8e9568.jpg',
      type: 'TV',
      duration: '24m',
      japaneseTitle: 'Renai Flops',
      nsfw: true,
      sub: 12,
      dub: 7,
      episodes: 12
    },
    {
      id: 'nurarihyon-no-mago-gekitou-dai-futsal-taikai-nuragumi-w-cup-5796',
      title: 'Nurarihyon no Mago: Gekitou Dai Futsal Taikai! Nuragumi W Cup!!',
      url: 'https://aniwatch.to/nurarihyon-no-mago-gekitou-dai-futsal-taikai-nuragumi-w-cup-5796',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/bd/72/bd722d8e64272fb484a7f48e75eb9716/bd722d8e64272fb484a7f48e75eb9716.jpg',
      type: 'Special',
      duration: '13m',
      japaneseTitle: 'Nurarihyon no Mago: Gekitou Dai Futsal Taikai! Nuragumi W Cup!!',
      nsfw: false,
      sub: 1,
      dub: 0,
      episodes: 0
    },
    {...}
    ...
  ]
}
```

### fetchTopUpcoming

<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| page (optional) | `number` | page number (default 1) |

```ts
zoro.fetchTopUpcoming().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  totalPages: 6,
  results: [
    {
      id: 'bucchigiri-18781',
      title: 'Bucchigiri?!',
      url: 'https://aniwatch.to/bucchigiri-18781',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/72/bf/72bfde46c44a200ff11d82049005d3c8/72bfde46c44a200ff11d82049005d3c8.jpg',
      type: 'TV',
      duration: 'Jan 13, 2024',
      japaneseTitle: 'Bucchigiri?!',
      nsfw: false,
      sub: 0,
      dub: 0,
      episodes: 0
    },
    {
      id: 'dead-dead-demons-dededede-destruction-18925',
      title: 'Dead Dead Demons Dededede Destruction',
      url: 'https://aniwatch.to/dead-dead-demons-dededede-destruction-18925',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/8d/11/8d112670f41684d97015004293a087dc/8d112670f41684d97015004293a087dc.jpg',
      type: 'Movie',
      duration: 'Mar 22, 2024',
      japaneseTitle: 'Dead Dead Demons Dededede Destruction',
      nsfw: false,
      sub: 0,
      dub: 0,
      episodes: 0
    },
    {...}
    ...
  ]
}
```
### fetchSchedule

<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| date    | `string` | Date in format 'YYYY-MM-DD'. Defaults to the current date. |

```ts
zoro.fetchSchedule('2024-03-11').then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  results: [
    {
      id: 'high-card-season-2-18820',
      title: 'High Card Season 2',
      japaneseTitle: 'High Card Season 2',
      url: 'https://hianime.to/high-card-season-2-18820',
      airingEpisode: 'Episode 10',
      airingTime: '07:30'
    },
    {
      id: 'tsukimichi-moonlit-fantasy-season-2-18877',
      title: 'Tsukimichi -Moonlit Fantasy- Season 2',
      japaneseTitle: 'Tsuki ga Michibiku Isekai Douchuu 2nd Season',
      url: 'https://hianime.to/tsukimichi-moonlit-fantasy-season-2-18877',
      airingEpisode: 'Episode 10',
      airingTime: '09:00'
    },
    {
      id: 'the-foolish-angel-dances-with-the-devil-18832',
      title: 'The Foolish Angel Dances with the Devil',
      japaneseTitle: 'Oroka na Tenshi wa Akuma to Odoru',
      url: 'https://hianime.to/the-foolish-angel-dances-with-the-devil-18832',
      airingEpisode: 'Episode 10',
      airingTime: '10:30'
    },
    {
      id: 'synduality-noir-part-2-18754',
      title: 'Synduality: Noir Part 2',
      japaneseTitle: 'Synduality: Noir Part 2',
      url: 'https://hianime.to/synduality-noir-part-2-18754',
      airingEpisode: 'Episode 10',
      airingTime: '10:30'
    },
    {
      id: 'tis-time-for-torture-princess-18778',
      title: 'Tis Time for "Torture," Princess',
      japaneseTitle: 'Himesama "Goumon" no Jikan desu',
      url: 'https://hianime.to/tis-time-for-torture-princess-18778',
      airingEpisode: 'Episode 10',
      airingTime: '11:30'
    },
    {
      id: 'hokkaido-gals-are-super-adorable-18853',
      title: 'Hokkaido Gals Are Super Adorable!',
      japaneseTitle: 'Dosanko Gal wa Namara Menkoi',
      url: 'https://hianime.to/hokkaido-gals-are-super-adorable-18853',
      airingEpisode: 'Episode 10',
      airingTime: '11:45'
    }
  ]
}
```

### fetchStudio

<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| studio    | `string` | studio id, e.g. "toei-animation" |
| page (optional) | `number` | page number (default 1) |

```ts
zoro.fetchStudio('toei-animation').then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  totalPages: 9,
  results: [
    {
      id: 'one-piece-100',
      title: 'One Piece',
      url: 'https://aniwatch.to/one-piece-100',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/54/90/5490cb32786d4f7fef0f40d7266df532/5490cb32786d4f7fef0f40d7266df532.jpg',
      type: 'TV',
      duration: '24m',
      japaneseTitle: 'One Piece',
      nsfw: false,
      sub: 1089,
      dub: 1048,
      episodes: 0
    },
    {
      id: 'attack-on-titan-the-final-season-part-3-1839',
      title: 'Attack on Titan: The Final Season Part 3',
      url: 'https://aniwatch.to/attack-on-titan-the-final-season-part-3-18329',
      image: 'https://img.flawlessfiles.com/_r/300x400/100/54/d3/54d3f59bcc7caf1539c701eb0a064ec9/54d3f59bcc7caf1539c701eb0a064ec9.png',
      type: 'TV',
      duration: '61m',
      japaneseTitle: 'Shingeki no Kyojin: The Final Season - Kanketsu-hen',
      nsfw: true,
      sub: 2,
      dub: 2,
      episodes: 0
    },
    {...}
    ...
  ]
}
```

### fetchSpotlight

```ts
zoro.fetchSpotlight().then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  
  results: [
    {
      id: 'delicious-in-dungeon-18506',
      title: 'Delicious in Dungeon',
      japaneseTitle: 'Dungeon Meshi',
      banner: 'https://cdn.noitatnemucod.net/thumbnail/1366x768/100/50affe2ea9a02c36d5a7c0532c1b7ef9.jpeg',
      rank: 1,
      url: 'https://hianime.to/delicious-in-dungeon-18506',
      type: 'TV',
      duration: '23m',
      releaseDate: 'Jan 4, 2024',
      quality: 'HD',
      sub: 11,
      dub: 10,
      episodes: 0,
      description: "After the Golden Kingdom is sunk underground by an insane magician, its king emerges, promising all of his treasure to any who defeat the magician, before crumbling to dust. Guilds are spurred on by this promise, traversing the labyrinthine dungeon in search of the magician. Laios, the leader of one such guild, encounters a dragon that wipes out his party and devours his sister Falin. Despite having lost the entirety of their supplies and belongings, Laios along with Marcille, an elven healer, and Chilchuck, a halfling thief, immediately reenter the dungeon, determined to save Falin.  Time being of the essence, Laios suggests the taboo of eating the monsters of the dungeon as a means of gathering supplies. Upon the preparation of their first meal in the dungeon, they are stopped by an onlooking dwarf named Senshi. An enthusiast of monster cooking, he helps them prepare their monster ingredients for safe consumption. After learning of Laios' circumstances, Senshi expresses his desire to cook a dragon and joins their guild, thus beginning their food-filled foray into the dungeon together."
    },
    {...}
    ...
  ]
}
```
### fetchSearchSuggestions

```ts
zoro.fetchSearchSuggestions("One Piece").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  results: [
    {
      image: 'https://cdn.noitatnemucod.net/thumbnail/300x400/100/ff736656ba002e0dd51363c3d889d9ff.jpg',
      id: 'one-piece-movie-1-3096',
      title: 'One Piece Movie 1',
      japaneseTitle: 'One Piece Movie 1',
      aliasTitle: 'One Piece Movie 1',
      releaseDate: 'Mar 4, 2000',
      type: 'Movie',
      duration: '50m',
      url: 'https://hianime.to/one-piece-movie-1-3096'
    },
    {
      image: 'https://cdn.noitatnemucod.net/thumbnail/300x400/100/bcd84731a3eda4f4a306250769675065.jpg',
      id: 'one-piece-100',
      title: 'One Piece',
      japaneseTitle: 'One Piece',
      aliasTitle: 'One Piece',
      releaseDate: 'Oct 20, 1999',
      type: 'TV',
      duration: '24m',
      url: 'https://hianime.to/one-piece-100'
    },
    {
      image: 'https://cdn.noitatnemucod.net/thumbnail/300x400/100/a1e98b07e290cd9653b41a895342a377.jpg',
      id: 'one-piece-film-red-18236',
      title: 'One Piece Film: Red',
      japaneseTitle: 'One Piece Film: Red',
      aliasTitle: 'One Piece Film: Red',
      releaseDate: 'Aug 6, 2022',
      type: 'Movie',
      duration: '1h 55m',
      url: 'https://hianime.to/one-piece-film-red-18236'
    },
    {
      image: 'https://cdn.noitatnemucod.net/thumbnail/300x400/100/7156c377053c230cc42b66bbf7260325.jpg',
      id: 'one-piece-the-movie-13-film-gold-550',
      title: 'One Piece: The Movie 13 - Film: Gold',
      japaneseTitle: 'One Piece Film: Gold',
      aliasTitle: 'One Piece Film: Gold',
      releaseDate: 'Jul 23, 2016',
      type: 'Movie',
      duration: '1h 30m',
      url: 'https://hianime.to/one-piece-the-movie-13-film-gold-550'
    },
    {
      image: 'https://cdn.noitatnemucod.net/thumbnail/300x400/100/14f2be76eee4a497ad81a5039425ff06.jpg',
      id: 'one-room-third-season-6959',
      title: 'One Room Third Season',
      japaneseTitle: 'One Room Third Season',
      aliasTitle: 'One Room Third Season',
      releaseDate: 'Oct 6, 2020',
      type: 'TV',
      duration: '4m',
      url: 'https://hianime.to/one-room-third-season-6959'
    }
  ]
}
```


Make sure to check the `headers` property of the returned object. It contains the referer header, which might be needed to bypass the 403 error and allow you to stream the video without any issues.

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/anime.md#">back to anime providers list</a>)</p>
