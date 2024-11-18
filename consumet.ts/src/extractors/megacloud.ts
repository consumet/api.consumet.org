import crypto from "crypto";
import { IVideo, ISubtitle, Intro, VideoExtractor } from '../models';

const megacloud = {
  script: "https://megacloud.tv/js/player/a/prod/e1-player.min.js?v=",
  sources: "https://megacloud.tv/embed-2/ajax/e-1/getSources?id=",
} as const;

type tracks = {
  file: string;
  kind: string;
  label?: string;
  default?: boolean;
};

type unencrypSources = {
  file: string;
  type: string;
};

type apiFormat = {
  sources: string | unencrypSources[];
  tracks: tracks[];
  encrypted: boolean;
  intro: Intro;
  outro: Intro;
  server: number;
};

class MegaCloud extends VideoExtractor {

  protected override serverName = 'MegaCloud';
  protected override sources: IVideo[] = [];

  async extract(videoUrl: URL)  {
    try {
      const result: {
        sources: IVideo[];
        subtitles: ISubtitle[];
        intro?: Intro;
        outro?: Intro
      } = {
        sources: [],
        subtitles: [],
      };

      const videoId = videoUrl?.href?.split("/")?.pop()?.split("?")[0];
      const { data: srcsData } = await this.client.get<apiFormat>(
        megacloud.sources.concat(videoId || ""),
        {
          headers: {
            Accept: "*/*",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            Referer: videoUrl.href,
          },
        }
      );
      if (!srcsData) {
        throw new Error("Url may have an invalid video id");
      }

      const encryptedString = srcsData.sources;
      if (srcsData.encrypted && Array.isArray(encryptedString)) {
        result.intro = srcsData.intro;
        result.outro = srcsData.outro;
        result.subtitles = srcsData.tracks.map((s: any) => ({
          url: s.file,
          lang: s.label ? s.label : 'Thumbnails',
        }));
        result.sources = encryptedString.map((s) => ({
          url: s.file,
          type: s.type,
          isM3U8: s.file.includes('.m3u8'),
        }));

        return result;
      }

      const { data } = await this.client.get(
        megacloud.script.concat(Date.now().toString())
      );

      const text = data;
      if (!text)
        throw new Error("Couldn't fetch script to decrypt resource");

      const vars = this.extractVariables(text, "MEGACLOUD");

      const { secret, encryptedSource } = this.getSecret(
        encryptedString as string,
        vars
      );
      const decrypted = this.decrypt(encryptedSource, secret);
      try {
        const sources = JSON.parse(decrypted);
        result.intro = srcsData.intro;
        result.outro = srcsData.outro;
        result.subtitles = srcsData.tracks.map((s: any) => ({
          url: s.file,
          lang: s.label ? s.label : 'Thumbnails',
        }));
        result.sources = sources.map((s: any) => ({
          url: s.file,
          type: s.type,
          isM3U8: s.file.includes('.m3u8'),
        }));

        return result;
      } catch (error) {
        throw new Error("Failed to decrypt resource");
      }
    } catch (err) {
      throw err;
    }
  }

  extractVariables(text: string, sourceName: string) {
    let allvars;
    if (sourceName !== "MEGACLOUD") {
      allvars =
        text
          .match(
            /const (?:\w{1,2}=(?:'.{0,50}?'|\w{1,2}\(.{0,20}?\)).{0,20}?,){7}.+?;/gm
          )
          ?.at(-1) ?? "";
    } else {
      allvars =
        text
          .match(/\w{1,2}=new URLSearchParams.+?;(?=function)/gm)
          ?.at(1) ?? "";
    }
    const vars = allvars
      .slice(0, -1)
      .split("=")
      .slice(1)
      .map((pair) => Number(pair.split(",").at(0)))
      .filter((num) => num === 0 || num);

    return vars;
  }

  getSecret(encryptedString: string, values: number[]) {
    let secret = "",
      encryptedSource = encryptedString,
      totalInc = 0;

    for (let i = 0; i < values[0]!; i++) {
      let start, inc;
      switch (i) {
        case 0:
          (start = values[2]), (inc = values[1]);
          break;
        case 1:
          (start = values[4]), (inc = values[3]);
          break;
        case 2:
          (start = values[6]), (inc = values[5]);
          break;
        case 3:
          (start = values[8]), (inc = values[7]);
          break;
        case 4:
          (start = values[10]), (inc = values[9]);
          break;
        case 5:
          (start = values[12]), (inc = values[11]);
          break;
        case 6:
          (start = values[14]), (inc = values[13]);
          break;
        case 7:
          (start = values[16]), (inc = values[15]);
          break;
        case 8:
          (start = values[18]), (inc = values[17]);
      }
      const from = start! + totalInc,
        to = from + inc!;
      (secret += encryptedString.slice(from, to)),
        (encryptedSource = encryptedSource.replace(
          encryptedString.substring(from, to),
          ""
        )),
        (totalInc += inc!);
    }

    return { secret, encryptedSource };
  }

  decrypt(encrypted: string, keyOrSecret: string, maybe_iv?: string) {
    let key;
    let iv;
    let contents;
    if (maybe_iv) {
      key = keyOrSecret;
      iv = maybe_iv;
      contents = encrypted;
    } else {
      const cypher = Buffer.from(encrypted, "base64");
      const salt = cypher.subarray(8, 16);
      const password = Buffer.concat([
        Buffer.from(keyOrSecret, "binary"),
        salt,
      ]);
      const md5Hashes = [];
      let digest = password;
      for (let i = 0; i < 3; i++) {
        md5Hashes[i] = crypto.createHash("md5").update(digest).digest();
        digest = Buffer.concat([md5Hashes[i], password]);
      }
      key = Buffer.concat([md5Hashes[0], md5Hashes[1]]);
      iv = md5Hashes[2];
      contents = cypher.subarray(16);
    }

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    const decrypted =
      decipher.update(
        contents as any,
        typeof contents === "string" ? "base64" : undefined,
        "utf8"
      ) + decipher.final();

    return decrypted;
  }
}

export default MegaCloud;
