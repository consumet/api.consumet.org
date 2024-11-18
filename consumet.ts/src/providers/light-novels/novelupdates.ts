import { load } from 'cheerio';

import {
  LightNovelParser,
  ISearch,
  ILightNovelInfo,
  ILightNovelChapter,
  ILightNovelChapterContent,
  ILightNovelResult,
  MediaStatus,
} from '../../models';

class NovelUpdates extends LightNovelParser {
  override readonly name = 'NovelUpdates';
  protected override baseUrl = 'https://www.novelupdates.com';

  private proxyURL = 'http://translate.google.com/translate?sl=ja&tl=en&u=';

  protected override logo = 'https://www.novelupdates.com/appicon.png';
  protected override classPath = 'LIGHT_NOVELS.NovelUpdates';

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
      lightNovelUrl = `${this.baseUrl}/series/${lightNovelUrl}`;
    }
    const lightNovelInfo: ILightNovelInfo = {
      id: lightNovelUrl.split('/')?.pop()!,
      title: '',
      url: lightNovelUrl,
    };

    try {
      const page = await fetch(`${this.proxyURL}${encodeURIComponent(lightNovelUrl)}`, {
        headers: {
          Referer: lightNovelUrl,
        },
      });

      const $ = load(await page.text());

      if (
        $('title').html() === 'Just a moment...' ||
        $('title').html() === 'Attention Required! | Cloudflare'
      ) {
        throw new Error('Client is blocked from accessing the site.');
      }

      lightNovelInfo.title = $('div.seriestitlenu').text()?.trim();

      lightNovelInfo.image = $('div.seriesimg img').attr('src');
      lightNovelInfo.author = $('div#showauthors a').text();
      lightNovelInfo.genres = $('div#seriesgenre a')
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
      lightNovelInfo.description = $('div#editdescription').text()?.trim();

      const status = $('div#editstatus').text()?.trim();

      if (status.includes('Complete')) {
        lightNovelInfo.status = MediaStatus.COMPLETED;
      } else if (status.includes('Ongoing')) {
        lightNovelInfo.status = MediaStatus.ONGOING;
      } else {
        lightNovelInfo.status = MediaStatus.UNKNOWN;
      }

      const postId = $('input#mypostid').attr('value');

      lightNovelInfo.chapters = await this.fetchChapters(postId!);
      lightNovelInfo.rating =
        Number($('h5.seriesother span.uvotes').text()?.split(' /')[0]?.substring(1) ?? 0) * 2;

      return lightNovelInfo;
    } catch (err) {
      console.error(err);
      throw new Error((err as Error).message);
    }
  };
  private fetchChapters = async (postId: string): Promise<ILightNovelChapter[]> => {
    const chapters: ILightNovelChapter[] = [];

    const chapterData = (
      await (
        await fetch(`${this.baseUrl}/wp-admin/admin-ajax.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Cookie: '_ga=;',
          },
          body: `action=nd_getchapters&mypostid=${postId}&mypostid2=0`,
        })
      ).text()
    ).substring(1);

    const $ = load(chapterData);
    $('li.sp_li_chp a[data-id]').each((index, el) => {
      const id = $(el).attr('data-id');
      const title = $(el).find('span').text();

      chapters.push({
        id: id!,
        title: title!,
        url: `${this.baseUrl}/extnu/${id}`,
      });
    });

    return chapters;
  };

  /**
   *
   * @param chapterId chapter id or url
   */
  override fetchChapterContent = async (chapterId: string): Promise<ILightNovelChapterContent> => {
    if (!chapterId.startsWith(this.baseUrl)) {
      chapterId = `${this.baseUrl}/extnu/${chapterId}`;
    }
    const contents: ILightNovelChapterContent = {
      novelTitle: '',
      chapterTitle: '',
      text: '',
    };

    try {
      const page = await fetch(`${this.proxyURL}${encodeURIComponent(chapterId)}`);
      const data = await page.text();

      const $ = load(data);

      contents.novelTitle = $('title').text();
      contents.chapterTitle = $('title').text();

      contents.text = data;

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
      const res = await fetch(
        `${this.proxyURL}${encodeURIComponent(
          `${this.baseUrl}/series-finder/?sf=1&sh=${encodeURIComponent(query)}`
        )}`,
        {
          headers: {
            Referer: this.baseUrl,
          },
        }
      );

      const $ = load(await res.text());

      $('div.search_main_box_nu').each((i, el) => {
        result.results.push({
          id: $(el)
            .find('div.search_body_nu div.search_title a')
            .attr('href')
            ?.split('/series/')[1]
            .split('/')[0]!,
          title: $(el).find('div.search_body_nu div.search_title a').text(),
          url: $(el).find('div.search_body_nu div.search_title a').attr('href')!,
          image: $(el).find('div.search_img_nu img').attr('src'),
        });
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default NovelUpdates;

// (async () => {
//   const ln = new ReadLightNovels();
//   const chap = await ln.fetchChapterContent('youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e/volume-1-prologue-the-structure-of-japanese-society');
//   console.log(chap);
// })();
