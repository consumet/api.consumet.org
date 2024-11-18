import { load } from 'cheerio';
import CryptoJS from 'crypto-js';
import { substringAfter, substringBefore } from '../utils';
import { VideoExtractor, IVideo, ISubtitle, Intro, ProxyConfig } from '../models';

class RapidCloud extends VideoExtractor {
  protected override serverName = 'RapidCloud';
  protected override sources: IVideo[] = [];

  private readonly fallbackKey = 'c1d17096f2ca11b7';
  private readonly host = 'https://rapid-cloud.co';

  override extract = async (videoUrl: URL): Promise<{ sources: IVideo[] } & { subtitles: ISubtitle[] }> => {
    const result: { sources: IVideo[]; subtitles: ISubtitle[]; intro?: Intro; outro?: Intro } = {
      sources: [],
      subtitles: [],
    };
    try {
      const id = videoUrl.href.split('/').pop()?.split('?')[0];
      const options = {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      };

      let res = null;

      res = await this.client.get(
        `https://${videoUrl.hostname}/embed-2/ajax/e-1/getSources?id=${id}`,
        options
      );

      let {
        data: { sources, tracks, intro, outro, encrypted },
      } = res;

      let decryptKey = await (
        await this.client.get('https://raw.githubusercontent.com/cinemaxhq/keys/e1/key')
      ).data;

      decryptKey = substringBefore(
        substringAfter(decryptKey, '"blob-code blob-code-inner js-file-line">'),
        '</td>'
      );

      if (!decryptKey) {
        decryptKey = await (
          await this.client.get('https://raw.githubusercontent.com/cinemaxhq/keys/e1/key')
        ).data;
      }

      if (!decryptKey) decryptKey = this.fallbackKey;

      try {
        if (encrypted) {
          const sourcesArray = sources.split('');

          let extractedKey = '';
          let currentIndex = 0;
          for (const index of decryptKey) {
            const start = index[0] + currentIndex;
            const end = start + index[1];
            for (let i = start; i < end; i++) {
              extractedKey += res.data.sources[i];
              sourcesArray[i] = '';
            }
            currentIndex += index[1];
          }

          decryptKey = extractedKey;
          sources = sourcesArray.join('');

          const decrypt = CryptoJS.AES.decrypt(sources, decryptKey);
          sources = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
        }
      } catch (err) {
        throw new Error('Cannot decrypt sources. Perhaps the key is invalid.');
      }
      this.sources = sources?.map((s: any) => ({
        url: s.file,
        isM3U8: s.file.includes('.m3u8'),
      }));

      result.sources.push(...this.sources);

      if (videoUrl.href.includes(new URL(this.host).host)) {
        result.sources = [];
        this.sources = [];
        for (const source of sources) {
          const { data } = await this.client.get(source.file, options);
          const m3u8data = data
            .split('\n')
            .filter((line: string) => line.includes('.m3u8') && line.includes('RESOLUTION='));

          const secondHalf = m3u8data.map((line: string) =>
            line.match(/RESOLUTION=.*,(C)|URI=.*/g)?.map((s: string) => s.split('=')[1])
          );

          const TdArray = secondHalf.map((s: string[]) => {
            const f1 = s[0].split(',C')[0];
            const f2 = s[1].replace(/"/g, '');

            return [f1, f2];
          });
          for (const [f1, f2] of TdArray) {
            this.sources.push({
              url: `${source.file?.split('master.m3u8')[0]}${f2.replace('iframes', 'index')}`,
              quality: f1.split('x')[1] + 'p',
              isM3U8: f2.includes('.m3u8'),
            });
          }
          result.sources.push(...this.sources);
        }
      }

      result.intro = intro?.end > 1 ? { start: intro.start, end: intro.end } : undefined;
      result.outro = outro?.end > 1 ? { start: outro.start, end: outro.end } : undefined;

      result.sources.push({
        url: sources[0].file,
        isM3U8: sources[0].file.includes('.m3u8'),
        quality: 'auto',
      });

      result.subtitles = tracks
        .map((s: any) =>
          s.file
            ? {
                url: s.file,
                lang: s.label ? s.label : 'Thumbnails',
              }
            : null
        )
        .filter((s: any) => s);

      return result;
    } catch (err) {
      throw err;
    }
  };

  private captcha = async (url: string, key: string): Promise<string> => {
    const uri = new URL(url);
    const domain = uri.protocol + '//' + uri.host;

    const { data } = await this.client.get(`https://www.google.com/recaptcha/api.js?render=${key}`, {
      headers: {
        Referer: domain,
      },
    });

    const v = data
      ?.substring(data.indexOf('/releases/'), data.lastIndexOf('/recaptcha'))
      .split('/releases/')[1];

    //TODO: NEED to fix the co (domain) parameter to work with every domain
    const anchor = `https://www.google.com/recaptcha/api2/anchor?ar=1&hl=en&size=invisible&cb=kr42069kr&k=${key}&co=aHR0cHM6Ly9yYXBpZC1jbG91ZC5ydTo0NDM.&v=${v}`;
    const c = load((await this.client.get(anchor)).data)('#recaptcha-token').attr('value');

    // currently its not returning proper response. not sure why
    const res = await this.client.post(
      `https://www.google.com/recaptcha/api2/reload?k=${key}`,
      {
        v: v,
        k: key,
        c: c,
        co: 'aHR0cHM6Ly9yYXBpZC1jbG91ZC5ydTo0NDM.',
        sa: '',
        reason: 'q',
      },
      {
        headers: {
          Referer: anchor,
        },
      }
    );

    return res.data.substring(res.data.indexOf('rresp","'), res.data.lastIndexOf('",null'));
  };

  // private wss = async (): Promise<string> => {
  //   let sId = '';

  //   const ws = new WebSocket('wss://ws1.rapid-cloud.ru/socket.io/?EIO=4&transport=websocket');

  //   ws.on('open', () => {
  //     ws.send('40');
  //   });

  //   return await new Promise((resolve, reject) => {
  //     ws.on('message', (data: string) => {
  //       data = data.toString();
  //       if (data?.startsWith('40')) {
  //         sId = JSON.parse(data.split('40')[1]).sid;
  //         ws.close(4969, "I'm a teapot");
  //         resolve(sId);
  //       }
  //     });
  //   });
  // };
}

export default RapidCloud;
