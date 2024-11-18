import axios, { AxiosAdapter } from 'axios';

import {
  AnimeParser,
  ISearch,
  IAnimeInfo,
  MediaStatus,
  IAnimeResult,
  ISource,
  IAnimeEpisode,
  IEpisodeServer,
  ISubtitle,
  SubOrSub,
  ProxyConfig,
} from '../../models';
import { USER_AGENT } from '../../utils';

class Crunchyroll extends AnimeParser {
  override readonly name = 'Crunchyroll';
  protected override baseUrl = 'https://cronchy.consumet.stream';
  protected override logo =
    'https://play-lh.googleusercontent.com/CjzbMcLbmTswzCGauGQExkFsSHvwjKEeWLbVVJx0B-J9G6OQ-UCl2eOuGBfaIozFqow';
  protected override classPath = `ANIME.${this.name}`;

  private locale = 'en-US';
  private TOKEN: any | undefined = undefined;

  private get options() {
    return {
      headers: {
        'User-Agent': USER_AGENT,
        Authorization: 'Bearer ' + this.TOKEN?.access_token,
      },
    };
  }

  private locales = [
    '[ar-ME] Arabic',
    '[ar-SA] Arabic (Saudi Arabia)',
    '[de-DE] German',
    '[en-US] English',
    '[es-419] Spanish (Latin America)',
    '[es-ES] Spanish (Spain)',
    '[fr-FR] French',
    '[he-IL] Hebrew',
    '[it-IT] Italian',
    '[pt-BR] Portuguese (Brazil)',
    '[pt-PT] Portuguese (Portugal)',
    '[pl-PL] Polish',
    '[ru-RU] Russian',
    '[ro-RO] Romanian',
    '[sv-SE] Swedish',
    '[tr-TR] Turkish',
    '[uk-UK] Ukrainian',
    '[zh-CN] Chinese (Simplified)',
    '[zh-TW] Chinese (Traditional)',
  ];

  private subOrder = [
    'Subbed',
    'English Dub',
    'German Dub',
    'French Dub',
    'Spanish Dub',
    'Italian Dub',
    'Portuguese Dub',
  ];

  static async create(
    locale?: string,
    token?: string,
    accessToken?: string,
    proxyConfig?: ProxyConfig,
    adapter?: AxiosAdapter
  ) {
    const instance = new Crunchyroll(proxyConfig, adapter);
    instance.TOKEN = instance.TOKEN ?? (await axios.get(`${instance.baseUrl}/token`)).data;
    return instance;
  }

  /**
   * @param query Search query
   */
  override search = async (query: string): Promise<ISearch<IAnimeResult>> => {
    try {
      const { data } = await this.client.get(`${this.baseUrl}/search/${query}`, this.options);

      return data;
    } catch (error) {
      throw new Error(`Couldn't fetch data from ${this.name}`);
    }
  };

  /**
   * @param id Anime id
   * @param mediaType Anime type (series, movie)
   * @param fetchAllSeasons Fetch all episode seasons
   */
  override fetchAnimeInfo = async (
    id: string,
    mediaType: string,
    fetchAllSeasons: boolean = false
  ): Promise<IAnimeInfo> => {
    if (mediaType == 'series') {
      const { data } = await this.client.get(
        `${this.baseUrl}/info/${id}?type=${mediaType}&fetchAllSeasons=${fetchAllSeasons}`,
        this.options
      );

      return data;
    } else {
      throw new Error("Couldn't fetch data from Crunchyroll");
    }
  };

  /**
   *
   * @param episodeId Episode id
   * @param format subtitle format (default: `srt`) (srt, vtt, ass)
   * @param type Video type (default: `adaptive_hls` (m3u8)) `adaptive_dash` (dash), `drm_adaptive_dash` (dash with drm)
   */
  override fetchEpisodeSources = async (episodeId: string): Promise<ISource> => {
    const { data } = await this.client.get(`${this.baseUrl}/episode/${episodeId}`, this.options);
    //TODO: Add hardcoded subtitles for all languages
    return data;
  };

  /**
   *
   * @param episodeId Episode id
   */
  override fetchEpisodeServers = (episodeId: string): Promise<IEpisodeServer[]> => {
    throw new Error('Method not implemented.');
  };
}

export default Crunchyroll;

// (async () => {
//   const crunchyroll = await Crunchyroll.create();
//   const search = await crunchyroll.search('spy-x-family');
//   const res = await crunchyroll.fetchAnimeInfo(search.results[0].id, search.results[0].type!);
//   const sources = await crunchyroll.fetchEpisodeSources(res.episodes![res.episodes?.length! - 1].id);
// })();
