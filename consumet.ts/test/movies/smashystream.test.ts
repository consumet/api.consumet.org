import { MOVIES } from '../../src/providers';

jest.setTimeout(120000);

const smashyStream = new MOVIES.SmashyStream();

test('returns a filled object of streaming movie servers', async () => {
  const data = await smashyStream.fetchEpisodeServers('697843');
  expect(data).not.toEqual([]);
});

test('returns a filled object of streaming movie sources', async () => {
  const data = await smashyStream.fetchEpisodeSources('697843', undefined, undefined, 'Player F');
  expect(data.sources).not.toEqual([]);
});

test('returns a filled object of streaming movie sources for all players', async () => {
  const data = await smashyStream.fetchEpisodeSources('697843');
  expect(data.sources).not.toEqual([]);
});

test('returns a filled object of streaming tv servers', async () => {
  const data = await smashyStream.fetchEpisodeServers('1399', 1, 10);
  expect(data).not.toEqual([]);
});

test('returns a filled object of streaming tv sources', async () => {
  const data = await smashyStream.fetchEpisodeSources('1399', 1, 1, 'Player F');
  expect(data.sources).not.toEqual([]);
});

test('returns a filled object of streaming tv sources for all players', async () => {
  const data = await smashyStream.fetchEpisodeSources('1399', 1, 1);
  expect(data.sources).not.toEqual([]);
});
