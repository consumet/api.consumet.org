import { load } from 'cheerio';

import {
  MangaParser,
  ISearch,
  IMangaInfo,
  IMangaResult,
  MediaStatus,
  IMangaChapterPage,
  IMangaChapter,
} from '../../models';

class BRMangas extends MangaParser {
  override readonly name = 'BRMangas';
  protected override baseUrl = 'https://www.brmangas.net';
  protected override logo = 'https://www.brmangas.net/wp-content/themes/brmangasnew/images/svg/logo.svg';
  protected override classPath = 'MANGA.BRMangas';

  override fetchMangaInfo = async (mangaId: string): Promise<IMangaInfo> => {
    const mangaInfo: IMangaInfo = {
      id: mangaId,
      title: '',
    };
    try {
      const { data } = await this.client.get(`${this.baseUrl}/manga/${mangaId}`);
      const $ = load(data);

      const title = $('body > div.scroller-inner > div.wrapper > main > section > div > h1.titulo').text();
      const descriptionAndAltTitles = $(
        'body > div.scroller-inner > div.wrapper > main > div > div > div.col > div.serie-texto > div > p:nth-child(3)'
      )
        .text()
        .split('\n');

      mangaInfo.title = title.slice(3, title.length - 7).trim();
      mangaInfo.altTitles = descriptionAndAltTitles.filter((_, i) => i > 0);
      mangaInfo.description = descriptionAndAltTitles[0];
      mangaInfo.headerForImage = { Referer: this.baseUrl };
      mangaInfo.image = $(
        'body > div.scroller-inner > div.wrapper > main > div > div > div.serie-geral > div.infoall > div.serie-capa > img'
      ).attr('src');
      mangaInfo.genres = $(
        'body > div.scroller-inner > div.wrapper > main > div > div > div.serie-geral > div.infoall > div.serie-infos > ul > li:nth-child(3)'
      )
        .text()
        .slice(11)
        .split(',')
        .map(genre => genre.trim());

      mangaInfo.status = MediaStatus.UNKNOWN;

      mangaInfo.views = null;
      mangaInfo.authors = [
        $(
          'body > div.scroller-inner > div.wrapper > main > div > div > div.serie-geral > div.infoall > div.serie-infos > ul > li:nth-child(2)'
        )
          .text()
          .replace('Autor: ', '')
          .trim(),
      ];

      mangaInfo.chapters = $(
        'body > div.scroller-inner > div.wrapper > main > div > div > div:nth-child(2) > div.manga > div.container_t > div.lista_manga > ul > li'
      )
        .map((i, el): IMangaChapter => {
          return {
            id: `${$(el).find('a').attr('href')?.split('/')[4]}`,
            title: $(el).find('a').text(),
            views: null,
            releasedDate: null,
          };
        })
        .get();

      return mangaInfo;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  override fetchChapterPages = async (chapterId: string): Promise<IMangaChapterPage[]> => {
    try {
      const url = `${this.baseUrl}/ler/${chapterId}`;
      const { data } = await this.client.get(url);
      const $ = load(data);

      const script = $('script');

      const pageURLs = JSON.parse(
        script
          .filter((i, el) => $(el).text().includes('imageArray'))
          .text()
          .trim()
          .slice(13, -2)
          .replace(/\\/g, '')
      );

      console.log(pageURLs.images);

      const pages = pageURLs.images.map(
        (img: any, i: any): IMangaChapterPage => ({
          img: img,
          page: i,
          title: `Page ${i + 1}`,
          headerForImage: { Referer: this.baseUrl },
        })
      );

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
      const { data } = await this.client.get(`${this.baseUrl}/?s=${query.replace(/ /g, '+')}`);
      const $ = load(data);

      const results = $(
        'body > div.scroller-inner > div.wrapper > main > div.container > div.listagem > div.col'
      )
        .map(
          (i, row): IMangaResult => ({
            id: $(row).find('div.item > a').attr('href')?.split('/')[4]!,
            title: $(row).find('div.item > a > h2').text(),
            image: $(row).find('div.item > a > div > img').attr('src'),
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

export default BRMangas;
