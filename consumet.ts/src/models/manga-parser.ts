import { BaseParser, IMangaInfo, IMangaChapterPage } from '.';

abstract class MangaParser extends BaseParser {
  /**
   * takes manga id
   *
   * returns manga info with chapters
   */
  abstract fetchMangaInfo(mangaId: string, ...args: any): Promise<IMangaInfo>;

  /**
   * takes chapter id
   *
   * returns chapter (image links)
   */
  abstract fetchChapterPages(chapterId: string, ...args: any): Promise<IMangaChapterPage[]>;
}

export default MangaParser;
