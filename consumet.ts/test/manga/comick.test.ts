import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

const comick = new MANGA.ComicK();

test('returns a filled array of manga', async () => {
  const data = await comick.search('one piece');
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of chapters', async () => {
  const data = await comick.search('one piece');
  const chapters = await comick.fetchMangaInfo(data.results[0].id);
  expect(chapters.chapters).not.toEqual([]);
});

test('returns a filled array of pages', async () => {
  const data = await comick.search('one piece');
  const chapters = await comick.fetchMangaInfo(data.results[0].id);
  const pages = await comick.fetchChapterPages(chapters.chapters![0].id);
  expect(pages).not.toEqual([]);
});
