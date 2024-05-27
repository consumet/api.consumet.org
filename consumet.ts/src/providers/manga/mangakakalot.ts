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

class MangaKakalot extends MangaParser {
  override readonly name = 'MangaKakalot';
  protected override baseUrl = 'https://mangakakalot.com';
  protected override logo = 'https://techbigs.com/uploads/2022/1/mangakakalot-apkoptimized.jpg';
  protected override classPath = 'MANGA.MangaKakalot';

  override fetchMangaInfo = async (mangaId: string): Promise<IMangaInfo> => {
    const mangaInfo: IMangaInfo = {
      id: mangaId,
      title: '',
    };
    const url = mangaId.includes('read') ? this.baseUrl : 'https://readmanganato.com';
    try {
      const { data } = await this.client.get(`${url}/${mangaId}`);
      const $ = load(data);

      if (url.includes('mangakakalot')) {
        mangaInfo.title = $('div.manga-info-top > ul > li:nth-child(1) > h1').text();
        mangaInfo.altTitles = $('div.manga-info-top > ul > li:nth-child(1) > h2')
          .text()
          .replace('Alternative :', '')
          .split(';');
        mangaInfo.description = $('#noidungm')
          .text()
          .replace(`${mangaInfo.title} summary:`, '')
          .replace(/\n/g, '')
          .trim();
        mangaInfo.headerForImage = { Referer: this.baseUrl };
        mangaInfo.image = $('div.manga-info-top > div > img').attr('src');
        mangaInfo.genres = $('div.manga-info-top > ul > li:nth-child(7) > a')
          .map((i, el) => $(el).text())
          .get();

        switch ($('div.manga-info-top > ul > li:nth-child(3)').text().replace('Status :', '').trim()) {
          case 'Completed':
            mangaInfo.status = MediaStatus.COMPLETED;
            break;
          case 'Ongoing':
            mangaInfo.status = MediaStatus.ONGOING;
            break;
          default:
            mangaInfo.status = MediaStatus.UNKNOWN;
        }
        mangaInfo.views = parseInt(
          $('div.manga-info-top > ul > li:nth-child(6)')
            .text()
            .replace('View : ', '')
            .replace(/,/g, '')
            .trim()
        );
        mangaInfo.authors = $('div.manga-info-top > ul > li:nth-child(2) > a')
          .map((i, el) => $(el).text())
          .get();

        mangaInfo.chapters = $('div.chapter-list > div.row')
          .map(
            (i, el): IMangaChapter => ({
              id: $(el).find('span > a').attr('href')?.split('chapter/')[1]!,
              title: $(el).find('span > a').text(),
              views: parseInt($(el).find('span:nth-child(2)').text()!.replace(/,/g, '').trim()),
              releasedDate: $(el).find('span:nth-child(3)').attr('title'),
            })
          )
          .get();
      } else {
        mangaInfo.title = $(' div.panel-story-info > div.story-info-right > h1').text();
        mangaInfo.altTitles = $(
          'div.story-info-right > table > tbody > tr:nth-child(1) > td.table-value > h2'
        )
          .text()
          .split(';');
        mangaInfo.description = $('#panel-story-info-description')
          .text()
          .replace(`Description :`, '')
          .replace(/\n/g, '')
          .trim();
        mangaInfo.headerForImage = { Referer: 'https://readmanganato.com' };
        mangaInfo.image = $('div.story-info-left > span.info-image > img').attr('src');
        mangaInfo.genres = $('div.story-info-right > table > tbody > tr:nth-child(4) > td.table-value > a')
          .map((i, el) => $(el).text())
          .get();

        switch ($('div.story-info-right > table > tbody > tr:nth-child(3) > td.table-value').text().trim()) {
          case 'Completed':
            mangaInfo.status = MediaStatus.COMPLETED;
            break;
          case 'Ongoing':
            mangaInfo.status = MediaStatus.ONGOING;
            break;
          default:
            mangaInfo.status = MediaStatus.UNKNOWN;
        }
        mangaInfo.views = parseInt(
          $('div.story-info-right > div > p:nth-child(2) > span.stre-value').text().replace(/,/g, '').trim()
        );
        mangaInfo.authors = $('div.story-info-right > table > tbody > tr:nth-child(2) > td.table-value > a')
          .map((i, el) => $(el).text())
          .get();

        mangaInfo.chapters = $('div.container-main-left > div.panel-story-chapter-list > ul > li')
          .map(
            (i, el): IMangaChapter => ({
              id: $(el).find('a').attr('href')?.split('.com/')[1]! + '$$READMANGANATO',
              title: $(el).find('a').text(),
              views: parseInt($(el).find('span.chapter-view.text-nowrap').text()!.replace(/,/g, '').trim()),
              releasedDate: $(el).find('span.chapter-time.text-nowrap').attr('title'),
            })
          )
          .get();
      }

      return mangaInfo;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  override fetchChapterPages = async (chapterId: string): Promise<IMangaChapterPage[]> => {
    try {
      const url = !chapterId.includes('$$READMANGANATO')
        ? `${this.baseUrl}/chapter/${chapterId}`
        : `https://readmanganato.com/${chapterId.replace('$$READMANGANATO', '')}`;
      const { data } = await this.client.get(url);
      const $ = load(data);

      const pages = $('div.container-chapter-reader > img')
        .map(
          (i, el): IMangaChapterPage => ({
            img: $(el).attr('src')!,
            page: i,
            title: $(el)
              .attr('alt')
              ?.replace(/(- Mangakakalot.com)|(- MangaNato.com)/g, ' ')
              .trim()!,
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
      const { data } = await this.client.get(`${this.baseUrl}/search/story/${query.replace(/ /g, '_')}`);
      const $ = load(data);

      const results = $('div.daily-update > div > div')
        .map(
          (i, el): IMangaResult => ({
            id: $(el).find('div > h3 > a').attr('href')?.split('/')[3]!,
            title: $(el).find('div > h3 > a').text(),
            image: $(el).find('a > img').attr('src'),
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

export default MangaKakalot;
