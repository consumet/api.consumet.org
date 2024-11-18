import { META } from '../../src/providers';

jest.setTimeout(120000);

const anilist = new META.Anilist();

test('returns a filled array of anime list', async () => {
  const data = await anilist.search('spy x family');
  expect(data.results).not.toEqual([]);
});

test('returns a filled object of anime data', async () => {
  const data = await anilist.fetchAnimeInfo('140960');
  expect(data).not.toBeNull();
  expect(data.episodes).not.toEqual([]);
  expect(data.description).not.toBeNull();
});

test('returns episodes for sub and dub not available', async () => {
  const subData = await anilist.fetchEpisodesListById('949', false);
  expect(subData).not.toBeNull();
  expect(subData).not.toEqual([]);

  const dubData = await anilist.fetchEpisodesListById('949', true);
  expect(dubData).not.toBeNull();
  expect(dubData).not.toEqual([]);
});

test('returns a filled array of servers', async () => {
  const data = await anilist.fetchEpisodeServers('spy-x-family-episode-9');
  expect(data).not.toEqual([]);
});

test('returns a filled object of episode sources', async () => {
  const data = await anilist.fetchEpisodeSources('spy-x-family-episode-9');
  expect(data.sources).not.toEqual([]);
});

test('returns a filled array of trending anime', async () => {
  const data = await anilist.fetchTrendingAnime(1, 10);
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of popular anime', async () => {
  const data = await anilist.fetchPopularAnime(1, 10);
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of airing schedule', async () => {
  const weekStart = Math.ceil(Date.now() / 1000);
  const data = await anilist.fetchAiringSchedule(1, 20, weekStart, weekStart + 604800, true);
  expect(data.results).not.toEqual([]);
});
('');
