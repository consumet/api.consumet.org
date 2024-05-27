import { load } from 'cheerio';

import { MangaParser, ISearch, IMangaInfo, IMangaResult, MediaStatus, IMangaChapterPage } from '../../models';

class MangaHere extends MangaParser {
  override readonly name = 'MangaHere';
  protected override baseUrl = 'http://www.mangahere.cc';
  protected override logo = 'https://i.pinimg.com/564x/51/08/62/51086247ed16ff8abae2df0bb06448e4.jpg';
  protected override classPath = 'MANGA.MangaHere';

  override fetchMangaInfo = async (mangaId: string): Promise<IMangaInfo> => {
    const mangaInfo: IMangaInfo = {
      id: mangaId,
      title: '',
    };
    try {
      const { data } = await this.client.get(`${this.baseUrl}/manga/${mangaId}`, {
        headers: {
          cookie: 'isAdult=1',
        },
      });

      const $ = load(data);

      mangaInfo.title = $('span.detail-info-right-title-font').text();
      mangaInfo.description = $('div.detail-info-right > p.fullcontent').text();
      mangaInfo.headers = { Referer: this.baseUrl };
      mangaInfo.image = $('div.detail-info-cover > img').attr('src');
      mangaInfo.genres = $('p.detail-info-right-tag-list > a')
        .map((i, el) => $(el).attr('title')?.trim())
        .get();
      switch ($('span.detail-info-right-title-tip').text()) {
        case 'Ongoing':
          mangaInfo.status = MediaStatus.ONGOING;
          break;
        case 'Completed':
          mangaInfo.status = MediaStatus.COMPLETED;
          break;
        default:
          mangaInfo.status = MediaStatus.UNKNOWN;
          break;
      }
      mangaInfo.rating = parseFloat($('span.detail-info-right-title-star > span').last().text());
      mangaInfo.authors = $('p.detail-info-right-say > a')
        .map((i, el) => $(el).attr('title'))
        .get();
      mangaInfo.chapters = $('ul.detail-main-list > li')
        .map((i, el) => ({
          id: $(el).find('a').attr('href')?.split('/manga/')[1].slice(0, -7)!,
          title: $(el).find('a > div > p.title3').text(),
          releasedDate: $(el).find('a > div > p.title2').text().trim(),
        }))
        .get();

      return mangaInfo;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  override fetchChapterPages = async (chapterId: string): Promise<IMangaChapterPage[]> => {
    const chapterPages: IMangaChapterPage[] = [];
    const url = `${this.baseUrl}/manga/${chapterId}/1.html`;

    try {
      const { data } = await this.client.get(url, {
        headers: {
          cookie: 'isAdult=1',
        },
      });

      const $ = load(data);

      const copyrightHandle =
        $('p.detail-block-content').text().match('Dear user') ||
        $('p.detail-block-content').text().match('blocked');
      if (copyrightHandle) {
        throw Error(copyrightHandle.input?.trim());
      }

      const bar = $('script[src*=chapter_bar]').data();
      const html = $.html();
      if (typeof bar !== 'undefined') {
        const ss = html.indexOf('eval(function(p,a,c,k,e,d)');
        const se = html.indexOf('</script>', ss);
        const s = html.substring(ss, se).replace('eval', '');
        const ds = eval(s) as string;

        const urls = ds.split("['")[1].split("']")[0].split("','");

        urls.map((url, i) =>
          chapterPages.push({
            page: i,
            img: `https:${url}`,
            headerForImage: { Referer: url },
          })
        );
      } else {
        let sKey = this.extractKey(html);
        const chapterIdsl = html.indexOf('chapterid');
        const chapterId = html.substring(chapterIdsl + 11, html.indexOf(';', chapterIdsl)).trim();

        const chapterPagesElmnt = $('body > div:nth-child(6) > div > span').children('a');

        const pages = parseInt(chapterPagesElmnt.last().prev().attr('data-page') ?? '0');

        const pageBase = url.substring(0, url.lastIndexOf('/'));

        let resText = '';
        for (let i = 1; i <= pages; i++) {
          const pageLink = `${pageBase}/chapterfun.ashx?cid=${chapterId}&page=${i}&key=${sKey}`;

          for (let j = 1; j <= 3; j++) {
            const { data } = await this.client.get(pageLink, {
              headers: {
                Referer: url,
                'X-Requested-With': 'XMLHttpRequest',
                cookie: 'isAdult=1',
              },
            });

            resText = data as string;

            if (resText) break;
            else sKey = '';
          }

          const ds = eval(resText.replace('eval', ''));

          const baseLinksp = ds.indexOf('pix=') + 5;
          const baseLinkes = ds.indexOf(';', baseLinksp) - 1;
          const baseLink = ds.substring(baseLinksp, baseLinkes);

          const imageLinksp = ds.indexOf('pvalue=') + 9;
          const imageLinkes = ds.indexOf('"', imageLinksp);
          const imageLink = ds.substring(imageLinksp, imageLinkes);

          chapterPages.push({
            page: i - 1,
            img: `https:${baseLink}${imageLink}`,
            headerForImage: { Referer: url },
          });
        }
      }
      return chapterPages;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  override search = async (query: string, page: number = 1): Promise<ISearch<IMangaResult>> => {
    const searchRes: ISearch<IMangaResult> = {
      currentPage: page,
      results: [],
    };
    try {
      const { data } = await this.client.get(`${this.baseUrl}/search?title=${query}&page=${page}`);
      const $ = load(data);

      searchRes.hasNextPage = $('div.pager-list-left > a.active').next().text() !== '>';

      searchRes.results = $('div.container > div > div > ul > li')
        .map(
          (i, el): IMangaResult => ({
            id: $(el).find('a').attr('href')?.split('/')[2]!,
            title: $(el).find('p.manga-list-4-item-title > a').text(),
            headerForImage: { Referer: this.baseUrl },
            image: $(el).find('a > img').attr('src'),
            description: $(el).find('p').last().text(),
            status:
              $(el).find('p.manga-list-4-show-tag-list-2 > a').text() === 'Ongoing'
                ? MediaStatus.ONGOING
                : $(el).find('p.manga-list-4-show-tag-list-2 > a').text() === 'Completed'
                ? MediaStatus.COMPLETED
                : MediaStatus.UNKNOWN,
          })
        )
        .get();
      return searchRes;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  /**
   *  credit: [tachiyomi-extensions](https://github.com/tachiyomiorg/tachiyomi-extensions/blob/master/src/en/mangahere/src/eu/kanade/tachiyomi/extension/en/mangahere/Mangahere.kt)
   */
  private extractKey = (html: string) => {
    const skss = html.indexOf('eval(function(p,a,c,k,e,d)');
    const skse = html.indexOf('</script>', skss);
    const sks = html.substring(skss, skse).replace('eval', '');

    const skds = eval(sks);

    const sksl = skds.indexOf("'");
    const skel = skds.indexOf(';');

    const skrs = skds.substring(sksl, skel);

    return eval(skrs) as string;
  };
}

export default MangaHere;
