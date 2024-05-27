# Libgen

## Methods

```ts
/**
 * Scrapes a libgen search page by book query
 * 
 * @param {string} query - the name of the book
 * @param {number} [page=1] - maximum number of results
 * @returns {Promise<LibgenResult>}
*/
Libgen.search("One Houndred Years of Solitude", 30);

/**
 * scrapes a ligen book page by book page url
 * 
 * @param {string} bookUrl - ligen book page url
 * @returns {Promise<LibgenBook>}
*/
Libgen.scrapeBook(
  "http://libgen.rs/book/index.php?md5=262BFA73B8090B6AA3DBD2FBCDC4B91D"
);
```

## Variables

```ts
/**
 * @type {string}
*/
Libgen.name; // the name of the provider.
/**
 * @type {boolean}
*/
Libgen.isNSFW; // if NSFW
/**
 * @type {boolean}
*/
Libgen.isWorking; // if provider is working
```

<p align="end">(<a href="https://github.com/consumet/extensions/blob/master/docs/guides/books.md#">back to book providers list</a>)</p>