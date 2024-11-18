import { load } from 'cheerio';
import { AxiosAdapter } from 'axios';

import {
  MovieParser,
  TvType,
  IMovieInfo,
  IEpisodeServer,
  StreamingServers,
  ISource,
  IMovieResult,
  ISearch,
  MediaStatus,
} from '../../models';
import { MixDrop, AsianLoad, StreamTape, StreamSB } from '../../extractors';

class DramaCool extends MovieParser {
  override readonly name = 'DramaCool';
  protected override baseUrl = 'https://dramacool.com.pa';
  protected override logo =
    'https://play-lh.googleusercontent.com/IaCb2JXII0OV611MQ-wSA8v_SAs9XF6E3TMDiuxGGXo4wp9bI60GtDASIqdERSTO5XU';
  protected override classPath = 'MOVIES.DramaCool';
  override supportedTypes = new Set([TvType.MOVIE, TvType.TVSERIES]);

  override search = async (query: string, page: number = 1): Promise<ISearch<IMovieResult>> => {
    try {
      const searchResult: ISearch<IMovieResult> = {
        currentPage: page,
        totalPages: page,
        hasNextPage: false,
        results: [],
      };

      const { data } = await this.client.get(
        `${this.baseUrl}/search?keyword=${query.replace(/[\W_]+/g, '-')}&page=${page}`
      );

      const $ = load(data);

      const navSelector = 'ul.pagination';

      searchResult.hasNextPage =
        $(navSelector).length > 0 ? !$(navSelector).children().last().hasClass('selected') : false;

      const lastPage = $(navSelector).children().last().find('a').attr('href');
      if ( lastPage != undefined && lastPage != "" && lastPage.includes("page=") ) 
      {
          const maxPage = new URLSearchParams(lastPage).get("page");
          if (maxPage != null && !isNaN(parseInt(maxPage)))
              searchResult.totalPages = parseInt(maxPage);   
          else if (searchResult.hasNextPage) 
              searchResult.totalPages = page + 1;                 
      }else if (searchResult.hasNextPage)                 
          searchResult.totalPages = page + 1;       

      $('div.block > div.tab-content > ul.list-episode-item > li').each((i, el) => {
        searchResult.results.push({
          id: $(el).find('a').attr('href')?.slice(1)!,
          title: $(el).find('a > h3').text(),
          url: `${this.baseUrl}${$(el).find('a').attr('href')}`,
          image: $(el).find('a > img').attr('data-original'),
        });
      });
      return searchResult;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  override fetchMediaInfo = async (mediaId: string): Promise<IMovieInfo> => {
    try {
      const realMediaId = mediaId;
      if (!mediaId.startsWith(this.baseUrl)) mediaId = `${this.baseUrl}/${mediaId}`;

      const mediaInfo: IMovieInfo = {
        id: '',
        title: '',
      };

      const { data } = await this.client.get(mediaId);
      const $ = load(data);

      mediaInfo.id = realMediaId;     

      const duration = $('div.details div.info p:contains("Duration:")').first().text().trim(); 
      if ( duration != "" ) 
        mediaInfo.duration = duration.replace("Duration:", "").trim();   
      const status = $('div.details div.info p:contains("Status:")').find('a').first().text().trim();
      switch (status) {
          case 'Ongoing':
              mediaInfo.status = MediaStatus.ONGOING;
              break;
          case 'Completed':
              mediaInfo.status = MediaStatus.COMPLETED;
              break;
          default:
              mediaInfo.status = MediaStatus.UNKNOWN;
              break;
      }     
      mediaInfo.genres = [];
      const genres = $('div.details div.info p:contains("Genre:")');
      genres.each((_index, element) => {
          $(element).find('a').each((_, anchorElement) => {
              mediaInfo.genres?.push($(anchorElement).text());
          });
      });

      mediaInfo.title = $('.info > h1:nth-child(1)').text();
      mediaInfo.otherNames = $('.other_name > a')
        .map((i, el) => $(el).text().trim())
        .get();
      mediaInfo.image = $('div.details > div.img > img').attr('src');
      mediaInfo.description = $('div.details div.info p:nth-child(6)').text();
      mediaInfo.releaseDate = this.removeContainsFromString(
        $('div.details div.info p:contains("Released:")').text(),
        'Released'
      );

      mediaInfo.episodes = [];
      $('div.content-left > div.block-tab > div > div > ul > li').each((i, el) => {
        mediaInfo.episodes?.push({
          id: $(el).find('a').attr('href')?.split('.html')[0].slice(1)!,
          title: $(el).find('h3').text().replace(mediaInfo.title.toString(), '').trim(),
          episode: parseFloat(
            $(el).find('a').attr('href')?.split('-episode-')[1].split('.html')[0].split('-').join('.')!
          ),
          subType: $(el).find('span.type').text(),
          releaseDate: $(el).find('span.time').text(),
          url: `${this.baseUrl}${$(el).find('a').attr('href')}`,
        });
      });
      mediaInfo.episodes.reverse();

      return mediaInfo;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  override async fetchEpisodeServers(episodeId: string, ...args: any): Promise<IEpisodeServer[]> {
    try {
      const episodeServers: IEpisodeServer[] = [];

      if (!episodeId.includes('.html')) episodeId = `${this.baseUrl}/${episodeId}.html`;

      const { data } = await this.client.get(episodeId);
      const $ = load(data);

      $('div.anime_muti_link > ul > li').map(async (i, ele) => {
        const url = $(ele).attr('data-video')!;
        let name = $(ele).attr('class')!.replace('selected', '').trim();
        if (name.includes('Standard')) {
          name = StreamingServers.AsianLoad;
        }
        episodeServers.push({
          name: name,
          url: url.startsWith('//') ? url?.replace('//', 'https://') : url,
        });
      });

      return episodeServers;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

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

    try {
      if (!episodeId.includes('.html')) episodeId = `${this.baseUrl}/${episodeId}.html`;

      const servers = await this.fetchEpisodeServers(episodeId);
      const i = servers.findIndex(s => s.name.toLowerCase() === server.toLowerCase());
      if (i === -1) {
        throw new Error(`Server ${server} not found`);
      }
      const serverUrl: URL = new URL(
        servers.filter(s => s.name.toLowerCase() === server.toLowerCase())[0].url
      );

      return await this.fetchEpisodeSources(serverUrl.href, server);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  private removeContainsFromString = (str: string, contains: string) => {
    contains = contains.toLowerCase();
    return str.toLowerCase().replace(/\n/g, '').replace(`${contains}:`, '').trim();
  };
}

export default DramaCool;
