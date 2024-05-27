import { LIGHT_NOVELS } from '../../src/providers';

jest.setTimeout(120000);

const novelupdates = new LIGHT_NOVELS.NovelUpdates();

test('returns a filled array of light novels', async () => {
  const data = await novelupdates.search('slime');
  expect(data.results).not.toEqual([]);
});

test('returns a filled object of light novel info', async () => {
  const data = await novelupdates.fetchLightNovelInfo('you-are-the-daughter-of-my-first-love');
  expect(data.chapters).not.toEqual([]);
  expect(data.description).not.toEqual('');
});
