import { load } from 'cheerio';

import { VideoExtractor, IVideo, ISubtitle, Intro } from '../models';
import { USER_AGENT } from '../utils';
import { Console } from 'console';

/**
 * work in progress
 */
class Filemoon extends VideoExtractor {
  protected override serverName = 'Filemoon';
  protected override sources: IVideo[] = [];

  private readonly host = 'https://filemoon.sx';

  override extract = async (videoUrl: URL): Promise<IVideo[]> => {
    const options = {
      headers: {
        Referer: videoUrl.href,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT,
        'X-Requested-With': 'XMLHttpRequest',
      },
    };

    const { data } = await this.client.get(videoUrl.href);

    const s = data.substring(data.indexOf('eval(function') + 5, data.lastIndexOf(')))'));
    try {
      const newScript = 'function run(' + s.split('function(')[1] + '))';
    } catch (err) {}
    return this.sources;
  };
}

export default Filemoon;
