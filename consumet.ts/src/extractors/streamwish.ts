import { VideoExtractor, IVideo } from '../models';
import { USER_AGENT } from '../utils';
class StreamWish extends VideoExtractor {
  protected override serverName = 'streamwish';
  protected override sources: IVideo[] = [];

  override extract = async (videoUrl: URL): Promise<IVideo[]> => {
    try {
      const options = {
        headers: {
            'User-Agent': USER_AGENT,
        },
      };
      const { data } = await this.client.get(videoUrl.href, options);
      const links = data.match(/file:\s*"([^"]+)"/);
      let lastLink = null;
      links.forEach((link: string) => {
        if(link.includes('file:"')){
          link = link.replace('file:"', '').replace(new RegExp('"', 'g'), '');
        }
        this.sources.push({
          quality: lastLink! ? 'backup' : 'default',
          url: link,
          isM3U8: link.includes('.m3u8'),
        });
        lastLink = link;
      });

      const m3u8Content = await this.client.get(links[1], {
        headers: {
          Referer: videoUrl.href,
        },
      });

      if (m3u8Content.data.includes('EXTM3U')) {
        const videoList = m3u8Content.data.split('#EXT-X-STREAM-INF:');
        for (const video of videoList ?? []) {
          if (!video.includes('m3u8')) continue;

          const url = links[1].split('master.m3u8')[0] + video.split('\n')[1];
          const quality = video.split('RESOLUTION=')[1].split(',')[0].split('x')[1];

          this.sources.push({
            url: url,
            quality: `${quality}`,
            isM3U8: url.includes('.m3u8'),
          });
        }
      }

      return this.sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}
export default StreamWish;
