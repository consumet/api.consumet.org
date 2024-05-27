<h1>AnimePahe</h1>

```ts
const animepahe = new ANIME.AnimePahe();
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
| query     | `string` | query to search for. (*In this case, We're searching for `Overlord IV`*) |

```ts
animepahe.search("Overlord IV").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of anime. (*[`Promise<ISearch<IAnimeResult[]>>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L13-L26)*)\
output:
```js
{
  results: [
    {
      id: 'adb84358-8fec-fe80-1dc5-ad6218421dc1',
      title: 'Overlord IV',
      image: 'https://i.animepahe.com/posters/cb77e1e2a76b985a7c9d9b90a497fee65d89fa9c41d0e9e6fab4608d10313ddf.jpg',
      rating: 8.3,
      releaseDate: 2022,
      type: 'TV'
    },
    {
      id: 'a0d776d3-48d2-5487-971d-f5d8dada5c42',
      title: 'Overlord',
      image: 'https://i.animepahe.com/posters/e78bf21dfd4e382dbc985501edb0f57bda7d5305b87863fe8991a5e658c9c1a8.jpg',
      rating: 7.92,
      releaseDate: 2015,
      type: 'TV'
    },
    {...}
    ...
  ]
}
```

### fetchAnimeInfo

<h4>Parameters</h4>

| Parameter              | Type     | Description                                                                                                                              |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| id                     | `string` | takes anime id as a parameter. (*anime id can be found in the anime search results or anime info object*)                                |
| episodePage (optional) | `number` | takes episode page number as a parameter. default: -1 to get all episodes at once (*episodePages can be found in the anime info object*) |


```ts
animepahe.fetchAnimeInfo("adb84358-8fec-fe80-1dc5-ad6218421dc1").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an anime info object (including the episodes). (*[`Promise<IAnimeInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L28-L42)*)\
output:
```js
{
  id: 'adb84358-8fec-fe80-1dc5-ad6218421dc1',
  title: 'Overlord IV',
  image: 'https://i.animepahe.com/posters/cb77e1e2a76b985a7c9d9b90a497fee65d89fa9c41d0e9e6fab4608d10313ddf.jpg',
  cover: 'https://i.animepahe.com/covers/cover_default3.jpg',
  description: 'Fourth season of Overlord.',
  genres: [ 'Action', 'Fantasy', 'Supernatural' ],
  status: 'Ongoing',
  type: 'TV',
  releaseDate: 'Jul 05, 2022',
  aired: 'Jul 05, 2022 to ?',
  studios: [ 'Madhouse' ],
  totalEpisodes: NaN, // NaN means that the anime is ongoing.
  episodes: [
    {
      id: 'c673b4d6cedf5e4cd1900d30d61ee2130e23a74e58f4401a85f21a4e95c94f73',
      number: 1,
      title: '',
      image: 'https://i.animepahe.com/snapshots/8b3499c66e59e4c266485b54b78ad8469a520d9957dbe5a117f8d0934a93817a.jpg',
      duration: '00:23:40'
    }
  ],
  episodePages: 1 // 1 means that there is only one page of episodes.
}
```

### fetchEpisodeSources

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                           |
| --------- | -------- | ------------------------------------------------------------------------------------- |
| episodeId | `string` | takes episode id as a parameter. (*episode id can be found in the anime info object*) |


In this example, we're getting the sources for the first episode of Overlord IV.
```ts
animepahe.fetchEpisodeSources("c673b4d6cedf5e4cd1900d30d61ee2130e23a74e58f4401a85f21a4e95c94f73").then(data => {
  console.log(data);
})
```

returns a promise which resolves into an array of episode sources. (*[`Promise<ISource>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L210-L214)*)\
output:
```js
{
  headers: { Referer: 'https://kwik.cx/' },
  sources: [
    {
      url: 'https://na-191.files.nextcdn.org/hls/01/b49063a1225cf4350deb46d79b42a7572e323274d1c9d63f3b067cc4df09986a/uwu.m3u8',
      isM3U8: true,
      quality: '360',
      size: 44617958
    },
    {
      url: 'https://na-191.files.nextcdn.org/hls/01/c32da1b1975a5106dcee7e7182219f9b4dbef836fb782d7939003a8cde8f057f/uwu.m3u8',
      isM3U8: true,
      quality: '720',
      size: 78630133
    },
    {
      url: 'https://na-191.files.nextcdn.org/hls/01/b85d4450908232aa32b71bc67c80e8aedcc4f32a282e5df9ad82e4662786e9d8/uwu.m3u8',
      isM3U8: true,
      quality: '1080',
      size: 118025148
    }
  ]
}
```

Make sure to check the `headers` property of the returned object. It contains the referer header, which is needed to bypass the 403 error and allow you to stream the video without any issues.

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/anime.md#">back to anime providers list</a>)</p>
