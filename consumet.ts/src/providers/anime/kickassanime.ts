import { load } from 'cheerio';

import {
  AnimeParser,
  ISearch,
  IAnimeInfo,
  MediaStatus,
  IAnimeResult,
  ISource,
  IAnimeEpisode,
  IEpisodeServer,
} from '../../models';

/**
 * @attention Cloudflare bypass is **REQUIRED**.
 */
class KickAssAnime extends AnimeParser {
  override readonly name = 'KickAssAnime';
  protected override baseUrl = 'https://www2.kickassanime.ro';
  protected override logo =
    'https://user-images.githubusercontent.com/65111632/95666535-4f6dba80-0ba6-11eb-8583-e3a2074590e9.png';
  protected override classPath = 'ANIME.KickAssAnime';

  /**
   * @param query Search query
   */
  override search = async (query: string): Promise<ISearch<IAnimeResult>> => {
    throw new Error('Method not implemented.');
  };

  /**
   * @param id Anime id
   */
  override fetchAnimeInfo = async (id: string): Promise<IAnimeInfo> => {
    throw new Error('Method not implemented.');
  };

  /**
   *
   * @param episodeId Episode id
   */
  override fetchEpisodeSources = async (episodeId: string): Promise<ISource> => {
    throw new Error('Method not implemented.');
  };

  /**
   *
   * @param episodeId Episode id
   */
  override fetchEpisodeServers = (episodeId: string): Promise<IEpisodeServer[]> => {
    throw new Error('Method not implemented.');
  };
}

export default KickAssAnime;
