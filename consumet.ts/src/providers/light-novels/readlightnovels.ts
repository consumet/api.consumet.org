import { load } from 'cheerio';
import FormData from 'form-data';

import {
  LightNovelParser,
  ISearch,
  ILightNovelInfo,
  ILightNovelChapter,
  ILightNovelChapterContent,
  ILightNovelResult,
  MediaStatus,
} from '../../models';
import { USER_AGENT } from '../../utils';

class ReadLightNovels extends LightNovelParser {
  override readonly name = 'Read Light Novels';
  protected override baseUrl = 'https://readlightnovels.net';

  protected override logo = 'https://i.imgur.com/RDPjbc6.png';
  protected override classPath = 'LIGHT_NOVELS.ReadLightNovels';

  /**
   *
   * @param lightNovelUrl light novel link or id
   * @param chapterPage chapter page number (optional) if not provided, will fetch all chapter pages.
   */
  override fetchLightNovelInfo = async (
    lightNovelUrl: string,
    chapterPage: number = -1
  ): Promise<ILightNovelInfo> => {
    if (!lightNovelUrl.startsWith(this.baseUrl)) {
      lightNovelUrl = `${this.baseUrl}/${lightNovelUrl}.html`;
    }
    const lightNovelInfo: ILightNovelInfo = {
      id: lightNovelUrl.split('/')?.pop()?.replace('.html', '')!,
      title: '',
      url: lightNovelUrl,
    };

    try {
      const page = await this.client.get(lightNovelUrl, {
        headers: {
          Referer: lightNovelUrl,
        },
      });

      const $ = load(page.data);

      const novelId = parseInt($('#id_post').val() as string);
      lightNovelInfo.title = $('div.col-xs-12.col-sm-8.col-md-8.desc > h3').text();
      lightNovelInfo.image = $('div.col-xs-12.col-sm-4.col-md-4.info-holder > div.books > div > img').attr(
        'src'
      );
      lightNovelInfo.author = $(
        'div.col-xs-12.col-sm-4.col-md-4.info-holder > div.info > div:nth-child(1) > a'
      ).text();
      lightNovelInfo.genres = $(
        ' div.col-xs-12.col-sm-4.col-md-4.info-holder > div.info > div:nth-child(2) > a'
      )
        .map((i, el) => $(el).text())
        .get();
      lightNovelInfo.rating = parseFloat(
        $(
          'div.col-xs-12.col-sm-8.col-md-8.desc > div.rate > div.small > em > strong:nth-child(1) > span'
        ).text()
      );
      lightNovelInfo.views = parseInt(
        $('div.col-xs-12.col-sm-4.col-md-4.info-holder > div.info > div:nth-child(4) > span').text()
      );
      lightNovelInfo.description = $('div.col-xs-12.col-sm-8.col-md-8.desc > div.desc-text > hr')
        .eq(0)
        .nextUntil('hr')
        .text();
      const pages = Math.max(
        ...$('#pagination > ul > li')
          .map((i, el) => parseInt($(el).find('a').attr('data-page')!))
          .get()
          .filter(x => !isNaN(x))
      );

      switch ($('div.col-xs-12.col-sm-4.col-md-4.info-holder > div.info > div:nth-child(3) > span').text()) {
        case 'Completed':
          lightNovelInfo.status = MediaStatus.COMPLETED;
          break;
        case 'On Going':
          lightNovelInfo.status = MediaStatus.ONGOING;
          break;
        default:
          lightNovelInfo.status = MediaStatus.UNKNOWN;
          break;
      }

      lightNovelInfo.pages = pages;
      lightNovelInfo.chapters = [];
      if (chapterPage === -1) {
        lightNovelInfo.chapters = await this.fetchAllChapters(novelId, pages, lightNovelUrl);
      } else {
        lightNovelInfo.chapters = await this.fetchChapters(novelId, chapterPage, lightNovelUrl);
      }

      return lightNovelInfo;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
  private fetchChapters = async (
    novelId: number,
    chapterPage: number,
    referer: string
  ): Promise<ILightNovelChapter[]> => {
    const chapters: ILightNovelChapter[] = [];

    const bodyFormData = new FormData();
    bodyFormData.append('action', 'tw_ajax');
    bodyFormData.append('type', 'pagination');
    bodyFormData.append('page', chapterPage);
    bodyFormData.append('id', novelId);

    const page = await this.client({
      method: 'post',
      url: `${this.baseUrl}/wp-admin/admin-ajax.php`,
      data: bodyFormData,
      headers: {
        referer: referer,
        'content-type': 'multipart/form-data',
        origin: this.baseUrl,
        'user-agent': USER_AGENT,
      },
    });

    const $ = load(page.data.list_chap);

    for (const chapter of $('ul.list-chapter > li')) {
      const subId = $(chapter).find('a').attr('href')!.split('/')?.pop()!.replace('.html', '')!;
      const id = $(chapter).find('a').attr('href')!.split('/')[3];
      chapters.push({
        id: `${id}/${subId}`,
        title: $(chapter).find('a > span').text().trim(),
        url: $(chapter).find('a').attr('href'),
      });
    }
    return chapters;
  };
  private fetchAllChapters = async (novelId: number, pages: number, referer: string): Promise<any> => {
    const chapters: ILightNovelChapter[] = [];

    for (const pageNumber of Array.from({ length: pages }, (_, i) => i + 1)) {
      const chaptersPage = await this.fetchChapters(novelId, pageNumber, referer);
      chapters.push(...chaptersPage);
    }
    return chapters;
  };

  /**
   *
   * @param chapterId chapter id or url
   */
  override fetchChapterContent = async (chapterId: string): Promise<ILightNovelChapterContent> => {
    if (!chapterId.startsWith(this.baseUrl)) {
      chapterId = `${this.baseUrl}/${chapterId}.html`;
    }
    const contents: ILightNovelChapterContent = {
      novelTitle: '',
      chapterTitle: '',
      text: '',
    };

    try {
      const page = await this.client.get(chapterId);
      const $ = load(page.data);

      contents.novelTitle = $('.truyen-title').text();
      contents.chapterTitle = $('.chapter-title').text();
      for (const line of $('div.chapter-content > p')) {
        if ($(line).text() != '﻿') {
          contents.text += `${$(line).text()}\n`;
        }
      }

      return contents;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  /**
   *
   * @param query search query string
   */
  override search = async (query: string): Promise<ISearch<ILightNovelResult>> => {
    const result: ISearch<ILightNovelResult> = { results: [] };
    try {
      const res = await this.client.post(`${this.baseUrl}/?s=${query}`);
      const $ = load(res.data);

      $(
        'div.col-xs-12.col-sm-12.col-md-9.col-truyen-main > div:nth-child(1) > div > div:nth-child(2) > div.col-md-3.col-sm-6.col-xs-6.home-truyendecu'
      ).each((i, el) => {
        result.results.push({
          id: $(el).find('a').attr('href')?.split('/')[3]!.replace('.html', '')!,
          title: $(el).find('a > div > h3').text(),
          url: $(el).find('a').attr('href')!,
          image: $(el).find('a > img').attr('src'),
        });
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default ReadLightNovels;

// (async () => {
//   const ln = new ReadLightNovels();
//   const chap = await ln.fetchChapterContent('youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e/volume-1-prologue-the-structure-of-japanese-society');
//   console.log(chap);
// })();
