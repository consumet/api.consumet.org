import { Cheerio, load } from 'cheerio';

import {
  AnimeParser,
  ISearch,
  IAnimeInfo,
  MediaStatus,
  IAnimeResult,
  ISource,
  IAnimeEpisode,
  IEpisodeServer,
  StreamingServers,
} from '../../models';

import { StreamTape } from '../../utils';
import { Mp4Player } from '../../extractors';

class AnimeSaturn extends AnimeParser {
  override readonly name = 'AnimeSaturn';
  protected override baseUrl = 'https://www.animesaturn.tv/';
  protected override logo = 'https://www.animesaturn.tv/immagini/favicon-32x32.png';
  protected override classPath = 'ANIME.AnimeSaturn';

  /**
   * @param query Search query
   */
  override search = async (query: string): Promise<ISearch<IAnimeResult>> => {
    // baseUrl/animelist?search={query}

    const data = await this.client.get(`${this.baseUrl}animelist?search=${query}`);

    const $ = await load(data.data);

    if (!$) return { results: [] };

    const res: {
      hasNextPage: boolean;
      results: IAnimeResult[];
    } = {
      hasNextPage: false,
      results: [],
    };

    $('ul.list-group li').each((i, element) => {
      const item: IAnimeResult = {
        id: $(element)?.find('a.thumb')?.attr('href')?.split('/')?.pop() ?? '',
        title: $(element)?.find('h3 a')?.text(),
        image: $(element)?.find('img.copertina-archivio')?.attr('src'),
        url: $(element)?.find('h3 a')?.attr('href'),
      };

      if (!item.id) throw new Error('Invalid id');

      res.results.push(item);
    });

    return res;
  };

  /**
   * @param id Anime id
   */
  override fetchAnimeInfo = async (id: string): Promise<IAnimeInfo> => {
    const data = await this.client.get(`${this.baseUrl}anime/${id}`);
    const $ = await load(data.data);

    const info: IAnimeInfo = {
      id,
      title: $('div.container.anime-title-as> b').text(),
      malID: $('a[href^="https://myanimelist.net/anime/"]').attr('href')?.slice(30, -1),
      alID: $('a[href^="https://anilist.co/anime/"]').attr('href')?.slice(25, -1),
      genres:
        $('div.container a.badge.badge-light')
          ?.map((i, element): string => {
            return $(element).text();
          })
          .toArray() ?? undefined,
      image: $('img.img-fluid')?.attr('src') || undefined,
      cover:
        $('div.banner')
          ?.attr('style')
          ?.match(/background:\s*url\(['"]?([^'")]+)['"]?\)/i)?.[1] || undefined,
      description: $('#full-trama').text(),
      episodes: [],
    };

    const episodes: IAnimeEpisode[] = [];

    $('.tab-pane.fade').each((i, element) => {
      $(element)
        .find('.bottone-ep')
        .each((i, element) => {
          const link = $(element).attr('href');
          const episodeNumber = $(element).text().trim().replace('Episodio ', '').trim();

          episodes.push({
            number: parseInt(episodeNumber),
            id: link?.split('/')?.pop() ?? '',
          });
        });
    });

    info.episodes = episodes.sort((a, b) => a.number - b.number);

    return info;
  };

  /**
   *
   * @param episodeId Episode id
   */
  override fetchEpisodeSources = async (episodeId: string): Promise<ISource> => {
    const fakeData = await this.client.get(`${this.baseUrl}ep/${episodeId}`);
    const $2 = await load(fakeData.data);

    const serverOneUrl = $2("div > a:contains('Guarda lo streaming')").attr('href'); // scrape from server 1 (m3u8 and mp4 urls)
    if (serverOneUrl == null) throw new Error('Invalid url');

    let data = await this.client.get(serverOneUrl);
    let $ = await load(data.data);

    const sources: ISource = {
      headers: {},
      subtitles: [],
      sources: [],
    };

    // M3U8 and MP4
    const scriptTag = $('script').filter(function () {
      return $(this).text().includes("jwplayer('player_hls')");
    });

    let serverOneSource: string | undefined;

    // m3u8
    scriptTag.each((i, element) => {
      const scriptText = $(element).text();

      scriptText.split('\n').forEach(line => {
        if (line.includes('file:') && !serverOneSource) {
          serverOneSource = line
            .split('file:')[1]
            .trim()
            .replace(/'/g, '')
            .replace(/,/g, '')
            .replace(/"/g, '');
        }
      });
    });

    // mp4
    if (!serverOneSource) {
      serverOneSource = $('#myvideo > source').attr('src');
    }

    if (!serverOneSource) throw new Error('Invalid source');

    sources.sources.push({
      url: serverOneSource,
      isM3U8: serverOneSource.includes('.m3u8'),
    });

    if (serverOneSource.includes('.m3u8')) {
      sources.subtitles?.push({
        url: serverOneSource.replace('playlist.m3u8', 'subtitles.vtt'),
        lang: 'Spanish',
      });
    }

    // STREAMTAPE
    const serverTwoUrl = serverOneUrl + '&server=1'; // scrape from server 2 (streamtape)
    data = await this.client.get(serverTwoUrl);
    $ = await load(data.data);

    const videoUrl = $('.embed-container > iframe').attr('src');
    const serverTwoSource = await new StreamTape(this.proxyConfig, this.adapter).extract(new URL(videoUrl!));

    if (!serverTwoSource) throw new Error('Invalid source');

    sources.sources.push({
      url: serverTwoSource[0].url,
      isM3U8: serverTwoSource[0].isM3U8,
    });

    return sources;
  };

  /**
   *
   * @param episodeId Episode id
   */
  override fetchEpisodeServers = (episodeId: string): Promise<IEpisodeServer[]> => {
    throw new Error('Method not implemented.');
  };
}

export default AnimeSaturn;

// Test this dog code
// const animeSaturn = new AnimeSaturn();

/*animeSaturn.search('naruto').then((res) => {
console.log(res);

  animeSaturn.fetchAnimeInfo(res.results[0].id).then((res) => {
    console.log(res);

    animeSaturn.fetchEpisodeSources(res?.episodes?.at(0)?.id || "0").then((res) => {
      console.log(res);
    })
  });
});*/
