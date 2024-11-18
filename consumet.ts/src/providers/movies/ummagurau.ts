import { load } from 'cheerio';
import {
  IEpisodeServer,
  IMovieInfo,
  IMovieResult,
  ISearch,
  ISource,
  MovieParser,
  TvType,
} from '../../models';

class Ummangurau extends MovieParser {
  override readonly name = 'Ummangurau';
  protected override baseUrl = 'https://www1.ummagurau.com';
  protected override logo = 'https://www1.ummagurau.com/images/group_1/theme_8/logo.png?v=0.1';
  protected override classPath = `MOVIES.${this.name}`;
  override supportedTypes = new Set([TvType.MOVIE, TvType.TVSERIES]);

  override search = async (query: string, page: number = 1) => {
    const searchResult: ISearch<IMovieResult> = {
      currentPage: page,
      hasNextPage: false,
      results: [],
    };
    try {
      const { data } = await this.client.get(
        `${this.baseUrl}/search/${query.replace(/[\W_]+/g, '-')}?page=${page}`
      );

      const $ = load(data);

      searchResult.hasNextPage =
        $("nav[area-label='Page navigation']").html() === null
          ? false
          : page <
            Number(
              $("nav ul li a[title='Last']")!.attr('href')![
                $("nav ul li a[title='Last']")!.attr('href')!.length - 1
              ]
            );

      $('div.flw-item').each((i, e) => {
        searchResult.results.push({
          id: `${$(e).find('a.film-poster-ahref')?.attr('href')?.slice(1)}`,
          title: `${$(e).find('h2.film-name a').attr('href')}`,
          url: `${this.baseUrl}${$(e).find('.film-poster a').attr('href')}`,
          image: `${$(e).find('.film-poster img').attr('data-src')}`,
          type: $(e).find('span.fdi-type').text() === 'Movie' ? TvType.MOVIE : TvType.TVSERIES,
        });
      });
      return searchResult;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  };

  override fetchMediaInfo = async (mediaId: string): Promise<IMovieInfo> => {
    if (!mediaId.startsWith(this.baseUrl)) {
      mediaId = `${this.baseUrl}/${mediaId}`;
    }

    const movieInfo: IMovieInfo = {
      id: mediaId.split('com/')[-1],
      title: '',
      url: mediaId,
    };
    try {
      const { data } = await this.client.get(mediaId);
      const $ = load(data);

      movieInfo.title = `${$('.heading-name a').text()}`;
      movieInfo.image = `${$('img.film-poster-img').attr('src')}`;
      movieInfo.description = `${$('.description').text()}`;
      movieInfo.type = $("a[title='TV Shows']").text() === '' ? TvType.TVSERIES : TvType.MOVIE;
      movieInfo.releaseDate = $('div.row-line').text().replace('Released: ', '').trim();
      movieInfo.genres = $('div.row-line:eq(1) a')
        .text()
        .trim()
        .split(', ')
        .map(v => v.trim());
    } catch (err) {
      throw new Error((err as Error).message);
    }

    return movieInfo;
  };

  override fetchEpisodeServers(mediaLink: string, ...args: any): Promise<IEpisodeServer[]> {
    throw new Error('Method not implemented.');
  }

  override fetchEpisodeSources(mediaId: string, ...args: any): Promise<ISource> {
    throw new Error('Method not implemented.');
  }
}
