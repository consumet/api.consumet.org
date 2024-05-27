import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

// run: yarn test --watch --verbose false mangasee123.test.ts

const mangasee123 = new MANGA.Mangasee123();

test('Search: returns a filled array of manga.', async () => {
  const data = await mangasee123.search('Call of the Night');
  expect(data.results).not.toEqual([]);
});

test('fetchMangaInfo: returns filled manga info when given a mangaId.', async () => {
  const data = await mangasee123.fetchMangaInfo('Yofukashi-no-Uta');
  expect(data).not.toEqual({});
});

test('fetchChapterPages: returns filled page data when given a chapterId.', async () => {
  const data = await mangasee123.fetchChapterPages('Yofukashi-no-Uta-chapter-1');
  expect(data).not.toEqual([]);
});
