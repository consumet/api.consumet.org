import { load } from 'cheerio';

import {
  MangaParser,
  ISearch,
  IMangaInfo,
  IMangaResult,
  IMangaChapterPage,
  IMangaChapter,
} from '../../models';

class MangaReader extends MangaParser {
  override readonly name = 'MangaReader';
  protected override baseUrl = 'https://mangareader.to';
  protected override logo = 'https://pbs.twimg.com/profile_images/1437311892905545728/TO0hFfUr_400x400.jpg';
  protected override classPath = 'MANGA.MangaReader';

  /**
   *
   * @param query Search query
   */
  override search = async (query: string): Promise<ISearch<IMangaResult>> => {
    try {
      const { data } = await this.client.get(`${this.baseUrl}/search?keyword=${query}`);
      const $ = load(data);

      const results = $('div.manga_list-sbs div.mls-wrap div.item')
        .map(
          (i, el): IMangaResult => ({
            id: $(el).find('a.manga-poster').attr('href')?.split('/')[1]!,
            title: $(el).find('div.manga-detail h3.manga-name a').text().trim(),
            image: $(el).find('a.manga-poster img').attr('src'),
            genres: $(el)
              .find(`div.manga-detail div.fd-infor span > a`)
              .map((i, genre) => $(genre).text())
              .get(),
          })
        )
        .get();

      return {
        results: results,
      };
    } catch (err) {
      //   console.log(err);
      throw new Error((err as Error).message);
    }
  };

  override fetchMangaInfo = async (mangaId: string): Promise<IMangaInfo> => {
    const mangaInfo: IMangaInfo = {
      id: mangaId,
      title: '',
    };
    try {
      const { data } = await this.client.get(`${this.baseUrl}/${mangaId}`);
      const $ = load(data);

      const container = $('div.container');

      mangaInfo.title = container.find('div.anisc-detail h2.manga-name').text().trim();
      mangaInfo.image = container.find('img.manga-poster-img').attr('src');
      mangaInfo.description = $('div.modal-body div.description-modal').text().split('\n').join(' ').trim();
      mangaInfo.genres = container
        .find('div.sort-desc div.genres a')
        .map((i, genre) => $(genre).text().trim())
        .get();

      mangaInfo.chapters = container
        .find(`div.chapters-list-ul ul li`)
        .map(
          (i, el): IMangaChapter => ({
            id: $(el).find('a').attr('href')?.split('/read/')[1]!,
            title: $(el).find('a').attr('title')!.trim(),
            chapter: $(el).find('a span.name').text().split('Chapter ')[1]!.split(':')[0],
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
      const { data } = await this.client.get(`${this.baseUrl}/read/${chapterId}`);
      const $ = load(data);

      const readingId = $('div#wrapper').attr('data-reading-id');

      if (!readingId) {
        throw new Error('Unable to find pages');
      }

      const ajaxURL = `https://mangareader.to/ajax/image/list/chap/${readingId}?mode=vertical&quality=high`;
      const { data: pagesData } = await this.client.get(ajaxURL);
      const $PagesHTML = load(pagesData.html);

      const pagesSelector = $PagesHTML('div#main-wrapper div.container-reader-chapter div.iv-card');

      const pages = pagesSelector
        .map(
          (i, el): IMangaChapterPage => ({
            img: $(el).attr('data-url')!.replace('&amp;', '&'),
            page: i + 1,
          })
        )
        .get();

      return pages;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

// (async () => {
//   const manga = new MangaReader();
//   const search = await manga.search('one piece');
//   const info = await manga.fetchMangaInfo(search.results[0].id);
//   const pages = await manga.fetchChapterPages(info.chapters![0].id);
//   console.log(pages);
// })();

export default MangaReader;
