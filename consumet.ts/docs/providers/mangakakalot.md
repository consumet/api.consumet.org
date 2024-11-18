<h1> MangaKakalot </h1>

```ts
const mangakakalot = new MANGA.MangaKakalot();
```

<h2>Methods</h2>

- [search](#search)
- [fetchMangaInfo](#fetchmangainfo)
- [fetchChapterPages](#fetchchapterpages)

### search
> Note: This method is a subclass of the [`BaseParser`](https://github.com/consumet/extensions/blob/master/src/models/base-parser.ts) class. meaning it is available across most categories.
> 
<h4>Parameters</h4>

| Parameter | Type     | Description                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------- |
| query     | `string` | query to search for. (*In this case, We're searching for `Tomodachi Game`*) |

```ts
mangakakalot.search("Tomodachi Game").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of manga. (*[`Promise<ISearch<IMangaResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L97-L106)*)\
output:
```js
{
  results: [
    {
      id: 'manga-kr954974',
      title: 'Tomodachi Game',
      image: 'https://avt.mkklcdnv6temp.com/24/h/3-1583468630.jpg',
      headerForImage: { Referer: 'https://mangakakalot.com' }
    },
    {
      id: 'read-nf3ar158504885573',
      title: 'Hanging Out With A Gamer Girl',
      image: 'https://avt.mkklcdnv6temp.com/38/v/19-1583500595.jpg',
      headerForImage: { Referer: 'https://mangakakalot.com' }
    }
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
mangakakalot.fetchMangaInfo("manga-kr954974").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an manga info object (including the chapters). (*[`Promise<IMangaInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L115-L120)*)\
output:
```js
{
  id: 'manga-kr954974',
  title: 'Tomodachi Game',
  altTitles: [
    'トモダチゲーム (Japanese)',
    ' 朋友游戏 (Chinese)',
    '...'
  ],
  description: `Katagiri Yuichi believes that friends are more important than money, but he also knows the hardships of not having enough funds....`,
  headerForImage: { Referer: 'https://readmanganato.com' },
  image: 'https://avt.mkklcdnv6temp.com/24/h/3-1583468630.jpg',
  genres: [ 'Drama', 'Mystery', 'Psychological', 'Seinen' ],
  status: 'Ongoing',
  views: 20837606,
  authors: [ 'Yamaguchi Mikoto' ],
  chapters: [
    {
      id: 'manga-kr954974/chapter-102$$READMANGANATO',
      title: 'Chapter 102',
      views: 36721,
      releasedDate: 'Jul 10,2022 22:07'
    },
    {...}
  ]
}
```
Note: The `headerForImage` property might be useful when getting the image to display.

### fetchChapterPages

<h4>Parameters</h4>

| Parameter | Type     | Description                                              |
| --------- | -------- | -------------------------------------------------------- |
| chapterId | `string` | chapter id.(*chapter id can be found in the manga info*) |

```ts
mangakakalot.fetchChapterPages("manga-kr954974/chapter-102$$READMANGANATO").then(data => {
  console.log(data);
})
```
returns an array of pages. (*[`Promise<IMangaChapterPage[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L122-L126)*)\
output:
```js
[
  {
    img: 'https://v17.mkklcdnv6tempv5.com/img/tab_17/00/36/17/kr954974/chapter_102/1-o.jpg',
    page: 0,
    title: 'Tomodachi Game Chapter 102 page 1',
    headerForImage: { Referer: 'https://mangakakalot.com' }
  },
  {
    img: 'https://v17.mkklcdnv6tempv5.com/img/tab_17/00/36/17/kr954974/chapter_102/2-o.jpg',
    page: 1,
    title: 'Tomodachi Game Chapter 102 page 2',
    headerForImage: { Referer: 'https://mangakakalot.com' }
  },
  {...}
]
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/manga.md#">back to manga providers list</a>)</p>
