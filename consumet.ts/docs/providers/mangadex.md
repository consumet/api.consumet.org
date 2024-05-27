<h1> Mangadex </h1>

```ts
const mangadex = new MANGA.MangaDex();
```

<h2>Methods</h2>

- [search](#search)
- [fetchMangaInfo](#fetchmangainfo)
- [fetchChapterPages](#fetchchapterpages)
- [fetchPopular](#fetchpopular)
- [fetchRecentlyAdded](#fetchRecentlyAdded)
- [fetchLatestUpdates](#fetchLatestUpdates)
- [fetchRandom](#fetchrandom)

### search
> Note: This method is a subclass of the [`BaseParser`](https://github.com/consumet/extensions/blob/master/src/models/base-parser.ts) class. meaning it is available across most categories.
>
<h4>Parameters</h4>

| Parameter        | Type     | Description                                                                  |
| ---------------- | -------- | ---------------------------------------------------------------------------- |
| query            | `string` | query to search for. (*In this case, We're searching for `Tomodachi Gamee`*) |
| page (optional)  | `number` | page number (default: 1)                                                     |
| limit (optional) | `number` | limit of results (default: 20)                                               |

```ts
mangadex.search("Tomodachi Game").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of manga. (*[`Promise<ISearch<IMangaResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L97-L106)*)\
output:
```js
{
  currentPage: 1,
  results: [
    {
      id: 'b35f67b6-bfb9-4cbd-86f0-621f37e6cb41', // manga id
      title: 'Tomodachi Game',
      altTitles: [
         { en: 'Friends Games' },
         { ja: 'トモダチゲーム' },
         {...},
         ...
      ],
      description: "Katagiri Yuichi believes that friends are more important than money, but he also knows the hardships of not having enough funds. He works hard to save up in ...",
      status: 'ongoing',
      releaseDate: 2013,
      contentRating: 'suggestive',
      lastVolume: null,
      lastChapter: null
    },
    {...}
    ...
  ]
}
```

### fetchMangaInfo

<h4>Parameters</h4>

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| mangaId   | `string` | manga id.(*manga id can be found in the manga search results*) |

```ts
managdex.fetchMangaInfo("b35f67b6-bfb9-4cbd-86f0-621f37e6cb41").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an manga info object (including the chapters). (*[`Promise<IMangaInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L115-L120)*)\
output:
```js
{
  id: 'b35f67b6-bfb9-4cbd-86f0-621f37e6cb41',
  title: 'Tomodachi Game',
  altTitles: [
    { en: 'Friends Games' },
    { ja: 'トモダチゲーム' },
    {...},
    ...
  ],
  description: {
    en: "Katagiri Yuichi believes that friends are more important than money, but he also knows the hardships ...',
    pl: 'Dziękujemy za wpłatę dwudziestu milionów jenów! W ten sposób dołączyliście do jedynej w swoim rodzaju gry przyjaciół! Witajcie...',
    ...
  },
  genres: [ 'Psychological', 'Drama', '...' ],
  themes: [ 'Survival' ],
  status: 'Ongoing',
  releaseDate: 2013,
  chapters: [
    {
      id: 'a79255c8-21b5-4a8c-a586-48469fa87020',
      title: 'Accomplice',
      pages: 35
    },
    {
      id: '7633dee8-cd6d-4b6d-9335-1aec7646833e',
      title: "The Game's Origins",
      pages: 37
    },
    {...}
    ...
  ]
}
```

### fetchChapterPages

<h4>Parameters</h4>

| Parameter | Type     | Description                                              |
| --------- | -------- | -------------------------------------------------------- |
| chapterId | `string` | chapter id.(*chapter id can be found in the manga info*) |

```ts
mangadex.fetchChapterPages("a79255c8-21b5-4a8c-a586-48469fa87020").then(data => {
  console.log(data);
})
```
returns an array of pages. (*[`Promise<IMangaChapterPage[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L122-L126)*)\
output:
```js
[
  {
    img: 'https://uploads.mangadex.org/data/67823e99a5e1b53bb44761c5bdcc7f33/1-6d943848bde48cdc712585fa45d97bbbe5a0432c8ecdfa4e673d53ea6fb8fb28.png',
    page: 1
  },
  {
    img: 'https://uploads.mangadex.org/data/67823e99a5e1b53bb44761c5bdcc7f33/2-060d75ddda24ef3d0848b5517572c8dc3ff0a5fe44f90798f7c71a4f7ce23fd9.png',
    page: 2
  },
  {...}
  ...
]
```

### fetchPopular

<h4>Parameters</h4>

| Parameter        | Type     | Description                                                                  |
| ---------------- | -------- | ---------------------------------------------------------------------------- |
| page (optional)  | `number` | page number (default: 1)                                                     |
| limit (optional) | `number` | limit of results (default: 20)                                               |

```ts
mangadex.fetchPopular().then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of manga. (*[`Promise<ISearch<IMangaResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L97-L106)*)\
output:
```js
{
  currentPage: 1,
  results: [
    {
      id: '32d76d19-8a05-4db0-9fc2-e0b0648fe9d0',
      title: 'Solo Leveling',
      altTitles: [
          { ko: '나 혼자만 레벨업' },
          { en: 'Only I Level up' },
          {...},
          ...
        ],
      description: 'Als sich vor zehn Jahren das „Gate“ öffnete und unsere Welt sich mit der von Monstern verband, erhielten einige   normale Menschen die Macht...',
      status: 'completed',
      releaseDate: 2018,
      contentRating: 'safe',
      lastVolume: '3',
      lastChapter: '200'
    },
    {...}
    ...
  ]
}
```

### fetchRecentlyAdded

<h4>Parameters</h4>

| Parameter        | Type     | Description                                                                  |
| ---------------- | -------- | ---------------------------------------------------------------------------- |
| page (optional)  | `number` | page number (default: 1)                                                     |
| limit (optional) | `number` | limit of results (default: 20)                                               |

```ts
mangadex.fetchRecentlyAdded().then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of manga. (*[`Promise<ISearch<IMangaResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L97-L106)*)\
output:
```js
{
  currentPage: 1,
  results: [
    {
      id: '39480d0b-339d-4669-be8e-01ca0041fca4',
      title: 'Mamono no kuchibiru',
      altTitles: [ { en: "Devil's Lips" }, { ja: '魔物のくちびる' } ],
      description: 'At first, it was a small "favour".Kibakura had instantly fallen in love with, Aikyou, his junior one grade below him.They had first met at last year...',
      status: 'completed',
      releaseDate: 2021,
      contentRating: 'erotica',
      lastVolume: '',
      lastChapter: '1'
},
    {...}
    ...
  ]
}
```

### fetchLatestUpdates

<h4>Parameters</h4>

| Parameter        | Type     | Description                                                                  |
| ---------------- | -------- | ---------------------------------------------------------------------------- |
| page (optional)  | `number` | page number (default: 1)                                                     |
| limit (optional) | `number` | limit of results (default: 20)                                               |

```ts
mangadex.fetchLatestUpdates().then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of manga. (*[`Promise<ISearch<IMangaResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L97-L106)*)\
output:
```js
{
  currentPage: 1,
  results: [
    {
      id: 'e93849b2-939f-40f3-91b4-79b96133052e',
      title: 'Medusa Dorei o Katta',
      altTitles: [
        { ja: 'メドゥーサ奴隷を買った' },
        { en: 'I Bought a Medusa Slave' },
        {...},
        ...
      ],
      description: undefined,
      status: 'ongoing',
      releaseDate: 2023,
      contentRating: 'suggestive',
      lastVolume: '',
      lastChapter: ''
    },
    {...}
    ...
  ]
}
```

### fetchRandom

<h4>Parameters</h4>

| Parameter        | Type     | Description                                                                  |
| ---------------- | -------- | ---------------------------------------------------------------------------- |


```ts
mangadex.fetchRandom().then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of manga. (*[`Promise<ISearch<IMangaResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L97-L106)*)\
output:
```js
{
  results: [
    {
      id: '151bca3e-db98-4ad2-8d8d-239943b91437',
      title: 'You Shou Yan',
      altTitles: [
        { zh: '有兽焉' },
        { en: 'Fabulous Beasts' },
        {...},
        ...
      ],
      description: 'In this realm mythological creatures roam, descendant of the nine heavens they call home. Sibuxiang, a mythical deer-man couch potato, is kicked out of heaven and assigned to...',
      status: 'ongoing',
      releaseDate: 2017,
      contentRating: 'safe',
      lastVolume: null,
      lastChapter: null
    },
    {...}
    ...
  ]
}
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/manga.md#">back to manga providers list</a>)</p>
