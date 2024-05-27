import { NEWS } from '../../src/providers';

jest.setTimeout(120000);

test('returns a filled array of news feeds', async () => {
  const ann = new NEWS.ANN();
  const data = await ann.fetchNewsFeeds();
  expect(data).not.toEqual([]);
});

test('returns a filled object of news data', async () => {
  const ann = new NEWS.ANN();
  const data = await ann.fetchNewsInfo(
    '2022-08-26/higurashi-no-naku-koro-ni-rei-oni-okoshi-hen-manga-ends/.188996'
  );
  expect(data.description).not.toEqual('');
});
