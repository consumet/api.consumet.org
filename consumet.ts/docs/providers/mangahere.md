<h1> MangaHere </h1>

```ts
const mangahere = new MANGA.MangaHere();
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
| query     | `string` | query to search for. (*In this case, We're searching for `Tomodachi Gamee`*) |

```ts
mangahere.search("Tomodachi Game").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of manga. (*[`Promise<ISearch<IMangaResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L97-L106)*)\
output:
```js
{
  currentPage: 1,
  hasNextPage: true,
  results: [
    {
      id: 'tomodachi_game',
      title: 'Tomodachi Game',
      image: 'http://fmcdn.mangahere.com/store/manga/15338/cover.jpg?token=18f21960258f216e0920191b8fe78c0b691e88b6&ttl=1658167200&v=1657454312',
      description: 'Katagiri Yuichi believes that friends are more important than money, but he also knows the hardships of not ha...',
      status: 'Ongoing'
    },
    {
      id: 'tomodachi',
      title: 'Tomodachi',
      image: 'http://fmcdn.mangahere.com/store/manga/1653/cover.jpg?token=ec848c72fcd6b3596f16d42c1ead656755ed47c6&ttl=1658167200&v=1272884354',
      description: 'After being overseas for five years, 16-year-old Yamato comes back to Japan to find that her geeky best friend...',
      status: 'Completed'
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
mangahere.fetchMangaInfo("tomodachi_game").then(data => {
  console.log(data);
})
```
returns a promise which resolves into an manga info object (including the chapters). (*[`Promise<IMangaInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L115-L120)*)\
output:
```js
{
  id: 'tomodachi_game',
  title: 'Tomodachi Game',
  description: 'Katagiri Yuichi believes that friends are more important than money, but he also knows the hardships of not having enough funds. He works hard to save up in order to go on the high school trip, because he has promised his four ...',
  headers: { Referer: 'http://www.mangahere.cc/' },
  image: 'http://fmcdn.mangahere.com/store/manga/15338/cover.jpg?token=18f21960258f216e0920191b8fe78c0b691e88b6&ttl=1658167200&v=1657454312',
  genres: [ 'Mystery', 'Drama', 'Shounen', 'Psychological', 'Ecchi' ],
  status: 'Ongoing',
  rating: 4.84,
  authors: [ 'YAMAGUCHI Mikoto' ],
  chapters: [
    {
      id: 'tomodachi_game/c102',
      title: 'Ch.102',
      releasedDate: 'Jul 10,2022 '
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
mangahere.fetchChapterPages("tomodachi_game/c102").then(data => {
  console.log(data);
})
```
returns an array of pages. (*[`Promise<IMangaChapterPage[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L122-L126)*)\
output:
```js
[
  {
    page: 0,
    img: 'https://zjcdn.mangahere.org/store/manga/15338/102.0/compressed/h001.jp',
    headers: {
      Referer: 'http://www.mangahere.cc/manga/tomodachi_game/c102/1.html'
    }
  },
  {
    page: 1,
    img: 'https://zjcdn.mangahere.org/store/manga/15338/102.0/compressed/h002.jp',
    headers: {
      Referer: 'http://www.mangahere.cc/manga/tomodachi_game/c102/1.html'
    }
  },
  {
    page: 2,
    img: 'https://zjcdn.mangahere.org/store/manga/15338/102.0/compressed/h003.jp',
    headers: {
      Referer: 'http://www.mangahere.cc/manga/tomodachi_game/c102/1.html'
    }
  },
  {...}
  ...
]
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/manga.md#">back to manga providers list</a>)</p>
