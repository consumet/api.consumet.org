import { MANGA } from "@consumet/extensions";
export const mangaProviders = {
  MangaDex: new MANGA.MangaDex(),
  ComicK: new MANGA.ComicK(),
  MangaHere: new MANGA.MangaHere(),
  MangaPill: new MANGA.MangaPill(),
  MangaReader: new MANGA.MangaReader(),
  AsuraScans: new MANGA.AsuraScans(),
  WeebCentral: new MANGA.WeebCentral(),
};

export const defaultMangaProvider = mangaProviders.MangaDex;
export const mangaProviderList = Object.values(mangaProviders);
export const mangaProviderNames = Object.keys(mangaProviders);
export const mangaProviderMap = mangaProviderNames.reduce((acc, name, index) => {
  acc[name] = mangaProviderList[index];
  return acc;
}, {});

export const getMangaProviderByName = (name) => {
  return mangaProviderMap[name] || defaultMangaProvider;
};

//search for naruto in all providers
export const searchMangaInAllProviders = async (query) => {
  const results = {};
  for (const [name, provider] of Object.entries(mangaProviders)) {
    try {
      const instance = typeof provider === 'function' ? new provider() : provider;
      const searchResults = await instance.search(query);
      results[name] = searchResults;
    } catch (error) {
      results[name] = { error: error.message };
    }
  }
  return results;
};

searchMangaInAllProviders("naruto").then((results) => {
  console.log(JSON.stringify(results, null, 2));
});

