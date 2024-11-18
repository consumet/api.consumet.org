import { load } from 'cheerio';

import {
  MangaParser,
  ISearch,
  IMangaInfo,
  IMangaResult,
  IMangaChapterPage,
  IMangaChapter,
  MediaStatus,
} from '../../models';

class FlameScans extends MangaParser {
  override readonly name = 'FlameScans';
  protected override baseUrl = 'https://flamescans.org/';
  protected override logo = 'https://i.imgur.com/Nt1MW3H.png';
  protected override classPath = 'MANGA.FlameScans';

  /**
   *
   * @param query Search query
   *
   */

  override search = async (query: string): Promise<ISearch<IMangaResult>> => {
    try {
      const { data } = await this.client.get(`${this.baseUrl}/series/?title=${query.replace(/ /g, '%20')}`);
      const $ = load(data);

      const searchMangaSelector = '.utao .uta .imgu, .listupd .bs .bsx, .listo .bs .bsx';
      const results = $(searchMangaSelector)
        .map(
          (i, el): IMangaResult => ({
            id: $(el).find('a').attr('href')?.split('/series/')[1].replace('/', '') ?? '',
            title: $(el).find('a').attr('title') ?? '',
            image: $(el).find('img').attr('src'),
          })
        )
        .get();

      return {
        results: results,
      };
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  override fetchMangaInfo = async (mangaId: string): Promise<IMangaInfo> => {
    const mangaInfo: IMangaInfo = {
      id: mangaId,
      title: '',
    };
    try {
      const { data } = await this.client.get(`${this.baseUrl}/manga/${mangaId}`);
      const $ = load(data);

      // base from https://github.com/tachiyomiorg/tachiyomi-extensions/blob/661311c13b3b550e3fa906c1130b77a037ef7a11/multisrc/src/main/java/eu/kanade/tachiyomi/multisrc/mangathemesia/MangaThemesia.kt#L233
      const seriesTitleSelector = 'h1.entry-title';
      const seriesArtistSelector =
        ".infotable tr:icontains('artist') td:last-child, .tsinfo .imptdt:icontains('artist') i, .fmed b:icontains('artist')+span, span:icontains('artist')";
      const seriesAuthorSelector =
        ".infotable tr:icontains('author') td:last-child, .tsinfo .imptdt:icontains('author') i, .fmed b:icontains('author')+span, span:icontains('author')";
      const seriesDescriptionSelector = '.desc, .entry-content[itemprop=description]';
      const seriesAltNameSelector =
        ".alternative > div, .wd-full:icontains('alt') span, .alter, .seriestualt";
      const seriesGenreSelector = 'div.gnr a, .mgen a, .seriestugenre a';
      const seriesStatusSelector =
        ".infotable tr:icontains('status') td:last-child, .tsinfo .imptdt:icontains('status') i, .fmed b:icontains('status')+span span:icontains('status')";
      const seriesThumbnailSelector = '.infomanga > div[itemprop=image] img, .thumb img';
      const seriesChaptersSelector =
        'div.bxcl li, div.cl li, #chapterlist li, ul li:has(div.chbox):has(div.eph-num)';

      mangaInfo.title = $(seriesTitleSelector).text().trim();
      mangaInfo.altTitles = $(seriesAltNameSelector).text()
        ? $(seriesAltNameSelector)
            .first()
            .text()
            .split('|')
            .map(item => item.replace(/\n/g, ' ').trim())
        : [];
      mangaInfo.description = $(seriesDescriptionSelector).text().trim();
      mangaInfo.headerForImage = { Referer: this.baseUrl };
      mangaInfo.image = $(seriesThumbnailSelector).attr('src');
      mangaInfo.genres = $(seriesGenreSelector)
        .map((i, el) => $(el).text())
        .get();
      switch ($(seriesStatusSelector).text().trim()) {
        case 'Completed':
          mangaInfo.status = MediaStatus.COMPLETED;
          break;
        case 'Ongoing':
          mangaInfo.status = MediaStatus.ONGOING;
          break;
        case 'Dropped':
          mangaInfo.status = MediaStatus.CANCELLED;
          break;
        default:
          mangaInfo.status = MediaStatus.UNKNOWN;
          break;
      }
      mangaInfo.authors = $(seriesAuthorSelector).text().replace('-', '').trim()
        ? $(seriesAuthorSelector)
            .text()
            .split(',')
            .map(item => item.trim())
        : [];
      mangaInfo.artist = $(seriesArtistSelector).text().trim()
        ? $(seriesArtistSelector).text().trim()
        : 'N/A';
      mangaInfo.chapters = $(seriesChaptersSelector)
        .map(
          (i, el): IMangaChapter => ({
            id: $(el).find('a').attr('href')?.split('/')[3] ?? '',
            title: $(el).find('.lch a, .chapternum').text().trim().replace(/\n/g, ' '),
            releasedDate: $(el).find('.chapterdate').text(),
          })
        )
        .get();

      return mangaInfo;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  override fetchChapterPages = async (chapterId: string): Promise<IMangaChapterPage[]> => {
    try {
      const { data } = await this.client.get(`${this.baseUrl}/${chapterId}`);
      const $ = load(data);

      const pageSelector = 'div#readerarea img, #readerarea div.figure_container div.composed_figure';

      const pages = $(pageSelector)
        .map(
          (i, el): IMangaChapterPage => ({
            img: $(el).attr('src')!,
            page: i,
            headerForImage: { Referer: this.baseUrl },
          })
        )
        .get();

      return pages;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default FlameScans;
