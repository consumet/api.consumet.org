import crypto from 'crypto';
import { VideoExtractor, IVideo, ISubtitle } from '../models';
import { load } from 'cheerio';

// Copied form https://github.com/JorrinKievit/restreamer/blob/main/src/main/extractors/smashystream.ts/smashystream.ts
// Thanks Jorrin Kievit
class SmashyStream extends VideoExtractor {
  protected override serverName = 'SmashyStream';
  protected override sources: IVideo[] = [];

  private readonly host = 'https://embed.smashystream.com';

  override extract = async (videoUrl: URL): Promise<{ sources: IVideo[] } & { subtitles: ISubtitle[] }> => {
    try {
      const result: {
        source: string;
        data: { sources: IVideo[] } & { subtitles: ISubtitle[] };
      }[] = [];

      const { data } = await this.client.get(videoUrl.href);
      const $ = load(data);

      const sourceUrls = $('.dropdown-menu a[data-id]')
        .map((_, el) => $(el).attr('data-id'))
        .get()
        .filter(it => it !== '_default');

      await Promise.all(
        sourceUrls.map(async sourceUrl => {
          if (sourceUrl.includes('/ffix')) {
            const data = await this.extractSmashyFfix(sourceUrl);
            result.push({
              source: 'FFix',
              data: data,
            });
          }

          if (sourceUrl.includes('/watchx')) {
            const data = await this.extractSmashyWatchX(sourceUrl);
            result.push({
              source: 'WatchX',
              data: data,
            });
          }

          if (sourceUrl.includes('/nflim')) {
            const data = await this.extractSmashyNFlim(sourceUrl);
            result.push({
              source: 'NFilm',
              data: data,
            });
          }

          if (sourceUrl.includes('/fx')) {
            const data = await this.extractSmashyFX(sourceUrl);
            result.push({
              source: 'FX',
              data: data,
            });
          }

          if (sourceUrl.includes('/cf')) {
            const data = await this.extractSmashyCF(sourceUrl);
            result.push({
              source: 'CF',
              data: data,
            });
          }

          if (sourceUrl.includes('eemovie')) {
            const data = await this.extractSmashyEEMovie(sourceUrl);
            result.push({
              source: 'EEMovie',
              data: data,
            });
          }

          return undefined;
        })
      );

      return result.filter(a => a.source === 'FFix')[0].data;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  async extractSmashyFfix(url: string): Promise<{ sources: IVideo[] } & { subtitles: ISubtitle[] }> {
    try {
      const result: { sources: IVideo[]; subtitles: ISubtitle[] } = {
        sources: [],
        subtitles: [],
      };

      const res = await this.client.get(url, {
        headers: {
          referer: url,
        },
      });
      const config = JSON.parse(res.data.match(/var\s+config\s*=\s*({.*?});/)[1]);

      const files = config.file
        .match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/g)
        .map((entry: { match: (arg0: RegExp) => [string, string, string] }) => {
          const [, quality, link] = entry.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/);
          return { quality, link: link.replace(',', '') };
        });

      const vttArray = config.subtitle
        .match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/g)
        .map((entry: { match: (arg0: RegExp) => [string, string, string] }) => {
          const [, language, link] = entry.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/);
          return { language, link: link.replace(',', '') };
        });

      files.map((source: { link: string; quality: string }) => {
        result.sources.push({
          url: source.link,
          quality: source.quality,
          isM3U8: source.link.includes('.m3u8'),
        });
      });

      vttArray.map((subtitle: { language: string; link: string }) => {
        result.subtitles.push({
          url: subtitle.link,
          lang: subtitle.language,
        });
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async extractSmashyWatchX(url: string): Promise<{ sources: IVideo[] } & { subtitles: ISubtitle[] }> {
    try {
      const result: { sources: IVideo[]; subtitles: ISubtitle[] } = {
        sources: [],
        subtitles: [],
      };

      const key = '4VqE3#N7zt&HEP^a';

      const res = await this.client.get(url, {
        headers: {
          referer: url,
        },
      });

      const regex = /MasterJS\s*=\s*'([^']*)'/;
      const base64EncryptedData = regex.exec(res.data)![1];
      const base64DecryptedData = JSON.parse(Buffer.from(base64EncryptedData, 'base64').toString('utf8'));

      const derivedKey = crypto.pbkdf2Sync(
        key,
        Buffer.from(base64DecryptedData.salt, 'hex'),
        base64DecryptedData.iterations,
        32,
        'sha512'
      );
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        derivedKey,
        Buffer.from(base64DecryptedData.iv, 'hex')
      );
      decipher.setEncoding('utf8');

      let decrypted = decipher.update(base64DecryptedData.ciphertext, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      const sources = JSON.parse(decrypted.match(/sources: ([^\]]*\])/)![1]);
      const tracks = JSON.parse(decrypted.match(/tracks: ([^]*?\}\])/)![1]);

      const subtitles = tracks.filter(
        (it: { file: string; label: string; kind: string }) => it.kind === 'captions'
      );

      sources.map((source: { file: string; label: string }) => {
        result.sources.push({
          url: source.file,
          quality: source.label,
          isM3U8: source.file.includes('.m3u8'),
        });
      });

      subtitles.map((subtitle: { file: string; label: string }) => {
        result.subtitles.push({
          url: subtitle.file,
          lang: subtitle.label,
        });
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async extractSmashyNFlim(url: string): Promise<{ sources: IVideo[] } & { subtitles: ISubtitle[] }> {
    try {
      const result: { sources: IVideo[]; subtitles: ISubtitle[] } = {
        sources: [],
        subtitles: [],
      };

      const res = await this.client.get(url, {
        headers: {
          referer: url,
        },
      });
      const configData = res.data.match(/var\s+config\s*=\s*({.*?});/);

      const config = JSON.parse(configData?.length > 0 ? configData[1] : null);

      const files = config?.file
        .match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/g)
        .map((entry: { match: (arg0: RegExp) => [string, string, string] }) => {
          const [, quality, link] = entry.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/);
          return { quality, link: link.replace(',', '') };
        });

      const vttArray = config?.subtitle
        .match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/g)
        .map((entry: { match: (arg0: RegExp) => [string, string, string] }) => {
          const [, language, link] = entry.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/);
          return { language, link: link.replace(',', '') };
        });

      let validFiles = files;

      if (files) {
        await Promise.all(
          files?.map(async (source: { link: string; quality: string }) => {
            await this.client
              .head(source.link)
              .then(res => console.log(res.status))
              .catch(err => {
                if (err.response.status.status !== 200) {
                  validFiles = validFiles.filter(
                    (obj: { link: string; quality: string }) => obj.link !== source.link
                  );
                }
              });
          })
        );
      }

      if (validFiles) {
        validFiles?.map((source: { link: string; quality: string }) => {
          result.sources.push({
            url: source.link,
            quality: source.quality,
            isM3U8: source.link.includes('.m3u8'),
          });
        });

        if (vttArray) {
          vttArray?.map((subtitle: { language: string; link: string }) => {
            result.subtitles.push({
              url: subtitle.link,
              lang: subtitle.language,
            });
          });
        }
      }

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async extractSmashyFX(url: string): Promise<{ sources: IVideo[] } & { subtitles: ISubtitle[] }> {
    try {
      const result: { sources: IVideo[]; subtitles: ISubtitle[] } = {
        sources: [],
        subtitles: [],
      };

      const res = await this.client.get(url, {
        headers: {
          referer: url,
        },
      });

      const file = res.data.match(/file:\s*"([^"]+)"/)[1];

      result.sources.push({
        url: file,
        isM3U8: file.includes('.m3u8'),
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async extractSmashyCF(url: string): Promise<{ sources: IVideo[] } & { subtitles: ISubtitle[] }> {
    try {
      const result: { sources: IVideo[]; subtitles: ISubtitle[] } = {
        sources: [],
        subtitles: [],
      };

      const res = await this.client.get(url, {
        headers: {
          referer: url,
        },
      });

      const file = res.data.match(/file:\s*"([^"]+)"/)[1];
      const fileRes = await this.client.head(file);

      if (fileRes.status !== 200 || fileRes.data.includes('404')) {
        return result;
      } else {
        result.sources.push({
          url: file,
          isM3U8: file.includes('.m3u8'),
        });
      }
      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async extractSmashyEEMovie(url: string): Promise<{ sources: IVideo[] } & { subtitles: ISubtitle[] }> {
    try {
      const result: { sources: IVideo[]; subtitles: ISubtitle[] } = {
        sources: [],
        subtitles: [],
      };

      const res = await this.client.get(url, {
        headers: {
          referer: url,
        },
      });

      const file = res.data.match(/file:\s*"([^"]+)"/)[1];

      result.sources.push({
        url: file,
        isM3U8: file.includes('.m3u8'),
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

export default SmashyStream;
