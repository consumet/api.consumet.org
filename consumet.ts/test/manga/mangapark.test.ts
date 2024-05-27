import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

// run: yarn test --watch --verbose false mangapark.test.ts

const mangapark = new MANGA.Mangapark();

test('Search: returns a filled array of manga.', async () => {
  const data = await mangapark.search('Demon Slayer');
  expect(data.results).not.toEqual([]);
});

test('fetchMangaInfo: returns filled manga info when given a mangaId.', async () => {
  const data = await mangapark.fetchMangaInfo('kimetsu-no-yaiba-gotouge-koyoharu');
  expect(data).not.toEqual({});
});

test('fetchChapterPages: returns filled page data when given a chapterId.', async () => {
  const data = await mangapark.fetchChapterPages('kimetsu-no-yaiba-gotouge-koyoharu/i2325814');
  expect(data).not.toEqual([]);
});
