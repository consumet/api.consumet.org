import { COMICS } from '../../src/providers';

jest.setTimeout(120000);

const comics = new COMICS.GetComics();

test('GetComics returns the correct page and is not empty', async () => {
  const data = await comics.search('adam', 2);
  expect(data.hasNextPage).toEqual(true);
});
