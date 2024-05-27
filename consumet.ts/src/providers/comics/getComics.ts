import { load } from 'cheerio';
import { ComicParser, ComicRes, GetComicsComics, GetComicsComicsObject } from '../../models';
import { parsePostInfo } from '../../utils';

const s = async () => {};

class getComics extends ComicParser {
  override readonly baseUrl = 'https://getcomics.info/';
  override readonly name = 'GetComics';

  override readonly logo =
    'https://i0.wp.com/getcomics.info/share/uploads/2020/04/cropped-GetComics-Favicon.png?fit=192%2C192&ssl=1';
  override readonly classPath = 'COMICS.GetComics';

  override search = async (query: string, page: number | undefined = 1) => {
    query = encodeURIComponent(query);
    const { data } = await this.client.get(`${this.baseUrl}/page/${page ? page : 1}/?s=${query}`);
    const $ = load(data);
    const lastPage = $('section section nav:eq(1) ul li:last').text();
    const res: ComicRes = {
      containers: [],
      hasNextPage: $('a.pagination-older').text() != '',
    };
    $('article').each((i, el) => {
      const container: GetComicsComics = new GetComicsComicsObject();
      const vals = parsePostInfo($(el).children('div.post-info').text());
      container.image =
        $(el).children('div.post-header-image').children('a').children('img').attr('src') || '';
      container.title = $(el).children('div.post-info').children('h1').text();
      container.excerpt = $(el).children('div.post-info').children('p.post-excerpt').text();
      container.year = vals.year;
      container.size = vals.size;
      container.description = vals.description;
      const link = $(el).children('div.post-header-image').children('a').attr('href');
      container.ufile = link || '';
      res.containers.push(container);
    });
    for (const container of res.containers) {
      if (container.ufile != '') {
        const { data } = await this.client.get(container.ufile);
        const $ = load(data);
        container.download = $('.aio-red[title="Download Now"]').attr('href') || '';
        container.readOnline = $('.aio-red[title="Read Online"]').attr('href') || '';
        container.ufile = $('.aio-blue').attr('href') || '';
        container.mega = $('.aio-purple').attr('href') || '';
        container.mediafire = $('.aio-orange').attr('href') || '';
        container.zippyshare = $('.aio-gray').attr('href') || '';
      }
    }
    return res;
  };
}

export default getComics;
