import { MOVIES } from '../../src/providers';

jest.setTimeout(120000);

const flixhq = new MOVIES.FlixHQ();

test('returns a filled array of movies/tv', async () => {
  const data = await flixhq.search('vincenzo');
  expect(data.results).not.toEqual([]);
});

test('returns a filled object of movies/tv data', async () => {
  const data = await flixhq.fetchMediaInfo('tv/watch-vincenzo-67955');
  expect(data.description).not.toEqual('');
  expect(data.episodes).not.toEqual([]);
});

test('returns a filled object of streaming sources', async () => {
  const episodeSources = await flixhq.fetchEpisodeSources('1167571', 'tv/watch-vincenzo-67955');
  expect(episodeSources.sources).not.toEqual([]);
});

test('returns a filled object of movies/tv data by country', async () => {
  const data = await flixhq.fetchByCountry('KR');
  expect(data.results).not.toEqual([]);
});

test('returns a filled object of movies/tv data by genre', async () => {
  const data = await flixhq.fetchByGenre('drama');
  expect(data.results).not.toEqual([]);
});
