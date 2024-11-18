import { MOVIES } from '../../src/providers';

jest.setTimeout(120000);

const turk = new MOVIES.Turkish();

test('returns a filled array of tv', async () => {
  const data = await turk.search('sen');
  expect(data).not.toEqual([]);
});

test('returns info of movie', async () => {
  const data = await turk.fetchMediaInfo('sen-cal-kapimi');
  expect(data.episodes).not.toEqual([]);
  expect(data.title).not.toEqual('');
});

test('returns a m3u8 links', async () => {
  const data = await turk.fetchEpisodeSources('sen-cal-kapimi-episode-2');
  expect(data.sources[0].url).not.toEqual('');
});
