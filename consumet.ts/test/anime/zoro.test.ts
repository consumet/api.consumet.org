import { ANIME } from '../../src/providers';

jest.setTimeout(120000);

const zoro = new ANIME.Zoro("hianime.to");

test('returns a filled array of anime list', async () => {
  const data = await zoro.search('Overlord IV');
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of anime list', async () => {
  const data = await zoro.fetchTopAiring();
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of anime list', async () => {
  const data = await zoro.fetchMostPopular();
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of anime list', async () => {
  const data = await zoro.fetchMostFavorite();
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of anime list', async () => {
  const data = await zoro.fetchLatestCompleted();
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of anime list', async () => {
  const data = await zoro.fetchRecentlyUpdated();
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of anime list', async () => {
  const data = await zoro.fetchRecentlyAdded();
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of anime list', async () => {
  const data = await zoro.fetchTopUpcoming();
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of anime list', async () => {
  const data = await zoro.fetchStudio('studio-pierrot')
  expect(data.results).not.toEqual([]);
})

test('returns a filled array of anime list', async () => {
  const data = await zoro.fetchSchedule();
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of anime list', async () => {
  const data = await zoro.fetchSpotlight();
  expect(data.results).not.toEqual([]);
});

test('returns a filled array of anime list', async () => {
  const data = await zoro.fetchSearchSuggestions("one piece");
  console.log(data);
  expect(data.results).not.toEqual([]);
})

test('returns a filled object of anime data', async () => {
  const res = await zoro.search('Overlord IV');
  const data = await zoro.fetchAnimeInfo("one-piece-100"); // Overlord IV id
  expect(data).not.toBeNull();
  expect(data.description).not.toBeNull();
  expect(data.episodes).not.toEqual([]);
});

test('returns a filled object of episode sources', async () => {
  const res = await zoro.search('Overlord IV');
  const info = await zoro.fetchAnimeInfo(res.results[3].id);
  const data = await zoro.fetchEpisodeSources(info.episodes![0].id); // Overlord IV episode 1 id
  expect(data.sources).not.toEqual([]);
});
