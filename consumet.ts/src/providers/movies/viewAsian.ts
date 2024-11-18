import { AxiosAdapter } from 'axios';
import { load } from 'cheerio';

import {
  MovieParser,
  TvType,
  IMovieInfo,
  IEpisodeServer,
  StreamingServers,
  ISource,
  IMovieResult,
  ISearch,
  ProxyConfig,
} from '../../models';
import { MixDrop, AsianLoad, StreamTape, StreamSB } from '../../extractors';

class ViewAsian extends MovieParser {
  override readonly name = 'ViewAsian';
  protected override baseUrl = 'https://viewasian.co';
  protected override logo = 'https://viewasian.co/images/logo.png';
  protected override classPath = 'MOVIES.ViewAsian';
  override supportedTypes = new Set([TvType.MOVIE, TvType.TVSERIES]);

  override search = async (query: string, page: number = 1): Promise<ISearch<IMovieResult>> => {
    const searchResult: ISearch<IMovieResult> = {
      currentPage: page,
      hasNextPage: false,
      results: [],
    };

    try {
      const { data } = await this.client.get(
        `${this.baseUrl}/movie/search/${query.replace(/[\W_]+/g, '-')}?page=${page}`
      );

      const $ = load(data);

      const navSelector = 'div#pagination > nav:nth-child(1) > ul:nth-child(1)';

      searchResult.hasNextPage =
        $(navSelector).length > 0 ? !$(navSelector).children().last().hasClass('active') : false;

      $('.movies-list-full > div.ml-item').each((i, el) => {
        const releaseDate = $(el).find('div.ml-item > div.mli-info > span:nth-child(1)').text();
        searchResult.results.push({
          id: $(el).find('a').attr('href')?.slice(1)!,
          title: $(el).find('a').attr('title')!,
          url: `${this.baseUrl}${$(el).find('a').attr('href')}`,
          image: $(el).find('a > img').attr('data-original'),
          releaseDate: isNaN(parseInt(releaseDate)) ? undefined : releaseDate,
          //   type:
          //     $(el)
          //       .find("div.film-detail > div.fd-infor > span.float-right")
          //       .text() === "Movie"
          //       ? TvType.MOVIE
          //       : TvType.TVSERIES,
        });
      });

      return searchResult;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  override fetchMediaInfo = async (mediaId: string): Promise<IMovieInfo> => {
    const realMediaId = mediaId;
    if (!mediaId.startsWith(this.baseUrl))
      mediaId = `${this.baseUrl}/watch/${mediaId.split('/').slice(1)}/watching.html`;

    const mediaInfo: IMovieInfo = {
      id: '',
      title: '',
    };

    try {
      const { data } = await this.client.get(mediaId);

      const $ = load(data);

      mediaInfo.id = realMediaId;
      mediaInfo.title = $('.detail-mod h3').text();
      mediaInfo.banner = $('.detail-mod > dm-thumb > img').attr('src');
      mediaInfo.otherNames = $('.other-name a')
        .map((i, el) => $(el).attr('title')!.trim())
        .get();
      mediaInfo.description = $('.desc').text().trim();
      mediaInfo.genre = $('.mvic-info p:contains(Genre) > a')
        .map((i, el) => $(el).text().split(',').join('').trim())
        .get();
      mediaInfo.description = $('.desc').text().trim();
      //   mediaInfo.status = $('.mvic-info p:contains(Status)').text().replace('Status: ', '').trim();
      mediaInfo.director = $('.mvic-info p:contains(Director)').text().replace('Director: ', '').trim();
      mediaInfo.country = $('.mvic-info p:contains(Country) a').text().trim();
      mediaInfo.releaseDate = $('.mvic-info p:contains(Release)').text().replace('Release: ', '').trim();

      mediaInfo.episodes = [];
      $('ul#episodes-sv-1 li').each((i, el) => {
        mediaInfo.episodes?.push({
          id: $(el).find('a').attr('href')!.replace('?ep=', '$episode$'),
          title: $(el).find('a').attr('title')!.trim(),
          episode: $(el).find('a').attr('episode-data'),
          url: `${this.baseUrl}${$(el).find('a').attr('href')}`,
        });
      });

      return mediaInfo;
    } catch (err) {
      throw err;
    }
  };

  override fetchEpisodeSources = async (
    episodeId: string,
    server: StreamingServers = StreamingServers.AsianLoad
  ): Promise<ISource> => {
    if (episodeId.startsWith('http')) {
      const serverUrl = new URL(episodeId);
      switch (server) {
        case StreamingServers.AsianLoad:
          return {
            ...(await new AsianLoad(this.proxyConfig, this.adapter).extract(serverUrl)),
          };
        case StreamingServers.MixDrop:
          return {
            sources: await new MixDrop(this.proxyConfig, this.adapter).extract(serverUrl),
          };
        case StreamingServers.StreamTape:
          return {
            sources: await new StreamTape(this.proxyConfig, this.adapter).extract(serverUrl),
          };
        case StreamingServers.StreamSB:
          return {
            sources: await new StreamSB(this.proxyConfig, this.adapter).extract(serverUrl),
          };
        default:
          throw new Error('Server not supported');
      }
    }
    if (!episodeId.includes('$episode$')) throw new Error('Invalid episode id');
    episodeId = `${episodeId.replace('$episode$', '?ep=')}`;

    // return episodeId;
    try {
      if (!episodeId.startsWith(this.baseUrl)) episodeId = `${this.baseUrl}/${episodeId}`;

      const { data } = await this.client.get(episodeId);

      const $ = load(data);

      let serverUrl = '';
      switch (server) {
        // asianload is the same as the standard server
        case StreamingServers.AsianLoad:
          serverUrl = `https:${$('.anime:contains(Asianload)').attr('data-video')}`;
          if (!serverUrl.includes('pladrac')) throw new Error('Try another server');
          break;
        case StreamingServers.MixDrop:
          serverUrl = $('.mixdrop').attr('data-video') as string;
          if (!serverUrl.includes('mixdrop')) throw new Error('Try another server');
          break;
        case StreamingServers.StreamTape:
          serverUrl = $('.streamtape').attr('data-video') as string;
          if (!serverUrl.includes('streamtape')) throw new Error('Try another server');
          break;
        case StreamingServers.StreamSB:
          serverUrl = $('.streamsb').attr('data-video') as string;
          if (!serverUrl.includes('stream')) throw new Error('Try another server');
          break;
      }

      return await this.fetchEpisodeSources(serverUrl, server);
    } catch (err) {
      throw err;
    }
  };

  override fetchEpisodeServers(episodeId: string, ...args: any): Promise<IEpisodeServer[]> {
    throw new Error('Method not implemented.');
  }
}

export default ViewAsian;
