import { VideoExtractor, IVideo, ISubtitle } from '../models';

class Mp4Player extends VideoExtractor {
  protected override serverName = 'mp4player';
  protected override sources: IVideo[] = [];

  private readonly domains = ['mp4player.site'];

  override extract = async (videoUrl: URL): Promise<{ sources: IVideo[] } & { subtitles: ISubtitle[] }> => {
    try {
      const result: { sources: IVideo[]; subtitles: ISubtitle[] } = {
        sources: [],
        subtitles: [],
      };

      const response = await this.client.get(videoUrl.href);

      const data = response.data
        .match(new RegExp('(?<=sniff\\()(.*)(?=\\))'))[0]
        ?.replace(/\"/g, '')
        ?.split(',');

      const link = `https://${videoUrl.host}/m3u8/${data[1]}/${data[2]}/master.txt?s=1&cache=${data[7]}`;
      //const thumbnails = response.data.match(new RegExp('(?<=file":")(.*)(?=","kind)'))[0]?.replace(/\\/g, '');

      const m3u8Content = await this.client.get(link, {
        headers: {
          accept: '*/*',
          referer: videoUrl.href,
        },
      });

      if (m3u8Content.data.includes('EXTM3U')) {
        const videoList = m3u8Content.data.split('#EXT-X-STREAM-INF:');
        for (const video of videoList ?? []) {
          if (video.includes('BANDWIDTH')) {
            const url = video.split('\n')[1];
            const quality = video.split('RESOLUTION=')[1].split('\n')[0].split('x')[1];

            result.sources.push({
              url: url,
              quality: `${quality}`,
              isM3U8: url.includes('.m3u8'),
            });
          }
        }
      }

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}
export default Mp4Player;
