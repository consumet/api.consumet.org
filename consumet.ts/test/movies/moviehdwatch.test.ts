import { MOVIES } from '../../src/providers';

jest.setTimeout(120000);

const moviesHd = new MOVIES.MovieHdWatch();

test('returns a filled array of movies/tv', async () => {
  const data = await moviesHd.search('batman');
  expect(data.results).not.toEqual([]);
});

test('returns a filled object of movies data', async () => {
  const data = await moviesHd.fetchMediaInfo('movie/watch-the-batman-online-16076');
  expect(data.description).not.toEqual('');
  expect(data.episodes).not.toEqual([]);
});

test('returns a filled object of streaming movie servers', async () => {
  const data = await moviesHd.fetchEpisodeServers('16076', 'movie/watch-the-batman-online-16076');
  expect(data).not.toEqual([]);
});

test('returns a filled object of streaming movie sources', async () => {
  const data = await moviesHd.fetchEpisodeSources('16076', 'movie/watch-the-batman-online-16076');
  expect(data.sources).not.toEqual([]);
});

test('returns a filled object of tv data', async () => {
  const data = await moviesHd.fetchMediaInfo('tv/watch-batman-online-39276');
  expect(data.description).not.toEqual('');
  expect(data.episodes).not.toEqual([]);
});

test('returns a filled object of streaming tv servers', async () => {
  const data = await moviesHd.fetchEpisodeServers('46259', 'tv/watch-batman-online-39276');
  expect(data).not.toEqual([]);
});

test('returns a filled object of streaming tv sources', async () => {
  const data = await moviesHd.fetchEpisodeSources('46259', 'tv/watch-batman-online-39276');
  expect(data.sources).not.toEqual([]);
});

test('returns a filled object of recent movies', async () => {
  const data = await moviesHd.fetchRecentMovies();
  expect(data).not.toEqual([]);
});

test('returns a filled object of recent tv shows', async () => {
  const data = await moviesHd.fetchRecentTvShows();
  expect(data).not.toEqual([]);
});

test('returns a filled object of trending movies', async () => {
  const data = await moviesHd.fetchTrendingMovies();
  expect(data).not.toEqual([]);
});

test('returns a filled object of trending tv shows', async () => {
  const data = await moviesHd.fetchTrendingTvShows();
  expect(data).not.toEqual([]);
});
