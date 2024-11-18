import { MOVIES } from '../../src/providers';

jest.setTimeout(120000);

const goku = new MOVIES.Goku();

test('returns a filled array of movies/tv', async () => {
  const data = await goku.search('batman');
  expect(data.results).not.toEqual([]);
});

test('returns a filled object of movies data', async () => {
  const data = await goku.fetchMediaInfo('watch-movie/watch-batman-begins-19636');
  expect(data.description).not.toEqual('');
  expect(data.episodes).not.toEqual([]);
});

test('returns a filled object of streaming movie servers', async () => {
  const data = await goku.fetchEpisodeServers('1064170', 'watch-movie/watch-batman-begins-19636');
  expect(data).not.toEqual([]);
});

test('returns a filled object of streaming movie sources', async () => {
  const data = await goku.fetchEpisodeSources('1064170', 'watch-movie/watch-batman-begins-19636');
  expect(data.sources).not.toEqual([]);
});

test('returns a filled object of tv data', async () => {
  const data = await goku.fetchMediaInfo('watch-series/watch-batman-39276');
  expect(data.description).not.toEqual('');
  expect(data.episodes).not.toEqual([]);
});

test('returns a filled object of streaming tv servers', async () => {
  const data = await goku.fetchEpisodeServers('46259', 'watch-series/watch-batman-39276');
  expect(data).not.toEqual([]);
});

test('returns a filled object of streaming tv sources', async () => {
  const data = await goku.fetchEpisodeSources('46259', 'watch-series/watch-batman-39276');
  expect(data.sources).not.toEqual([]);
});

test('returns a filled object of recent movies', async () => {
  const data = await goku.fetchRecentMovies();
  expect(data).not.toEqual([]);
});

test('returns a filled object of recent tv shows', async () => {
  const data = await goku.fetchRecentTvShows();
  expect(data).not.toEqual([]);
});

test('returns a filled object of trending movies', async () => {
  const data = await goku.fetchTrendingMovies();
  expect(data).not.toEqual([]);
});

test('returns a filled object of trending tv shows', async () => {
  const data = await goku.fetchTrendingTvShows();
  expect(data).not.toEqual([]);
});
