import { MOVIES } from '../../src/providers';

jest.setTimeout(120000);

// run: yarn test --watch --verbose false dramacool.test.ts

const dramaCool = new MOVIES.DramaCool();

test('Search: returns a filled array of movies/TV.', async () => {
  const data = await dramaCool.search('Vincenzo');
  expect(data.results).not.toEqual([]);
});

test('fetchMediaInfo: returns filled movie/TV info when given a mediaId.', async () => {
  const data = await dramaCool.fetchMediaInfo('drama-detail/vincenzo');
  expect(data).not.toEqual({});
});

test('fetchEpisodeServers: returns filled object of streaming sources when given an episodeId.', async () => {
  const data = await dramaCool.fetchEpisodeServers('vincenzo-2021-episode-1');
  expect(data).not.toEqual({});
});

test('fetchEpisodeSources: returns filled object of streaming sources when given an episodeId.', async () => {
  const data = await dramaCool.fetchEpisodeSources('vincenzo-2021-episode-1');
  expect(data).not.toEqual({});
});

test('fetchMediaInfo: returns genres list when given a mediaId.', async () => {
  const data = await dramaCool.fetchMediaInfo('drama-detail/vincenzo');
  expect(data.genres?.length).not.toEqual([]);
});

test('fetchMediaInfo: returns status when given a mediaId.', async () => {
  const data = await dramaCool.fetchMediaInfo('drama-detail/vincenzo');
  expect(data.status).not.toEqual(undefined);
});

test('fetchMediaInfo: returns duration (if available) when given a mediaId.', async () => {
  const data = await dramaCool.fetchMediaInfo('drama-detail/kimi-ga-kokoro-wo-kuretakara');
  expect(data.duration).not.toEqual(undefined);
});

test('Search: returns totalPages when search: Love.', async () => {
  const data = await dramaCool.search('Love');
  expect(data.totalPages).not.toEqual(1);
});