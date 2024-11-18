import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

const mangahost = new MANGA.MangaHost();

test('returns a filled array of manga', async () => {
  const data = await mangahost.search('punpun');

  expect(data.results).not.toEqual([]);
});
