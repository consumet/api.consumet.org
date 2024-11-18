import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

const asura = new MANGA.AsuraScans();

test('returns a filled array of manga', async () => {
  const data = await asura.search('solo leveling');
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of chapters', async () => {
  const data = await asura.search('solo leveling');
  const chapters = await asura.fetchMangaInfo(data.results[0].id);
  expect(chapters.chapters).not.toEqual([]);
});

test('returns a filled array of pages', async () => {
  const data = await asura.search('solo leveling');
  const chapters = await asura.fetchMangaInfo(data.results[0].id);
  const pages = await asura.fetchChapterPages(chapters.chapters![0].id);
  expect(pages).not.toEqual([]);
});
