import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

const mangadex = new MANGA.MangaDex();

test('returns a filled array of manga', async () => {
  const data = await mangadex.search('one piece');
  expect(data.results).not.toEqual([]);
});
