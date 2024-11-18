import { ANIME } from '../../src/providers';

jest.setTimeout(120000);

const animefox = new ANIME.AnimeFox();

test('returns a filled array of anime list', async () => {
  const animefox = new ANIME.AnimeFox();
  const data = await animefox.search('Overlord IV');
  expect(data.results).not.toEqual([]);
});

test('returns a filled object of anime data', async () => {
  const res = await animefox.search('Overlord IV');
  const data = await animefox.fetchAnimeInfo(res.results[0].id); // Overlord IV id
  expect(data).not.toBeNull();
  expect(data.description).not.toBeNull();
  expect(data.episodes).not.toEqual([]);
});

test('returns a filled array of recent animes', async () => {
  const data = await animefox.fetchRecentEpisodes();
  expect(data.results).not.toEqual([]);
});

test('returns a filled object of episode sources', async () => {
  const data = await animefox.fetchEpisodeSources('overlord-iv-episode-1');
  expect(data.sources).not.toEqual([]);
});
