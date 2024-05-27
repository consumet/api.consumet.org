<h1> MangaReader </h1>

```ts
  const mangaReader = new MANGA.MangaReader();
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
          id: 'one-piece-colored-edition-55493',
          title: 'One Piece (Colored Edition)',
          image: 'https://img.mreadercdn.com/_m/300x400/100/58/59/5859e56db55fb29a12696a926419e815/5859e56db55fb29a12696a926419e815.jpg',
          genres: [ 'Action', 'Adventure', 'Comedy' ]
        },
        {
          id: 'one-piece-3',
          title: 'One Piece',
          image: 'https://img.mreadercdn.com/_m/300x400/100/62/16/6216bad614899d8dc66cf8b2cb8047d9/6216bad614899d8dc66cf8b2cb8047d9.jpg',
          genres: [ 'Action', 'Adventure', 'Comedy' ]
        }
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
mangaPill.fetchMangaInfo('one-piece-colored-edition-55493').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an manga info object (including the chapters). (*[`Promise<IMangaInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L115-L120)*)\
output:
```js
{
      id: 'one-piece-colored-edition-55493',
      title: 'One Piece (Colored Edition)',
      image: 'https://img.mreadercdn.com/_m/300x400/100/58/59/5859e56db55fb29a12696a926419e815/5859e56db55fb29a12696a926419e815.jpg',
      description: 'Gol D. Roger, a man referred to as the "Pirate King," is set to be executed by the World Government. But just before his demise, he confirms the existence of a great treasure, One Piece, located somewhere within the vast ocean known as the Grand Line. Announcing that One Piece can be claimed by anyone worthy enough to reach it, the Pirate King is executed and the Great Age of Pirates begins.  Twenty-two years later, a young man by the name of Monkey D. Luffy is ready to embark on his own adventure, searching for One Piece and striving to become the new Pirate King. Armed with just a straw hat, a small boat, and an elastic body, he sets out on a fantastic journey to gather his own crew and a worthy ship that will take them across the Grand Line to claim the greatest status on the high seas.  [Written by MAL Rewrite]',
      genres: [
        'Action',
        'Adventure',
        'Comedy',
        'Fantasy',
        'Shounen',
        'Super Power'
      ],
      chapters: [
        {
          id: 'one-piece-colored-edition-55493/en/chapter-1004',
          title: 'Chapter 1004: MILLET DUMPLINGS',
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
mangaPill.fetchChapterPages('one-piece-colored-edition-55493/en/chapter-1004').then(data => {
  console.log(data);
})
```
returns an array of pages. (*[`Promise<IMangaChapterPage[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L122-L126)*)\
output:
```js
[
    {
      img: 'https://c-1.mreadercdn.com/_v2/1/0dcb8f9eaacfd940603bd75c7c152919c72e45517dcfb1087df215e3be94206cfdf45f64815888ea0749af4c0ae5636fabea0abab8c2e938ab3ad7367e9bfa52/e0/18/e018cc272ab186f6107b577862f3b8a2/e018cc272ab186f6107b577862f3b8a2.jpg?t=515363393022bbd440b0b7d9918f291a&ttl=1908547557',
      page: 1
    },
    {
      img: 'https://c-1.mreadercdn.com/_v2/0/0dcb8f9eaacfd940603bd75c7c152919c72e45517dcfb1087df215e3be94206cfdf45f64815888ea0749af4c0ae5636fabea0abab8c2e938ab3ad7367e9bfa52/61/2f/612f6ffee2881ecab50edc61b517efe7/612f6ffee2881ecab50edc61b517efe7.jpg?t=515363393022bbd440b0b7d9918f291a&ttl=1908547557',
      page: 2
    },
    {
      img: 'https://c-1.mreadercdn.com/_v2/0/0dcb8f9eaacfd940603bd75c7c152919c72e45517dcfb1087df215e3be94206cfdf45f64815888ea0749af4c0ae5636fabea0abab8c2e938ab3ad7367e9bfa52/22/bd/22bd0c8a5050b3145ad9116cb0b2aca9/22bd0c8a5050b3145ad9116cb0b2aca9.jpg?t=515363393022bbd440b0b7d9918f291a&ttl=1908547557',
      page: 3
    },
    {
      img: 'https://c-1.mreadercdn.com/_v2/1/0dcb8f9eaacfd940603bd75c7c152919c72e45517dcfb1087df215e3be94206cfdf45f64815888ea0749af4c0ae5636fabea0abab8c2e938ab3ad7367e9bfa52/c9/00/c900ff8a5ee537e019bf0caedf74a627/c900ff8a5ee537e019bf0caedf74a627.jpg?t=515363393022bbd440b0b7d9918f291a&ttl=1908547557',
      page: 4
    },
    {...},
]
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/manga.md#">Back to Providers List</a>)</p>
