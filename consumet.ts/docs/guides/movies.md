<h1 align="center">consumet.ts</h1>

<h2>MOVIES</h2>

By using `MOVIES` category you can interact with the movie providers. And have access to the movie providers methods. Which allows you to search for movies and shows, get the movie/tv series information, get the movie/tv series episodes with streaming links.

```ts
// ESM
import { MOVIES } from '@consumet/extensions';

// <providerName> is the name of the provider you want to use. list of the proivders is below.
const movieProvider = new MOVIES.<providerName>();
```

## Common Methods

``languages`` - string, the language of the current provider, return language code, example: ``languages: 'en'``

``isNSFW`` - bool, ``true`` if the provider providers NSFW content.

``isWorking`` - bool, a bool to identify the state of the current provider, ``true`` if the provider is working, ``false`` otherwise. 

``name`` - string, the name of the current provider, example: ``name: 'FlixHQ'``

``baseUrl`` - string, url to the base URL of the current provider

``logo`` - string, url to the logo image of the current provider

``classPath`` - string,

``supportedTypes`` - object, A ``Set`` of supported types by the provider, to check if a type is supported use  ``supportedTypes.has(<the type to be checked>)``.
  

## Movies Providers List
This list is in alphabetical order. (except the sub bullet points)

- [Goku](../providers/goku.md)
- [MovieHdWatch](../providers/moviehdwatch.md)
- [FlixHQ](../providers/flixhq.md)
- [ViewAsian](../providers/viewAsian.md)

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs">back to table of contents</a>)</p>
