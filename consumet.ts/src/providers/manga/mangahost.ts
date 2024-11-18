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

class MangaHost extends MangaParser {
  override readonly name = 'MangaHost';
  protected override baseUrl = 'https://mangahosted.com';
  protected override logo = 'https://i.imgur.com/OVlhhsR.png';
  protected override classPath = 'MANGA.MangaHost';

  override fetchMangaInfo = async (mangaId: string): Promise<IMangaInfo> => {
    const mangaInfo: IMangaInfo = {
      id: mangaId,
      title: '',
    };
    try {
      const { data } = await this.client.get(`${this.baseUrl}/manga/${mangaId}`);
      const $ = load(data);

      mangaInfo.title = $('article.ejeCg > h1.title').text();
      mangaInfo.altTitles = $('article.ejeCg > h3.subtitle').text();
      mangaInfo.description = $('div.text > div.paragraph > p').text().replace(/\n/g, '').trim();
      mangaInfo.headerForImage = { Referer: this.baseUrl };
      mangaInfo.image = $('div.widget:nth-child(1) > picture > img').attr('src');
      mangaInfo.genres = $('article.ejeCg:nth-child(1) > div.tags > a.tag ')
        .map((i, el) => $(el).text())
        .get();

      switch ($('h3.subtitle > strong').text()) {
        case 'Completo':
          mangaInfo.status = MediaStatus.COMPLETED;
          break;
        case 'Ativo':
          mangaInfo.status = MediaStatus.ONGOING;
          break;
        default:
          mangaInfo.status = MediaStatus.UNKNOWN;
      }
      mangaInfo.views = parseInt(
        $('div.classificacao-box-1 > div.text-block-3').text().replace(' views', '').replace(/,/g, '').trim()
      );
      mangaInfo.authors = $(
        'div.w-col.w-col-6:nth-child(1) > ul.w-list-unstyled:nth-child(1) > li:nth-child(3) > div:nth-child(1)'
      )
        .map((i, el) => $(el).text().replace('Autor: ', '').trim())
        .get();

      mangaInfo.chapters = $('div.chapters > div.cap')
        .map((i, el): IMangaChapter => {
          const releasedDate = $(el)
            .find('div.card > div.pop-content > small')
            .text()
            .match(/Adicionado em (.+?)"/);

          return {
            id: `${$(el).find('a.btn-caps').text()}`,
            title: $(el).find('a.btn-caps').attr('title')!,
            views: null,
            releasedDate: releasedDate ? releasedDate[1] : '',
          };
        })
        .get();

      return mangaInfo;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  override fetchChapterPages = async (mangaId: string, chapterId: string): Promise<IMangaChapterPage[]> => {
    try {
      const url = `${this.baseUrl}/manga/${mangaId}/${chapterId}`;
      const { data } = await this.client.get(url);
      const $ = load(data);

      const pages = $('section#imageWrapper > div > div.read-slideshow > a > img')
        .map(
          (i, el): IMangaChapterPage => ({
            img: $(el).attr('src')!,
            page: i,
            title: `Page ${i + 1}`,
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
      const { data } = await this.client.get(`${this.baseUrl}/find/${query.replace(/ /g, '+')}`);
      const $ = load(data);

      const results = $('body > div.w-container > main > table > tbody > tr')
        .map(
          (i, row): IMangaResult => ({
            id: $(row).find('td > a.pull-left').attr('href')?.split('/')[4]!,
            title: $(row).find('td > h4.entry-title > a').text(),
            image: $(row).find('td > a.pull-left > picture > img.manga').attr('src'),
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

export default MangaHost;
