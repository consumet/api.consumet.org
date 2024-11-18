import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

const flame = new MANGA.FlameScans();

test('returns a filled array of manga', async () => {
  const data = await flame.search('returners magic');
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of chapters', async () => {
  const data = await flame.search('returners magic');
  const chapters = await flame.fetchMangaInfo(data.results[0].id);
  expect(chapters.chapters).not.toEqual([]);
});

test('returns a filled array of pages', async () => {
  const data = await flame.search('returners magic');
  const chapters = await flame.fetchMangaInfo(data.results[0].id);
  const pages = await flame.fetchChapterPages(chapters.chapters![0].id);
  expect(pages).not.toEqual([]);
});
