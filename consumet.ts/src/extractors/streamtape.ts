import { load } from 'cheerio';

import { VideoExtractor, IVideo } from '../models';

class StreamTape extends VideoExtractor {
  protected override serverName = 'StreamTape';
  protected override sources: IVideo[] = [];

  override extract = async (videoUrl: URL): Promise<IVideo[]> => {
    try {
      const { data } = await this.client.get(videoUrl.href).catch(() => {
        throw new Error('Video not found');
      });

      const $ = load(data);

      let [fh, sh] = $.html()
        ?.match(/robotlink'\).innerHTML = (.*)'/)![1]
        .split("+ ('");

      sh = sh.substring(3);
      fh = fh.replace(/\'/g, '');

      const url = `https:${fh}${sh}`;

      this.sources.push({
        url: url,
        isM3U8: url.includes('.m3u8'),
      });

      return this.sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}
export default StreamTape;
