<h1 align="center">consumet.ts</h1>

<h2>MANGA</h2>

By using `MANGA` category you can interact with the manga providers. And have access to the manga providers methods. Which allows you to search for manga, get the manga information, get the manga chapters with images to read.

```ts
// ESM
import { MANGA } from '@consumet/extensions';

// <providerName> is the name of the provider you want to use. list of the proivders is below.
const mangaProvider = MANGA.<providerName>();
```

## Common Methods

``languages`` - string, the language of the current provider, return language code, example: ``languages: 'en'``

``isNSFW`` - bool, ``true`` if the provider providers NSFW content.

``isWorking`` - bool, a bool to identify the state of the current provider, ``true`` if the provider is working, ``false`` otherwise.

``name`` - string, the name of the current provider, example: ``name: 'Crunchyroll'``

``baseUrl`` - string, url to the base URL of the current provider

``logo`` - string, url to the logo image of the current provider

``classPath`` - string,


## Manga Providers List
This list is in alphabetical order. (except the sub bullet points)

- [MangaDex](../providers/mangadex.md)
- [MangaHere](../providers/mangahere.md)
- [MangaKakalot](../providers/mangakakalot.md)
- [Mangasee123](../providers/mangasee123.md)
- [MangaHost](../providers/mangahost.md)
- [BRManga](../providers/brmanga.md)


<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs">back to table of contents</a>)</p>
