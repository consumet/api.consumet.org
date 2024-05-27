import { VideoExtractor, IVideo } from '../models';

class Mp4Upload extends VideoExtractor {
  protected override serverName = 'mp4upload';
  protected override sources: IVideo[] = [];

  override extract = async (videoUrl: URL): Promise<IVideo[]> => {
    try {
      const { data } = await this.client.get(videoUrl.href);

      const playerSrc = data.match(
        /(?<=player\.src\()\s*{\s*type:\s*"[^"]+",\s*src:\s*"([^"]+)"\s*}\s*(?=\);)/s
      );
      const streamUrl = playerSrc[1];

      if (!streamUrl) throw new Error('Stream url not found');

      this.sources.push({
        quality: 'auto',
        url: streamUrl,
        isM3U8: streamUrl.includes('.m3u8'),
      });

      return this.sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}
export default Mp4Upload;
