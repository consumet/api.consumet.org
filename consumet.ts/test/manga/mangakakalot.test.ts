import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

const mangakakalot = new MANGA.MangaKakalot();

test('returns a filled array of manga', async () => {
  const data = await mangakakalot.search('Tomodachi Game');
  expect(data.results).not.toEqual([]);
});
