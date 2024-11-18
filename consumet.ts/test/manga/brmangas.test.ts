import { MANGA } from '../../src/providers';

jest.setTimeout(120000);

const brmangas = new MANGA.BRMangas();

test('returns a filled array of manga', async () => {
  const data = await brmangas.search('punpun');

  expect(data.results).not.toEqual([]);
});
