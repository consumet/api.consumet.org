<h1>AnimeUnity</h1>

```ts
const animeunity = new ANIME.AnimeUnity();
```

<h2>Methods</h2>

- [search](#search)
- [fetchAnimeInfo](#fetchanimeinfo)
- [fetchEpisodeSources](#fetchepisodesources)

### search
> Note: This method is a subclass of the [`BaseParser`](https://github.com/consumet/extensions/blob/master/src/models/base-parser.ts) class. meaning it is available across most categories.


<h4>Parameters</h4>

| Parameter | Type     | Description                                                              |
| --------- | -------- | ------------------------------------------------------------------------ |
| query     | `string` | query to search for. (*In this case, We're searching for `Jujutsu Kaisen 2`*) |

```ts
animeunity.search("Demon Slayer: Kimetsu no Yaiba Hashira Training Arc").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
    hasNextPage: false,
    results: [
        {
            id: '5167-demon-slayer-kimetsu-no-yaiba-hashira-training-arc',
            title: 'Kimetsu no Yaiba: Hashira Geiko-hen',
            url: 'https://www.animeunity.to/anime/5167-demon-slayer-kimetsu-no-yaiba-hashira-training-arc',
            image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx166240-bGHsLoWmJmiL.png',
            cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/166240-YdxoEhrfwNk0.jpg',
            subOrDub: 'sub'
        }
        {...},
        ...
    ]
}
```

### fetchAnimeInfo

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                                               |
| --------- | -------- | --------------------------------------------------------------------------------------------------------- |
| id        | `string` | takes anime id as a parameter. (*anime id can be found in the anime search results or anime info object*) |
| page?     | `number` | takes page number as a parameter                                                                          |

Why page number? AnimeUnity provides only 120 episodes at a time, how to use:
- page: 1, you'll get episodes info from 1 to 120;
- page: 4, you'll get episodes info from 361 to 480.

If no page number is passed, the first page will be fetched.

```ts
animesaturn.fetchAnimeInfo("5167-demon-slayer-kimetsu-no-yaiba-hashira-training-arc", 1).then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes). (*[`Promise<IAnimeInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L28-L42)*)\
output:
```js
{
    currentPage: 1,
    hasNextPage: false,
    totalPages: 1,
    id: '5167-demon-slayer-kimetsu-no-yaiba-hashira-training-arc',
    title: 'Demon Slayer: Kimetsu no Yaiba Hashira Training Arc',
    url: 'https://www.animeunity.to/anime/5167-demon-slayer-kimetsu-no-yaiba-hashira-training-arc',
    alID: '166240',
    genres: [
        'Action',
        'Adventure',
        'Drama',
        'Fantasy',
        'Historical',
        'Shounen',
        'Supernatural'
    ],
    totalEpisodes: 1,
    image: 'https://img.animeunity.to/anime/bx166240-bGHsLoWmJmiL.png',
    cover: 'https://img.animeunity.to/anime/166240-YdxoEhrfwNk0.jpg',
    description: "Adattamento animato dell'arco Hashira Training",
    episodes: [
        {
            id: '5167-demon-slayer-kimetsu-no-yaiba-hashira-training-arc/80480',
            number: 1,
            url: 'https://www.animeunity.to/anime/5167-demon-slayer-kimetsu-no-yaiba-hashira-training-arc/80480'
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


In this example, we're getting the sources for the first episode of Demon Slayer: Kimetsu no Yaiba Hashira Training Arc.
```ts
animesaturn.fetchEpisodeSources("5167-demon-slayer-kimetsu-no-yaiba-hashira-training-arc/80480").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of episode sources. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L210-L214)*)\
output:
```js
{
    sources: [
        {
            url: 'https://vixcloud.co/playlist/226038?type=video&rendition=480p&token=3PBuZDfjsMTHY94nq6fjkg&expires=1721216219&edge=au-u1-01',
            quality: '480p',
            isM3U8: true
        },
        {
            url: 'https://vixcloud.co/playlist/226038?type=video&rendition=720p&token=9gqvFqv8EznuX3U6RuISZg&expires=1721216219&edge=au-u1-01',
            quality: '720p',
            isM3U8: true
        },
        {
            url: 'https://vixcloud.co/playlist/226038?type=video&rendition=1080p&token=zCuz2Jg81JGq5Dokyvw8zg&expires=1721216219&edge=au-u1-01',
            quality: '1080p',
            isM3U8: true
        },
        {
            url: 'https://vixcloud.co/playlist/226038?token=dc6d3b04327aa3f0c21d53b444d4d0cb&referer=&expires=1721216219&h=1',
            quality: 'default',
            isM3U8: true
        }
      ],
      download: 'https://au-d1-01.scws-content.net/download/22/f/3a/f3ad66d6-262b-45e6-ba26-5225fdac18e4/1080p.mp4?token=q4oELFDSbkxeo6zh84zoIQ&expires=1716118619&filename=KimetsunoYaiba%3AHashiraGeiko-hen_Ep_01_SUB_ITA.mp4'
}
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/anime.md#">back to anime providers list</a>)</p>
