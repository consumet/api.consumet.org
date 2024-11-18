import {
  MovieParser,
  TvType,
  IMovieInfo,
  IEpisodeServer,
  ISource,
  IMovieResult,
  ISearch,
} from '../../models';
import { load } from 'cheerio';
import { SmashyStream as SS } from '../../extractors';

class SmashyStream extends MovieParser {
  override readonly name = 'Smashystream';
  protected override baseUrl = 'https://embed.smashystream.com';
  protected override logo = 'https://smashystream.xyz/logo.png';
  protected override classPath = 'MOVIES.SmashyStream';
  override supportedTypes = new Set([TvType.MOVIE, TvType.TVSERIES]);

  override search = async (): Promise<ISearch<IMovieResult>> => {
    throw new Error('Method not implemented.');
  };

  override fetchMediaInfo = async (): Promise<IMovieInfo> => {
    throw new Error('Method not implemented.');
  };

  override fetchEpisodeServers = async (
    tmdbId: string,
    season?: number,
    episode?: number
  ): Promise<IEpisodeServer[]> => {
    try {
      const epsiodeServers: IEpisodeServer[] = [];

      let url = `${this.baseUrl}/playere.php?tmdb=${tmdbId}`;
      if (season) {
        url = `${this.baseUrl}/playere.php?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      }
      const { data } = await this.client.get(url);
      const $ = load(data);

      await Promise.all(
        $('div#_default-servers a.server')
          .map(async (i, el) => {
            const streamLink = $(el).attr('data-id') ?? '';

            epsiodeServers.push({
              name: $(el).text().replace(/  +/g, ' ').trim(),
              url: streamLink,
            });
          })
          .get()
      );

      return epsiodeServers;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  override fetchEpisodeSources = async (
    tmdbId: string,
    season?: number,
    episode?: number,
    server?: string
  ): Promise<ISource> => {
    try {
      const servers = await this.fetchEpisodeServers(tmdbId, season, episode);
      const selectedServer = servers.find(s => s.name.toLowerCase() === server?.toLowerCase());

      if (!selectedServer) {
        let url = `${this.baseUrl}/playere.php?tmdb=${tmdbId}`;
        if (season) {
          url = `${this.baseUrl}/playere.php?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
        }

        return {
          headers: { Referer: this.baseUrl },
          ...(await new SS(this.proxyConfig, this.adapter).extract(new URL(url))),
        };
      }

      if (selectedServer.url.includes('/ffix')) {
        return {
          headers: { Referer: this.baseUrl },
          ...(await new SS(this.proxyConfig, this.adapter).extractSmashyFfix(selectedServer.url)),
        };
      }

      if (selectedServer.url.includes('/watchx')) {
        return {
          headers: { Referer: this.baseUrl },
          ...(await new SS(this.proxyConfig, this.adapter).extractSmashyWatchX(selectedServer.url)),
        };
      }

      if (selectedServer.url.includes('/nflim')) {
        return {
          headers: { Referer: this.baseUrl },
          ...(await new SS(this.proxyConfig, this.adapter).extractSmashyNFlim(selectedServer.url)),
        };
      }

      if (selectedServer.url.includes('/fx')) {
        return {
          headers: { Referer: this.baseUrl },
          ...(await new SS(this.proxyConfig, this.adapter).extractSmashyFX(selectedServer.url)),
        };
      }

      if (selectedServer.url.includes('/cf')) {
        return {
          headers: { Referer: this.baseUrl },
          ...(await new SS(this.proxyConfig, this.adapter).extractSmashyCF(selectedServer.url)),
        };
      }

      if (selectedServer.url.includes('/eemovie')) {
        return {
          headers: { Referer: this.baseUrl },
          ...(await new SS(this.proxyConfig, this.adapter).extractSmashyEEMovie(selectedServer.url)),
        };
      }

      return await this.fetchEpisodeSources(selectedServer.url, season, episode, server);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default SmashyStream;
