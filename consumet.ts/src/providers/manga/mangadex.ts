import { encode } from 'ascii-url-encoder';
import { AxiosError, AxiosResponse } from 'axios';

import { IMangaChapterPage, IMangaInfo, IMangaResult, ISearch, MangaParser, MediaStatus } from '../../models';
import { capitalizeFirstLetter, substringBefore } from '../../utils';

class MangaDex extends MangaParser {
  override readonly name = 'MangaDex';
  protected override baseUrl = 'https://mangadex.org';
  protected override logo = 'https://pbs.twimg.com/profile_images/1391016345714757632/xbt_jW78_400x400.jpg';
  protected override classPath = 'MANGA.MangaDex';

  private readonly apiUrl = 'https://api.mangadex.org';

  override fetchMangaInfo = async (mangaId: string): Promise<IMangaInfo> => {
    try {
      const { data } = await this.client.get(`${this.apiUrl}/manga/${mangaId}`);
      const mangaInfo: IMangaInfo = {
        id: data.data.id,
        title: data.data.attributes.title.en,
        altTitles: data.data.attributes.altTitles,
        description: data.data.attributes.description,
        genres: data.data.attributes.tags
          .filter((tag: any) => tag.attributes.group === 'genre')
          .map((tag: any) => tag.attributes.name.en),
        themes: data.data.attributes.tags
          .filter((tag: any) => tag.attributes.group === 'theme')
          .map((tag: any) => tag.attributes.name.en),
        status: capitalizeFirstLetter(data.data.attributes.status) as MediaStatus,
        releaseDate: data.data.attributes.year,
        chapters: [],
      };

      const allChapters = await this.fetchAllChapters(mangaId, 0);
      for (const chapter of allChapters) {
        mangaInfo.chapters?.push({
          id: chapter.id,
          title: chapter.attributes.title ? chapter.attributes.title : chapter.attributes.chapter,
          chapterNumber: chapter.attributes.chapter,
          volumeNumber: chapter.attributes.volume,
          pages: chapter.attributes.pages,
        });
      }

      const findCoverArt = data.data.relationships.find((rel: any) => rel.type === 'cover_art');
      const coverArt = await this.fetchCoverImage(findCoverArt?.id);
      mangaInfo.image = `${this.baseUrl}/covers/${mangaInfo.id}/${coverArt}`;

      return mangaInfo;
    } catch (err) {
      if ((err as AxiosError).code == 'ERR_BAD_REQUEST')
        throw new Error(`[${this.name}] Bad request. Make sure you have entered a valid query.`);

      throw new Error((err as Error).message);
    }
  };

  /**
   * @currently only supports english
   */
  override fetchChapterPages = async (chapterId: string): Promise<IMangaChapterPage[]> => {
    try {
      const res = await this.client.get(`${this.apiUrl}/at-home/server/${chapterId}`);
      const pages: { img: string; page: number }[] = [];

      for (const id of res.data.chapter.data) {
        pages.push({
          img: `${res.data.baseUrl}/data/${res.data.chapter.hash}/${id}`,
          page: parseInt(substringBefore(id, '-').replace(/[^0-9.]/g, '')),
        });
      }
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
    if (page <= 0) throw new Error('Page number must be greater than 0');
    if (limit > 100) throw new Error('Limit must be less than or equal to 100');
    if (limit * (page - 1) >= 10000) throw new Error('not enough results');

    try {
      const res = await this.client.get(
        `${this.apiUrl}/manga?limit=${limit}&title=${encode(query)}&limit=${limit}&offset=${
          limit * (page - 1)
        }&order[relevance]=desc`
      );

      if (res.data.result == 'ok') {
        const results: ISearch<IMangaResult> = {
          currentPage: page,
          results: [],
        };

        for (const manga of res.data.data) {
          results.results.push({
            id: manga.id,
            title: Object.values(manga.attributes.title)[0] as string,
            altTitles: manga.attributes.altTitles,
            description: Object.values(manga.attributes.description)[0] as string,
            status: manga.attributes.status,
            releaseDate: manga.attributes.year,
            contentRating: manga.attributes.contentRating,
            lastVolume: manga.attributes.lastVolume,
            lastChapter: manga.attributes.lastChapter,
          });
        }

        return results;
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      if ((err as AxiosError).code == 'ERR_BAD_REQUEST') {
        throw new Error('Bad request. Make sure you have entered a valid query.');
      }

      throw new Error((err as Error).message);
    }
  };
  fetchRandom = async (
  ): Promise<ISearch<IMangaResult>> => {
    try {
      const res = await this.client.get(
        `${this.apiUrl}/manga/random`
      );

      if (res.data.result == 'ok') {
        const results: ISearch<IMangaResult> = {
          currentPage: 1,
          results: [],
        };

          results.results.push({
            id: res.data.data.id,
            title: Object.values(res.data.data.attributes.title)[0] as string,
            altTitles: res.data.data.attributes.altTitles,
            description: Object.values(res.data.data.attributes.description)[0] as string,
            status: res.data.data.attributes.status,
            releaseDate: res.data.data.attributes.year,
            contentRating: res.data.data.attributes.contentRating,
            lastVolume: res.data.data.attributes.lastVolume,
            lastChapter: res.data.data.attributes.lastChapter,
          });
        

        return results;
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
  fetchRecentlyAdded = async (
    page: number = 1,
    limit: number = 20
  ): Promise<ISearch<IMangaResult>> => {
    if (page <= 0) throw new Error('Page number must be greater than 0');
    if (limit > 100) throw new Error('Limit must be less than or equal to 100');
    if (limit * (page - 1) >= 10000) throw new Error('not enough results');

    try {
      const res = await this.client.get(
        `${this.apiUrl}/manga?includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[createdAt]=desc&hasAvailableChapters=true&limit=${limit}&offset=${
          limit * (page - 1)
        }`
      );

      if (res.data.result == 'ok') {
        const results: ISearch<IMangaResult> = {
          currentPage: page,
          results: [],
        };

        for (const manga of res.data.data) {
          results.results.push({
            id: manga.id,
            title: Object.values(manga.attributes.title)[0] as string,
            altTitles: manga.attributes.altTitles,
            description: Object.values(manga.attributes.description)[0] as string,
            status: manga.attributes.status,
            releaseDate: manga.attributes.year,
            contentRating: manga.attributes.contentRating,
            lastVolume: manga.attributes.lastVolume,
            lastChapter: manga.attributes.lastChapter,
          });
        }

        return results;
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {

      throw new Error((err as Error).message);
    }
  };
  fetchLatestUpdates = async (
    page: number = 1,
    limit: number = 20
  ): Promise<ISearch<IMangaResult>> => {
    if (page <= 0) throw new Error('Page number must be greater than 0');
    if (limit > 100) throw new Error('Limit must be less than or equal to 100');
    if (limit * (page - 1) >= 10000) throw new Error('not enough results');

    try {
      const res = await this.client.get(
        `${this.apiUrl}/manga?order[latestUploadedChapter]=desc&limit=${limit}&offset=${
          limit * (page - 1)
        }`
      );

      if (res.data.result == 'ok') {
        const results: ISearch<IMangaResult> = {
          currentPage: page,
          results: [],
        };

        for (const manga of res.data.data) {
          results.results.push({
            id: manga.id,
            title: Object.values(manga.attributes.title)[0] as string,
            altTitles: manga.attributes.altTitles,
            description: Object.values(manga.attributes.description)[0] as string,
            status: manga.attributes.status,
            releaseDate: manga.attributes.year,
            contentRating: manga.attributes.contentRating,
            lastVolume: manga.attributes.lastVolume,
            lastChapter: manga.attributes.lastChapter,
          });
        }

        return results;
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
  fetchPopular = async (
    page: number = 1,
    limit: number = 20
  ): Promise<ISearch<IMangaResult>> => {
    if (page <= 0) throw new Error('Page number must be greater than 0');
    if (limit > 100) throw new Error('Limit must be less than or equal to 100');
    if (limit * (page - 1) >= 10000) throw new Error('not enough results');

    try {
      const res = await this.client.get(
        `${this.apiUrl}/manga?includes[]=cover_art&includes[]=artist&includes[]=author&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&hasAvailableChapters=true&limit=${limit}&offset=${
          limit * (page - 1)
        }`
      );

      if (res.data.result == 'ok') {
        const results: ISearch<IMangaResult> = {
          currentPage: page,
          results: [],
        };

        for (const manga of res.data.data) {
          results.results.push({
            id: manga.id,
            title: Object.values(manga.attributes.title)[0] as string,
            altTitles: manga.attributes.altTitles,
            description: Object.values(manga.attributes.description)[0] as string,
            status: manga.attributes.status,
            releaseDate: manga.attributes.year,
            contentRating: manga.attributes.contentRating,
            lastVolume: manga.attributes.lastVolume,
            lastChapter: manga.attributes.lastChapter,
          });
        }

        return results;
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
  private fetchAllChapters = async (
    mangaId: string,
    offset: number,
    res?: AxiosResponse<any, any>
  ): Promise<any[]> => {
    if (res?.data?.offset + 96 >= res?.data?.total) {
      return [];
    }

    const response = await this.client.get(
      `${this.apiUrl}/manga/${mangaId}/feed?offset=${offset}&limit=96&order[volume]=desc&order[chapter]=desc&translatedLanguage[]=en`
    );

    return [...response.data.data, ...(await this.fetchAllChapters(mangaId, offset + 96, response))];
  };

  private fetchCoverImage = async (coverId: string): Promise<string> => {
    const { data } = await this.client.get(`${this.apiUrl}/cover/${coverId}`);

    const fileName = data.data.attributes.fileName;

    return fileName;
  };
}

// (async () => {
//   const md = new MangaDex();
//   const search = await md.search('solo leveling');
//   const manga = await md.fetchMangaInfo(search.results[0].id);
//   const chapterPages = await md.fetchChapterPages(manga.chapters![0].id);
//   console.log(chapterPages);
// })();

export default MangaDex;
