import { VideoExtractor, IVideo } from '../models';

class Voe extends VideoExtractor {
  protected override serverName = 'voe';
  protected override sources: IVideo[] = [];

  private readonly domains = ['voe.sx'];

  override extract = async (videoUrl: URL): Promise<IVideo[]> => {
    try {
      const { data } = await this.client.get(videoUrl.href);

      const links = data.match(/'hls': ?'(http.*?)',/);
      const quality = data.match(/'video_height': ?([0-9]+),/)[1];

      this.sources.push({
        quality: quality,
        url: links[1],
        isM3U8: links[1].includes('.m3u8'),
      });

      return this.sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default Voe;
