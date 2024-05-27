import { BaseParser } from '.';

abstract class LightNovelParser extends BaseParser {
  /**
   * takes light novel link or id
   *
   * returns lightNovel info (including chapters)
   */
  protected abstract fetchLightNovelInfo(lightNovelUrl: string, ...args: any): Promise<unknown>;

  /**
   * takes chapter id
   *
   * returns chapter content (text)
   */
  protected abstract fetchChapterContent(chapterId: string, ...args: any): Promise<unknown>;
}

export default LightNovelParser;
