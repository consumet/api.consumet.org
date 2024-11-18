<h1> MangaPill </h1>

```ts
const mangaPill = new MANGA.MangaPill();
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
| query     | `string` | query to search for. (*In this case, we're searching for `one piece`*) |

```ts
mangaPill.search('one piece').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of manga. (*[`Promise<ISearch<IMangaResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L97-L106)*)\
output:
```js
{
    results: [
       {
          id: '2/one-piece',
          title: 'One Piece',
          image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/2.jpeg'
        },
        {
          id: '3258/one-piece-digital-colored-comics',
          title: 'One Piece - Digital Colored Comics',
          image: 'https://cdn.readdetectiveconan.com/file/mangapill/i/3258.jpeg'
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
mangaPill.fetchMangaInfo('2/one-piece').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an manga info object (including the chapters). (*[`Promise<IMangaInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L115-L120)*)\
output:
```js
{
       id: '3258/one-piece-digital-colored-comics',
      title: 'One Piece - Digital Colored Comics',
      description: 'As a child, Monkey D. Luffy dreamed of becoming the King of the Pirates. But his life changed when he accidentally gained the power to stretch like rubber...at the cost of never being able to swim again! Now Luffy, with the help of a motley collection of nakama, is setting off in search of "One Piece," said to be the greatest treasure in the world...',
      releaseDate: '1997',
      genres: [
        'Action',
        'Adventure',
        'Comedy',
        'Drama',
        'Fantasy',
        'Shounen',
        'Supernatural'
      ],
        chapters: [
           {
            id: '3258-11004000/one-piece-digital-colored-comics-chapter-1004',
            title: 'Chapter 1004',
            chapter: '1004'
          },
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
mangaPill.fetchChapterPages('3258-11004000/one-piece-digital-colored-comics-chapter-1004').then(data => {
  console.log(data);
})
```
returns an array of pages. (*[`Promise<IMangaChapterPage[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L122-L126)*)\
output:
```js
[
    {
      img: 'https://cdn.readdetectiveconan.com/file/mangap/3258/11004000/1.png',
      page: 1
    },
    {
      img: 'https://cdn.readdetectiveconan.com/file/mangap/3258/11004000/2.png',
      page: 2
    },
    {
      img: 'https://cdn.readdetectiveconan.com/file/mangap/3258/11004000/3.png',
      page: 3
    },
    {
      img: 'https://cdn.readdetectiveconan.com/file/mangap/3258/11004000/4.png',
      page: 4
    },
    {...},
]
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/manga.md#">Back to Providers List</a>)</p>
