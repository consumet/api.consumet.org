<h1> Anime News Network </h1>

```ts
const ann = new NEWS.ANN();
```

<h2>Methods</h2>

- [fetchNewsFeeds](#fetchnewsfeeds)
  - [Getting the news info for one of the feeds](#getting-the-news-info-for-one-of-the-feeds)
- [fetchNewsInfo](#fetchnewsinfo)

### fetchNewsFeeds

<h4>Parameters</h4>

| Parameter        | Type                                                                                        | Description                 |
| ---------------- | ------------------------------------------------------------------------------------------- | --------------------------- |
| topic (optional) | [`Topics`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L348-361) | topic for getting the feed. |

```ts
ann.fetchNewsFeeds().then(console.log)
```
returns a promise which resolves into an array of the NewsFeed class. (*[`Promise<NewsFeed[]>`](https://github.com/consumet/extensions/blob/master/src/providers/news/animenewsnetwork.ts#L5-13)*)\
output:
```js
[
    {
        title: "Anime Films Airing on Indian TV: August 28-September 3",
        id: "2022-08-27/anime-films-airing-on-indian-tv-august-28-september-3/.189058",
        uploadedAt: "Aug 27, 12:34",
        topics: [
            "anime"
        ],
        preview: {
            intro: "Hungama TV airs Shin-chan film, Super Hungama airs Pokémon films",
            full: "Editor's note: The titles and air times on this page will be updated as television channels make new announcements and update their schedules throughout the week. The third-party TV guide listings app \"What's On India: TV Guide App\" is currently listing that the following anime films will be airing in India this week: Sunday, August 2..."
        },
        thumbnail: "https://www.animenewsnetwork.com/thumbnails/cover400x200/encyc/A16735-2734914642.1424057051.jpg",
        url: "https://www.animenewsnetwork.com/news/2022-08-27/anime-films-airing-on-indian-tv-august-28-september-3/.189058"
    },
    {
        title: "Netflix India Lists Drifting Home Anime Film, Cyberpunk: Edgerunners Anime",
        id: "2022-08-27/netflix-india-lists-drifting-home-anime-film-cyberpunk-edgerunners-anime/.189007",
        uploadedAt: "Aug 27, 06:00",
        topics: [
            "anime"
        ],
        preview: {
            intro: "Drifting Home releases on September 16; Cyberpunk: Edgerunners yet to get release date",
            full: "Netflix is listing Studio Colorido's new full-length anime film Drifting Home (Ame o Tsugeru Hyōryū Danchi) for release in India on September 16. It is also listing Cyberpunk: Edgerunners, the upcoming anime series by Studio Trigger based on CD Projekt Red's Cyberpunk 2077 game, for release in India without a con..."
        },
        thumbnail: "https://www.animenewsnetwork.com/thumbnails/cover400x200/cms/news.5/184987/drifting-home-kv-2.jpeg",
        url: "https://www.animenewsnetwork.com/news/2022-08-27/netflix-india-lists-drifting-home-anime-film-cyberpunk-edgerunners-anime/.189007"
    },
    {...},
    ...
]
```

#### Getting the news info for one of the feeds

```ts 
ann.fetchNewsFeeds().then((res) => {
    res[0].getInfo().then(console.log)
})
```

### fetchNewsInfo

<h4>Parameters</h4>

| Parameter | Type     | Description                                                                                |
| --------- | -------- | ------------------------------------------------------------------------------------------ |
| id        | `string` | id of the news.(*news id can be found in the url of the news, it is next to the "/news/"*) |

```ts
ann.fetchNewsInfo("2022-08-26/higurashi-no-naku-koro-ni-rei-oni-okoshi-hen-manga-ends/.188996" /* --> https://www.animenewsnetwork.com/news/2022-08-26/higurashi-no-naku-koro-ni-rei-oni-okoshi-hen-manga-ends/.188996*/ ).then(console.log)
```
returns a promise which resolves into a news info object. (*[`Promise<INewsInfo>`](https://github.com/consumet/extensions/blob/master/src/models/types.ts#L286-L291)*)\
output:
```js
{
    id: "2022-08-26/higurashi-no-naku-koro-ni-rei-oni-okoshi-hen-manga-ends/.188996",
    title: "Higurashi no Naku Koro ni Rei: Oni Okoshi-hen Manga Ends",
    uploadedAt: "2022-08-27 00:30 IST",
    intro: "Manga launched in November",
    description: "Square Enix's Gangan Online manga app published the final chapter of Kei Natsumi's Higurashi no Naku Koro ni Rei: Oni Okoshi-hen manga on Wednesday.\n\nThe manga is one of two new manga ...",
    thumbnail: "https://animenewsnetwork.com/thumbnails/max400x400/cms/news.5/188996/oniokoshi.jpg",
    url: "https://www.animenewsnetwork.com/news/2022-08-26/higurashi-no-naku-koro-ni-rei-oni-okoshi-hen-manga-ends/.188996"
}
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/news.md#">back to news providers list</a>)</p>