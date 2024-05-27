import { MOVIES } from '../../src/providers';

jest.setTimeout(120000);

// run: yarn test --watch --verbose false viewasian.test.ts

const kissAsian = new MOVIES.KissAsian();

test('Search: returns a filled array of movies/TV.', async () => {
  const data = await kissAsian.search('vincenzo');
  expect(data.results).not.toEqual([]);
});

test('fetchMediaInfo: returns filled movie/TV info when given a mediaId.', async () => {
  const data = await kissAsian.fetchMediaInfo('Drama/Vincenzo');
  expect(data).not.toEqual({});
});

test('fetchEpisodeServers: returns filled object of streaming sources when given an episodeId.', async () => {
  const data = await kissAsian.fetchEpisodeServers('Drama/Vincenzo/Episode-1?id=62565');
  expect(data).not.toEqual({});
});

test('fetchEpisodeSources: returns filled object of streaming sources when given an episodeId.', async () => {
  const data = await kissAsian.fetchEpisodeSources('Drama/Vincenzo/Episode-1?id=62565');
  expect(data).not.toEqual({});
});
