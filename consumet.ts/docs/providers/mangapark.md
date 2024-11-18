<h1> Mangapark </h1>

```ts
const mangapark = new MANGA.Mangapark();
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
| query     | `string` | query to search for. (*In this case, we're searching for `Demon Slayer`*) |

```ts
mangapark.search('Demon Slayer').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an array of manga. (*[`Promise<ISearch<IMangaResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L97-L106)*)\
output:
```js
{
    results: [
        {
            id: 'kimetsu-no-yaiba-gotouge-koyoharu',
            title: 'Kimetsu no Yaiba',
            image: 'https://xfs-208.mpcdn.net/thumb/W300/ampi/4aa/4aa22fd3ad34407a393f7b6913d2aa2b8f8ffb16_200_313_42953.jpg?acc=HWnoBrwaLc4Zr8oqnuye6A&exp=1667746330}'
        },
        {
            id: 'demon-slayer',
            title: 'Demon Slayer',
            image: 'https://xfs-202.mpcdn.net/thumb/W300/ampi/d53/d53c34517f4f01a432671daf6b40ddf286d1eb3f_420_560_93000.jpg?acc=-aM_ezD9ZjavQljf-5oKfA&exp=1667746330}'
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
mangapark.fetchMangaInfo('kimetsu-no-yaiba-gotouge-koyoharu').then(data => {
  console.log(data);
})
```
returns a promise which resolves into an manga info object (including the chapters). (*[`Promise<IMangaInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L115-L120)*)\
output:
```js
{
        id: 'kimetsu-no-yaiba-gotouge-koyoharu',
        title: 'Kimetsu no Yaiba Manga',
        image: 'https://xfs-205.mpcdn.net/thumb/W600/ampi/4aa/4aa22fd3ad34407a393f7b6913d2aa2b8f8ffb16_200_313_42953.jpg?acc=rE6O-EEv2KdiP10eToF_JA&exp=1667748279',
        description: 'Tanjiro is the eldest son in a family that has lost its father. Tanjiro visits another town one day to sell charcoal but ends up staying the night at someone else’s house instead of going home because of a rumor about a demon that stalks a nearby mountain at night. When he goes home the next day, tragedy is waiting for him.',
        chapters: [
          {
            id: 'kimetsu-no-yaiba-gotouge-koyoharu/i2458253',
            title: 'ch.205: Lives That Make the Years Shine',
            releaseDate: '2 years ago'
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
mangapark.fetchChapterPages('kimetsu-no-yaiba-gotouge-koyoharu/i2325814').then(data => {
  console.log(data);
})
```
returns an array of pages. (*[`Promise<IMangaChapterPage[]>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L122-L126)*)\
output:
```js
[
    {
        page: 1,
        img: 'https://xfs-227.mpcdn.net/comic/00005/images/bd/f1/bdf140d00acd17ce7f9a45f9b4ac148e332495b6_225748_800_1168.jpg?acc=pnJI5cyhhLQiJe85kXeDrg&exp=1667748434'
    },
    {
        page: 2,
        img: 'https://xfs-223.mpcdn.net/comic/00005/images/91/17/911786e51e670d10422d65e1d82d5344fb0a314a_170091_800_1168.jpg?acc=_vqLK38I_5bYy7fnNewm9A&exp=1667748434'
    },
    {
        page: 3,
        img: 'https://xfs-211.mpcdn.net/comic/00005/images/00/1d/001d537355ed17050395285a2b503f88ef481781_182747_1200_876.jpg?acc=iMYaYUDBkqfYRODG4y2QKg&exp=1667748434'
    },
    {
        page: 4,
        img: 'https://xfs-202.mpcdn.net/comic/00005/images/c8/d3/c8d3610e09dd47552601187395c93f3e8f200137_102838_800_800.jpg?acc=svY_E6ZWyiBoiuhP7-fSHA&exp=1667748434'
    },
    {...},
]
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/manga.md#">Back to Providers List</a>)</p>
