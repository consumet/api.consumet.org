import { CheerioAPI, load } from 'cheerio';

import {
  MangaParser,
  ISearch,
  IMangaInfo,
  IMangaResult,
  MediaStatus,
  IMangaChapterPage,
  IMangaChapter,
} from '../../models';

let cloudscraper: any;

class AsuraScans extends MangaParser {
  override readonly name = 'AsuraScans';
  protected override baseUrl = 'https://www.asurascans.com/';
  protected override logo = 'https://www.asurascans.com/wp-content/uploads/2021/03/Group_1.png';
  protected override classPath = 'MANGA.AsuraScans';

  constructor() {
    try {
      cloudscraper = require('cloudscraper');
    } catch (err: any) {
      if (err.message.includes("Cannot find module 'request'")) {
        throw new Error(
          'Request is not installed. Please install it by running "npm i request" or "yarn add request"'
        );
      } else if (err.message.includes("Cannot find module 'cloudscraper'")) {
        throw new Error(
          'Cloudscraper is not installed. Please install it by running "npm i cloudscraper" or "yarn add cloudscraper"'
        );
      } else {
        throw new Error((err as Error).message);
      }
    }

    super();
  }

  override fetchMangaInfo = async (mangaId: string): Promise<IMangaInfo> => {
    const options = {
      method: 'GET',
      url: `${this.baseUrl}/manga/${mangaId.trim()}`,
      headers: {
        'User-Agent': 'Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
        'Cache-Control': 'private',
        Accept: 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5',
      },
      cloudflareTimeout: 5000,
      cloudflareMaxTimeout: 30000,
      followAllRedirects: true,
      challengesToSolve: 3,
      decodeEmails: false,
      gzip: true,
    };

    const mangaInfo: IMangaInfo = {
      id: mangaId,
      title: '',
    };

    try {
      const data: string = await cloudscraper(options).then((response: any) => response);
      const $: CheerioAPI = load(data);

      const seriesTitleSelector = 'h1.entry-title';
      const seriesArtistSelector =
        ".infotable tr:icontains('artist') td:last-child, .tsinfo .imptdt:icontains('artist') i, .fmed b:icontains('artist')+span, span:icontains('artist')";
      const seriesAuthorSelector =
        ".infotable tr:icontains('author') td:last-child, .tsinfo .imptdt:icontains('author') i, .fmed b:icontains('author')+span, span:icontains('author')";
      const seriesDescriptionSelector = '.desc, .entry-content[itemprop=description]';
      const seriesAltNameSelector = ".alternative, .wd-full:icontains('alt') span, .alter, .seriestualt";
      const seriesGenreSelector = 'div.gnr a, .mgen a, .seriestugenre a';
      const seriesStatusSelector =
        ".infotable tr:icontains('status') td:last-child, .tsinfo .imptdt:icontains('status') i, .fmed b:icontains('status')+span span:icontains('status')";
      const seriesThumbnailSelector = '.infomanga > div[itemprop=image] img, .thumb img';
      const seriesChaptersSelector =
        'div.bxcl li, div.cl li, #chapterlist li, ul li:has(div.chbox):has(div.eph-num)';

      mangaInfo.title = $(seriesTitleSelector).text().trim();
      mangaInfo.altTitles = $(seriesAltNameSelector).text()
        ? $(seriesAltNameSelector)
            .text()
            .split(',')
            .map(item => item.trim())
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
            title: $(el).find('.lch a, .chapternum').text(),
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
    const options = {
      method: 'GET',
      url: `${this.baseUrl}/${chapterId.trim()}`,
      headers: {
        'User-Agent': 'Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
        'Cache-Control': 'private',
        Accept: 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5',
      },
      cloudflareTimeout: 5000,
      cloudflareMaxTimeout: 30000,
      followAllRedirects: true,
      challengesToSolve: 3,
      decodeEmails: false,
      gzip: true,
    };

    try {
      const data: string = await cloudscraper(options).then((response: any) => response);
      const $: CheerioAPI = load(data);

      const pageSelector = 'div#readerarea img';

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

  /**
   *
   * @param query Search query
   */
  override search = async (query: string): Promise<ISearch<IMangaResult>> => {
    try {
      const options = {
        method: 'GET',
        url: `${this.baseUrl}/?s=${query.replace(/ /g, '%20')}`,
        headers: {
          'User-Agent': 'Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
          'Cache-Control': 'private',
          Accept:
            'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5',
        },
        cloudflareTimeout: 5000,
        cloudflareMaxTimeout: 30000,
        followAllRedirects: true,
        challengesToSolve: 3,
        decodeEmails: false,
        gzip: true,
      };

      const data: string = await cloudscraper(options).then((response: any) => response);

      const $: CheerioAPI = load(data);

      const searchMangaSelector = '.utao .uta .imgu, .listupd .bs .bsx, .listo .bs .bsx';

      const results = $(searchMangaSelector)
        .map(
          (i, el): IMangaResult => ({
            id: $(el).find('a').attr('href')?.split('/')[4] ?? '',
            title: $(el).find('a').attr('title')!,
            image: $(el).find('img').attr('src'),
            headerForImage: { Referer: this.baseUrl },
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
}

export default AsuraScans;
