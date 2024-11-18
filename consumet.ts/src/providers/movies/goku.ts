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
  IMovieEpisode,
} from '../../models';
import { MixDrop, VidCloud } from '../../extractors';

class Goku extends MovieParser {
  override readonly name = 'Goku';
  protected override baseUrl = 'https://goku.sx';
  protected override logo =
    'https://img.goku.sx/xxrz/400x400/100/9c/e7/9ce7510639c4204bfe43904fad8f361f/9ce7510639c4204bfe43904fad8f361f.png';
  protected override classPath = 'MOVIES.Goku';
  override supportedTypes = new Set([TvType.MOVIE, TvType.TVSERIES]);

  /**
   *
   * @param query search query string
   * @param page page number (default 1) (optional)
   */
  override search = async (query: string, page: number = 1): Promise<ISearch<IMovieResult>> => {
    const searchResult: ISearch<IMovieResult> = {
      currentPage: page,
      hasNextPage: false,
      results: [],
    };
    try {
      const { data } = await this.client.get(
        `${this.baseUrl}/search?keyword=${query.replace(/[\W_]+/g, '-')}&page=${page}`
      );
      const $ = load(data);

      searchResult.hasNextPage =
        $('.page-link').length > 0 ? $('.page-link').last().attr('title') === 'Last' : false;

      $('div.section-items > div.item').each((i, el) => {
        const releaseDate = $(el).find('div.movie-info div.info-split > div:nth-child(1)').text();
        const rating = $(el).find('div.movie-info div.info-split div.is-rated').text();
        searchResult.results.push({
          id: $(el).find('.is-watch > a').attr('href')?.replace('/', '') ?? '',
          title: $(el).find('div.movie-info h3.movie-name').text(),
          url: `${this.baseUrl}${$(el).find('.is-watch > a').attr('href')}`,
          image: $(el).find('div.movie-thumbnail > a > img').attr('src'),
          releaseDate: isNaN(parseInt(releaseDate)) ? undefined : releaseDate,
          rating: isNaN(parseInt(rating)) ? undefined : parseFloat(rating),
          type:
            $(el).find('.is-watch > a').attr('href')?.indexOf('watch-series') ?? -1 > -1
              ? TvType.TVSERIES
              : TvType.MOVIE,
        });
      });

      return searchResult;

      // const { data } = await this.client.get(
      //   `${this.baseUrl}/ajax/movie/search?keyword=${query.replace(/[\W_]+/g, '-')}&page=${page}`
      // );
      // const $ = load(data);

      // $('div.item').each((i, ele) => {
      //   const url = $(ele).find('a')?.attr('href');
      //   const releaseDate = $(ele).find('div.info-split > div:first-child').text();
      //   const rating = $(ele).find('.is-rated').text();
      //   searchResult.results.push({
      //     id: url?.replace(this.baseUrl, '') ?? '',
      //     title: $(ele).find('h3.movie-name').text(),
      //     releaseDate: isNaN(parseInt(releaseDate)) ? undefined : releaseDate,
      //     image: $(ele).find('div.movie-thumbnail > a > img').attr('src'),
      //     rating: isNaN(parseInt(rating)) ? undefined : parseFloat(rating),
      //     type: releaseDate.toLocaleLowerCase() !== 'tv' ? TvType.MOVIE : TvType.TVSERIES,
      //   });
      // });

      // return searchResult;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  /**
   *
   * @param mediaId media link or id
   */
  override fetchMediaInfo = async (mediaId: string): Promise<IMovieInfo> => {
    if (mediaId.startsWith(this.baseUrl)) {
      mediaId = mediaId.replace(this.baseUrl + '/', '');
    }

    try {
      const { data } = await this.client.get(`${this.baseUrl}/${mediaId}`);
      const $ = load(data);

      const mediaInfo: IMovieInfo = {
        id: mediaId,
        title: '',
        url: `${this.baseUrl}/${mediaId}`,
      };

      mediaInfo.title = $('div.movie-detail > div.is-name > h3').text();
      mediaInfo.image = $('.movie-thumbnail > img').attr('src');
      mediaInfo.description = $('.is-description > .text-cut').text();
      mediaInfo.type = mediaId.indexOf('watch-series') > -1 ? TvType.TVSERIES : TvType.MOVIE;
      mediaInfo.genres = $("div.name:contains('Genres:')")
        .siblings()
        .find('a')
        .map((i, el) => $(el).text())
        .get();
      mediaInfo.casts = $("div.name:contains('Cast:')")
        .siblings()
        .find('a')
        .map((i, el) => $(el).text())
        .get();
      mediaInfo.production = $("div.name:contains('Production:')")
        .siblings()
        .find('a')
        .map((i, el) => $(el).text())
        .get()
        .join();
      mediaInfo.duration = $("div.name:contains('Duration:')").siblings().text().split('\n').join('').trim();

      if (mediaInfo.type === TvType.TVSERIES) {
        const { data } = await this.client.get(
          `${this.baseUrl}/ajax/movie/seasons/${mediaInfo.id.split('-').pop()}`
        );
        const $$ = load(data);

        const seasonsIds = $$('.dropdown-menu > a')
          .map((i, el) => {
            const seasonsId = $(el).text().replace('Season', '').trim();
            return {
              id: $(el).attr('data-id'),
              season: isNaN(parseInt(seasonsId)) ? undefined : parseInt(seasonsId),
            };
          })
          .get();

        mediaInfo.episodes = [];

        for (const season of seasonsIds) {
          const { data } = await this.client.get(`${this.baseUrl}/ajax/movie/season/episodes/${season.id}`);
          const $$$ = load(data);

          $$$('.item')
            .map((i, el) => {
              const episode = {
                id: $$$(el).find('a').attr('data-id') ?? '',
                title: $$$(el).find('a').attr('title') ?? '',
                number: parseInt($$$(el).find('a').text()?.split(':')[0].trim().substring(3) ?? ''),
                season: season.season,
                url: $$$(el).find('a').attr('href'),
              };
              mediaInfo.episodes?.push(episode);
            })
            .get();
        }
      } else {
        mediaInfo.episodes = [];
        $('meta').map((i, ele) => {
          if ($(ele).attr('property') === 'og:url') {
            const episode: IMovieEpisode = {
              id: $(ele).attr('content')?.split('/').pop() ?? '',
              title: mediaInfo.title.toString(),
              url: $(ele).attr('content'),
            };
            mediaInfo.episodes?.push(episode);
          }
        });
      }

      return mediaInfo;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  /**
   *
   * @param episodeId episode id
   * @param mediaId media id
   * @param server server type (default `VidCloud`) (optional)
   */
  override fetchEpisodeSources = async (
    episodeId: string,
    mediaId: string,
    server: StreamingServers = StreamingServers.UpCloud
  ): Promise<ISource> => {
    if (episodeId.startsWith('http')) {
      const serverUrl = new URL(episodeId);
      switch (server) {
        case StreamingServers.MixDrop:
          return {
            headers: { Referer: serverUrl.href },
            sources: await new MixDrop(this.proxyConfig, this.adapter).extract(serverUrl),
          };
        case StreamingServers.VidCloud:
          return {
            headers: { Referer: serverUrl.href },
            ...(await new VidCloud(this.proxyConfig, this.adapter).extract(serverUrl, true)),
          };
        case StreamingServers.UpCloud:
          return {
            headers: { Referer: serverUrl.href },
            ...(await new VidCloud(this.proxyConfig, this.adapter).extract(serverUrl)),
          };
        default:
          return {
            headers: { Referer: serverUrl.href },
            sources: await new MixDrop(this.proxyConfig, this.adapter).extract(serverUrl),
          };
      }
    }

    try {
      const servers = await this.fetchEpisodeServers(episodeId, mediaId);

      const i = servers.findIndex(s => s.name.toLowerCase() === server.toLowerCase());

      if (i === -1) {
        throw new Error(`Server ${server} not found`);
      }

      const serverUrl: URL = new URL(
        servers.filter(s => s.name.toLowerCase() === server.toLowerCase())[0].url
      );

      return await this.fetchEpisodeSources(serverUrl.href, mediaId, server);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  /**
   *
   * @param episodeId takes episode link or movie id
   * @param mediaId takes movie link or id (found on movie info object)
   */
  override fetchEpisodeServers = async (episodeId: string, mediaId: string): Promise<IEpisodeServer[]> => {
    try {
      const epsiodeServers: IEpisodeServer[] = [];
      const { data } = await this.client.get(`${this.baseUrl}/ajax/movie/episode/servers/${episodeId}`);
      const $ = load(data);

      const servers = $('.dropdown-menu > a')
        .map((i, ele) => ({
          name: $(ele).text(),
          id: $(ele).attr('data-id') ?? '',
        }))
        .get();

      for (const server of servers) {
        const { data } = await this.client.get(
          `${this.baseUrl}/ajax/movie/episode/server/sources/${server.id}`
        );

        epsiodeServers.push({
          name: server.name,
          url: data.data.link,
        });
      }

      return epsiodeServers;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  fetchRecentMovies = async (): Promise<IMovieResult[]> => {
    try {
      const { data } = await this.client.get(`${this.baseUrl}/home`);
      const $ = load(data);

      const movies = $('.section-last')
        .first()
        .find('.item')
        .map((i, ele) => {
          const releaseDate = $(ele).find('.info-split').children().first().text();
          const movie: any = {
            id: $(ele).find('.is-watch > a').attr('href')?.replace('/', '')!,
            title: $(ele).find('.movie-name').text(),
            url: `${this.baseUrl}${$(ele).find('.is-watch > a').attr('href')}`,
            image: $(ele).find('.movie-thumbnail > a > img').attr('src'),
            releaseDate: isNaN(parseInt(releaseDate)) ? undefined : releaseDate,
            duration: $(ele).find('.info-split > div:nth-child(3)').text(),
            type:
              $(ele).find('.is-watch > a').attr('href')?.indexOf('watch-movie') ?? -1 > -1
                ? TvType.MOVIE
                : TvType.TVSERIES,
          };
          return movie;
        })
        .get();
      return movies;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  fetchRecentTvShows = async (): Promise<IMovieResult[]> => {
    try {
      const { data } = await this.client.get(`${this.baseUrl}/home`);
      const $ = load(data);

      const tvShowes = $('.section-last')
        .last()
        .find('.item')
        .map((i, ele) => {
          const tvshow: any = {
            id: $(ele).find('.is-watch > a').attr('href')?.replace('/', '')!,
            title: $(ele).find('.movie-name').text(),
            url: `${this.baseUrl}${$(ele).find('.is-watch > a').attr('href')}`,
            image: $(ele).find('.movie-thumbnail > a > img').attr('src'),
            season: $(ele)
              .find('.info-split > div:nth-child(2)')
              .text()
              .split('/')[0]
              .replace('SS ', '')
              .trim(),
            latestEpisode: $(ele)
              .find('.info-split > div:nth-child(2)')
              .text()
              .split('/')[1]
              .replace('EPS ', '')
              .trim(),
            type:
              $(ele).find('.is-watch > a').attr('href')?.indexOf('watch-series') ?? -1 > -1
                ? TvType.TVSERIES
                : TvType.MOVIE,
          };
          return tvshow;
        })
        .get();
      return tvShowes;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  fetchTrendingMovies = async (): Promise<IMovieResult[]> => {
    try {
      const { data } = await this.client.get(`${this.baseUrl}/home`);
      const $ = load(data);

      const movies = $('#trending-movies')
        .find('.item')
        .map((i, ele) => {
          const releaseDate = $(ele).find('.info-split').children().first().text();
          const movie: any = {
            id: $(ele).find('.is-watch > a').attr('href')?.replace('/', '')!,
            title: $(ele).find('.movie-name').text(),
            url: `${this.baseUrl}${$(ele).find('.is-watch > a').attr('href')}`,
            image: $(ele).find('.movie-thumbnail > a > img').attr('src'),
            releaseDate: isNaN(parseInt(releaseDate)) ? undefined : releaseDate,
            duration: $(ele).find('.info-split > div:nth-child(3)').text(),
            type:
              $(ele).find('.is-watch > a').attr('href')?.indexOf('watch-movie') ?? -1 > -1
                ? TvType.MOVIE
                : TvType.TVSERIES,
          };
          return movie;
        })
        .get();
      return movies;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  fetchTrendingTvShows = async (): Promise<IMovieResult[]> => {
    try {
      const { data } = await this.client.get(`${this.baseUrl}/home`);
      const $ = load(data);

      const tvShowes = $('#trending-series')
        .find('.item')
        .map((i, ele) => {
          const tvshow: any = {
            id: $(ele).find('.is-watch > a').attr('href')?.replace('/', '')!,
            title: $(ele).find('.movie-name').text(),
            url: `${this.baseUrl}${$(ele).find('.is-watch > a').attr('href')}`,
            image: $(ele).find('.movie-thumbnail > a > img').attr('src'),
            season: $(ele)
              .find('.info-split > div:nth-child(2)')
              .text()
              .split('/')[0]
              .replace('SS ', '')
              .trim(),
            latestEpisode: $(ele)
              .find('.info-split > div:nth-child(2)')
              .text()
              .split('/')[1]
              .replace('EPS ', '')
              .trim(),
            type:
              $(ele).find('.is-watch > a').attr('href')?.indexOf('watch-series') ?? -1 > -1
                ? TvType.TVSERIES
                : TvType.MOVIE,
          };
          return tvshow;
        })
        .get();
      return tvShowes;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default Goku;
