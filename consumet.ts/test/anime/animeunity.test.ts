import { ANIME } from '../../src/providers';

jest.setTimeout(120000);

const animeunity = new ANIME.AnimeUnity()
const animeName = 'Demon Slayer: Kimetsu no Yaiba Hashira Training Arc';

test('returns a filled array of anime list', async () => {
    const data = await animeunity.search(animeName);
    expect(data.results).not.toEqual([]);
});

test('returns a filled object of anime data', async () => {
    const res = await animeunity.search(animeName);
    const data = await animeunity.fetchAnimeInfo(res.results[0].id, 1);
    expect(data).not.toBeNull();
    expect(data.results).not.toEqual([]);
});

test('returns a filled object of episode sources', async () => {
    const res = await animeunity.search(animeName);
    const info = await animeunity.fetchAnimeInfo(res.results[0].id, 1);
    const data = await animeunity.fetchEpisodeSources(info.episodes![0].id)
    expect(data.sources).not.toEqual([]);
});
