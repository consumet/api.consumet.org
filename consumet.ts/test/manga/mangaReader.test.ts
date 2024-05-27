import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

// run: yarn test --watch --verbose false mangareader.test.ts

const mangaReader = new MANGA.MangaReader();

test('Search: returns a filled array of manga.', async () => {
  const data = await mangaReader.search('one piece');
  expect(data.results).not.toEqual([]);
});

test('fetchMangaInfo: returns filled manga info when given a mangaId.', async () => {
  const data = await mangaReader.fetchMangaInfo('one-piece-colored-edition-55493');
  expect(data).not.toEqual({});
});

test('fetchChapterPages: returns filled page data when given a chapterId.', async () => {
  const data = await mangaReader.fetchChapterPages('one-piece-colored-edition-55493/en/chapter-1004');
  expect(data).not.toEqual([]);
});
