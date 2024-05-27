import { load } from 'cheerio';
import { IVideo, ISource } from '../models';
import VideoExtractor from '../models/video-extractor';

class StreamLare extends VideoExtractor {
  protected serverName: string = 'StreamLare';
  protected sources: IVideo[] = [];

  private readonly host = 'https://streamlare.com';

  private readonly regex = new RegExp('/[ve]/([^?#&/]+)');

  private readonly USER_AGENT =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';

  async extract(
    videoUrl: URL,
    userAgent: string = this.USER_AGENT.toString(),
    ...args: any
  ): Promise<IVideo[] | ISource> {
    const res = await this.client.get(videoUrl.href);

    const $ = load(res.data);

    const CSRF_TOKEN = $('head > meta:nth-child(3)').attr('content')?.toString();

    const videoId = videoUrl.href.match(this.regex)![1];

    if (videoId == undefined) {
      throw new Error('Video id not matched!');
    }

    const POST = await this.client.post(
      this.host + '/api/video/stream/get',
      {
        id: videoId,
      },
      {
        headers: {
          'User-Agent': userAgent,
        },
      }
    );

    const POST_RES = POST.data;

    const result = {
      headers: {
        'User-Agent': userAgent,
      },
      status: POST_RES.status,
      message: POST_RES.message,
      type: POST_RES.type,
      token: POST_RES.token,
      sources: POST_RES.result,
    };

    if (POST_RES.status == 'error') {
      throw new Error('Request Failed! Error: ' + POST_RES.message);
    }

    return result;
  }
}

export default StreamLare;
