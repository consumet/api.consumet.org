<h1 align="center">consumet.ts</h1>

<h2>META</h2>

By using `META` category you can interact with the custom providers. And get access to the meta providers methods.

```ts
// ESM
import { META } from '@consumet/extensions';

// <providerName> is the name of the provider you want to use. list of the proivders is below.
const metaProvider = META.<providerName>();
```

## Common Methods

provider Anilist {

``languages`` - string, the language of the current provider, return language code, example: ``languages: 'en'``

``isNSFW`` - bool, ``true`` if the provider providers NSFW content.

``isWorking`` - bool, a bool to identify the state of the current provider, ``true`` if the provider is working, ``false`` otherwise. 

``isDubAvailableSeparately`` - bool, ``true`` if the provider providers dubbed content. 

``name`` - string, the name of the current provider, example: ``name: 'Anilist'``

``baseUrl`` - string, url to the base URL of the current provider

``logo`` - string, url to the logo image of the current provider

``classPath`` - string,


## Meta Providers List
This list is in alphabetical order. (except the sub bullet points)

- [Anilist](../providers/anilist.md)

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs">back to table of contents</a>)</p>
