import { ANIME } from '../../src/providers';

jest.setTimeout(120000);

const animesaturn = new ANIME.AnimeSaturn();
const animeName = 'Tokyo Revengers';

test('returns a filled array of anime list', async () => {
  const data = await animesaturn.search(animeName);
  expect(data.results).not.toEqual([]);
});

test('returns a filled object of anime data', async () => {
  const res = await animesaturn.search(animeName);
  const data = await animesaturn.fetchAnimeInfo(res.results[0].id);
  expect(data).not.toBeNull();
  expect(data.description).not.toBeNull();
  expect(data.episodes).not.toEqual([]);
});

test('returns a filled object of episode sources', async () => {
  const res = await animesaturn.search(animeName);
  const info = await animesaturn.fetchAnimeInfo(res.results[0].id);
  const data = await animesaturn.fetchEpisodeSources(info.episodes![0].id);
  expect(data.sources).not.toEqual([]);
});
