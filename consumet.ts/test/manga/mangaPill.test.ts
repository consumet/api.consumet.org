import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

// run: yarn test --watch --verbose false mangapill.test.ts

const mangaPill = new MANGA.MangaPill();

test('Search: returns a filled array of manga.', async () => {
  const data = await mangaPill.search('one piece');
  expect(data.results).not.toEqual([]);
});

test('fetchMangaInfo: returns filled manga info when given a mangaId.', async () => {
  const data = await mangaPill.fetchMangaInfo('2/one-piece');
  expect(data).not.toEqual({});
});

test('fetchChapterPages: returns filled page data when given a chapterId.', async () => {
  const data = await mangaPill.fetchChapterPages('2-11069000/one-piece-chapter-1069');
  expect(data).not.toEqual([]);
});
