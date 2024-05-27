<h1 align="center">consumet.ts</h1>

<h2>ANIME</h2>

By using `ANIME` category you can interact with the anime providers. And get access to the anime providers methods. Which allows you to search for anime, get the anime information, get the anime episodes with streaming links.

```ts
// ESM
import { ANIME } from '@consumet/extensions';

// <providerName> is the name of the provider you want to use. list of the proivders is below.
const animeProvider = ANIME.<providerName>();
```

## Common Methods

``languages`` - string, the language of the current provider, return language code, example: ``languages: 'en'``

``isNSFW`` - bool, ``true`` if the provider provides NSFW content.

``isWorking`` - bool, a bool to identify the state of the current provider, ``true`` if the provider is working, ``false`` otherwise.

``isDubAvailableSeparately`` - bool, ``true`` if the provider provides dubbed content.

``name`` - string, the name of the current provider, example: ``name: 'Crunchyroll'``

``baseUrl`` - string, url to the base URL of the current provider

``logo`` - string, url to the logo image of the current provider

``classPath`` - string,


## Anime Providers List
This list is in alphabetical order. (except the sub bullet points)

- [9anime](../providers/9anime.md)
- [Anify](../providers/anify.md)
- [AnimeFox](../providers/animefox.md)
- [AnimePahe](../providers/animepahe.md)
- [AnimeSaturn](../providers/animesaturn.md)
- [AnimeUnity](../providers/animeunity.md)
- [Gogoanime](../providers/gogoanime.md)
- [Zoro.to](../providers/zoro.md)

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs">back to table of contents</a>)</p>
