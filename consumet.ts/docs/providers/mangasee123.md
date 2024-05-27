<h1> Mangasee123 </h1>

```ts
const mangasee123 = new MANGA.Mangasee123();
```

<h2>Methods</h2>

- [search](#search)
- [fetchMangaInfo](#fetchmangainfo)
- [fetchChapterPages](#fetchchapterpages)

### search
> Note: This method is a subclass of the [`BaseParser`](https://github.com/consumet/extensions/blob/master/src/models/base-parser.ts) class, meaning it is available across most categories.
> 
<h4>Parameters</h4>

| Parameter | Type     | Description                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------- |
| query     | `string` | query to search for. (*In this case, we're searching for `Call of the Night`*) |

```ts
mangasee123.search('Call of the Night').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of manga. (*[`Promise<ISearch<IMangaResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L97-L106)*)\
output:
```js
{
    results: [
        {
        id: 'Yofukashi-no-Uta',
        title: 'Call of the Night',
        altTitles: ['Yofukashi no Uta'],
        image: 'https://temp.compsci88.com/cover/Yofukashi-no-Uta.jpg',
        headerForImage: { Referer: 'https://mangasee123.com' }
        },
        {...},
    ]
}
```

### fetchMangaInfo

<h4>Parameters</h4>

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| mangaId   | `string` | manga id (*can be found in the manga search results*) |

```ts
mangasee123.fetchMangaInfo('Yofukashi-no-Uta').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an manga info object (including the chapters). (*[`Promise<IMangaInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L115-L120)*)\
output:
```js
{
    id: 'Yofukashi-no-Uta',
    title: 'Call of the Night',
    altTitles: [ 'Yofukashi no Uta' ],
    genres: [
        'Comedy',
        'Psychological',
        'Romance',
        'Shounen',
        'Slice of Life',
        'Supernatural'
    ],
    image: 'https://temp.compsci88.com/cover/Yofukashi-no-Uta.jpg',
    headerForImage: { Referer: 'https://mangasee123.com' },
    description: 'Unable to sleep or find true satisfaction in his daily life, Yamori Kou begins wandering the night streets. He encounters a strange girl named Nanakusa Nazuna who offers to help soothe his insomnia by sleeping beside him, but it is not merely a one-way exchange...',
    chapters: [
        { id: 'Yofukashi-no-Uta-chapter-137', title: 'null' },
        {...},
    ]
}
```
Note: The `headerForImage` property might be useful when getting the image to display.

### fetchChapterPages

<h4>Parameters</h4>

| Parameter | Type     | Description                                              |
| --------- | -------- | -------------------------------------------------------- |
| chapterId | `string` | chapter id (*can be found in the manga info*) |

```ts
mangasee123.fetchChapterPages('Yofukashi-no-Uta-chapter-1').then(data => {
  console.log(data);
})
```
returns an array of pages. (*[`Promise<IMangaChapterPage[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L122-L126)*)\
output:
```js
[
    {
        page: 1,
        img: 'https://official-ongoing-1.ivalice.us/manga/Yofukashi-no-Uta/0001-001.png',
        headerForImage: { Referer: 'https://mangasee123.com' }
    },
    {
        page: 2,
        img: 'https://official-ongoing-1.ivalice.us/manga/Yofukashi-no-Uta/0001-002.png',
        headerForImage: { Referer: 'https://mangasee123.com' }
    },
    {
        page: 3,
        img: 'https://official-ongoing-1.ivalice.us/manga/Yofukashi-no-Uta/0001-003.png',
        headerForImage: { Referer: 'https://mangasee123.com' }
    },
    {
        page: 4,
        img: 'https://official-ongoing-1.ivalice.us/manga/Yofukashi-no-Uta/0001-004.png',
        headerForImage: { Referer: 'https://mangasee123.com' }
    },
    {...},
]
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/manga.md#">Back to Providers List</a>)</p>
