import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

const mangahere = new MANGA.MangaHere();

test('returns a filled array of manga', async () => {
  const data = await mangahere.search('slime');
  expect(data.results).not.toEqual([]);
});
