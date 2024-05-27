import axios, { AxiosError } from 'axios';
import { IMangaChapterPage, IMangaInfo, IMangaResult, ISearch, MangaParser, MediaStatus } from '../../models';

class ComicK extends MangaParser {
  override readonly name = 'ComicK';
  protected override baseUrl = 'https://comick.app';
  protected override logo = 'https://th.bing.com/th/id/OIP.fw4WrmAoA2PmKitiyMzUIgAAAA?pid=ImgDet&rs=1';
  protected override classPath = 'MANGA.ComicK';

  private readonly apiUrl = 'https://api.comick.io';

  private _axios() {
    return axios.create({
      baseURL: this.apiUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });
  }

  /**
   * @description Fetches info about the manga
   * @param mangaId Comic slug
   * @returns Promise<IMangaInfo>
   */
  override fetchMangaInfo = async (mangaId: string): Promise<IMangaInfo> => {
    try {
      const req = await this._axios().get(`/comic/${mangaId}`);
      const data: Comic = req.data.comic;

      const links = Object.values(data.links ?? []).filter(link => link !== null);

      const mangaInfo: IMangaInfo = {
        id: data.hid,
        title: data.title,
        altTitles: data.md_titles ? data.md_titles.map(title => title.title) : [],
        description: data.desc,
        genres: data.md_comic_md_genres?.map(genre => genre.md_genres.name),
        status: data.status ?? 0 === 0 ? MediaStatus.ONGOING : MediaStatus.COMPLETED,
        image: `https://meo.comick.pictures${data.md_covers ? data.md_covers[0].b2key : ''}`,
        malId: data.links?.mal,
        links: links,
        chapters: [],
      };

      const allChapters: ChapterData[] = await this.fetchAllChapters(mangaId, 1);
      for (const chapter of allChapters) {
        mangaInfo.chapters?.push({
          id: chapter.hid,
          title: chapter.title ?? chapter.chap,
          chapterNumber: chapter.chap,
          volumeNumber: chapter.vol,
          releaseDate: chapter.created_at,
        });
      }

      return mangaInfo;
    } catch (err) {
      if ((err as AxiosError).code == 'ERR_BAD_REQUEST')
        throw new Error(`[${this.name}] Bad request. Make sure you have entered a valid query.`);

      throw new Error((err as Error).message);
    }
  };

  /**
   *
   * @param chapterId Chapter ID (HID)
   * @returns Promise<IMangaChapterPage[]>
   */
  override fetchChapterPages = async (chapterId: string): Promise<IMangaChapterPage[]> => {
    try {
      const { data } = await this._axios().get(`/chapter/${chapterId}`);

      const pages: { img: string; page: number }[] = [];

      data.chapter.md_images.map((image: { b2key: string; w: string }, index: number) => {
        pages.push({
          img: `https://meo.comick.pictures/${image.b2key}?width=${image.w}`,
          page: index,
        });
      });

      return pages;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  /**
   * @param query search query
   * @param page page number (default: 1)
   * @param limit limit of results to return (default: 20) (max: 100) (min: 1)
   */
  override search = async (
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ISearch<IMangaResult>> => {
    if (page < 1) throw new Error('Page number must be greater than 1');
    if (limit > 300) throw new Error('Limit must be less than or equal to 300');
    if (limit * (page - 1) >= 10000) throw new Error('not enough results');

    try {
      const req = await this._axios().get(
        `/v1.0/search?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}`
      );

      const results: ISearch<IMangaResult> = {
        currentPage: page,
        results: [],
      };

      const data: SearchResult[] = await req.data;

      for (const manga of data) {
        let cover: Cover | string | null = manga.md_covers ? manga.md_covers[0] : null;
        if (cover && cover.b2key != undefined) {
          cover = `https://meo.comick.pictures${cover.b2key}`;
        }

        results.results.push({
          id: manga.slug,
          title: manga.title ?? manga.slug,
          altTitles: manga.md_titles ? manga.md_titles.map(title => title.title) : [],
          image: cover as string,
        });
      }

      return results;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  private fetchAllChapters = async (mangaId: string, page: number): Promise<any[]> => {
    if (page <= 0) {
      page = 1;
    }
    const comicId = await this.getComicId(mangaId);
    const req = await this._axios().get(`/comic/${comicId}/chapters?page=${page}`);
    return req.data.chapters;
  };

  /**
   * @description Fetches the comic HID from the slug
   * @param id Comic slug
   * @returns Promise<string> empty if not found
   */
  private async getComicId(id: string): Promise<string> {
    const req = await this._axios().get(`/comic/${id}`);
    const data: Comic = req.data['comic'];
    return data ? data.hid : '';
  }
}

// (async () => {
//   const md = new MangaDex();
//   const search = await md.search('solo leveling');
//   const manga = await md.fetchMangaInfo(search.results[0].id);
//   const chapterPages = await md.fetchChapterPages(manga.chapters![0].id);
//   console.log(chapterPages);
// })();

export default ComicK;

interface SearchResult {
  title: string;
  id: number;
  slug: string;
  rating: string;
  rating_count: number;
  follow_count: number;
  user_follow_count: number;
  content_rating: string;
  demographic: number;
  md_titles: [MDTitle];
  md_covers: Array<Cover>;
  highlight: string;
}

interface Cover {
  vol: any;
  w: number;
  h: number;
  b2key: string;
}

interface MDTitle {
  title: string;
}

interface Comic {
  hid: string;
  title: string;
  country: string;
  status: number;
  links: ComicLinks;
  last_chapter: any;
  chapter_count: number;
  demographic: number;
  hentai: boolean;
  user_follow_count: number;
  follow_rank: number;
  comment_count: number;
  follow_count: number;
  desc: string;
  parsed: string;
  slug: string;
  mismatch: any;
  year: number;
  bayesian_rating: any;
  rating_count: number;
  content_rating: string;
  translation_completed: boolean;
  relate_from: Array<any>;
  mies: any;
  md_titles: Array<ComicTitles>;
  md_comic_md_genres: Array<ComicGenres>;
  mu_comics: {
    licensed_in_english: any;
    mu_comic_categories: Array<ComicCategories>;
  };
  md_covers: Array<Cover>;
  iso639_1: string;
  lang_name: string;
  lang_native: string;
}

interface ComicLinks {
  al: string;
  ap: string;
  bw: string;
  kt: string;
  mu: string;
  amz: string;
  cdj: string;
  ebj: string;
  mal: string;
  raw: string;
}

interface ComicTitles {
  title: string;
}

interface ComicGenres {
  md_genres: {
    name: string;
    type: string | null;
    slug: string;
    group: string;
  };
}

interface ComicCategories {
  mu_categories: {
    title: string;
    slug: string;
  };
  positive_vote: number;
  negative_vote: number;
}

interface ChapterData {
  id: number;
  chap: string;
  title: string;
  vol: string;
  slug: string | null;
  lang: string;
  created_at: string;
  updated_at: string;
  up_count: number;
  down_count: number;
  group_name: string[];
  hid: string;
  md_groups: string[];
}
