import { VideoExtractor, IVideo } from '../models';

class MixDrop extends VideoExtractor {
  protected override serverName = 'MixDrop';
  protected override sources: IVideo[] = [];

  override extract = async (videoUrl: URL): Promise<IVideo[]> => {
    try {
      const { data } = await this.client.get(videoUrl.href);

      const formated = eval(/(eval)(\(f.*?)(\n<\/script>)/s.exec(data)![2].replace('eval', ''));

      const [poster, source] = formated
        .match(/poster="([^"]+)"|wurl="([^"]+)"/g)
        .map((x: string) => x.split(`="`)[1].replace(/"/g, ''))
        .map((x: string) => (x.startsWith('http') ? x : `https:${x}`));

      this.sources.push({
        url: source,
        isM3U8: source.includes('.m3u8'),
        poster: poster,
      });

      return this.sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}
export default MixDrop;
