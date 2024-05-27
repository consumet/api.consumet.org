import { AxiosAdapter } from 'axios';
import { CheerioAPI, load } from 'cheerio';

import {
  AnimeParser,
  ISearch,
  IAnimeInfo,
  IAnimeResult,
  ISource,
  IEpisodeServer,
  StreamingServers,
  MediaFormat,
  SubOrSub,
} from '../../models';

import { StreamSB, RapidCloud, MegaCloud, StreamTape } from '../../utils';
import { USER_AGENT } from '../../utils';

class Zoro extends AnimeParser {
  override readonly name = 'Zoro';
  protected override baseUrl = 'https://hianime.to';
  protected override logo =
    'https://is3-ssl.mzstatic.com/image/thumb/Purple112/v4/7e/91/00/7e9100ee-2b62-0942-4cdc-e9b93252ce1c/source/512x512bb.jpg';
  protected override classPath = 'ANIME.Zoro';

  constructor(
    customBaseURL?: string
  ) {
    super(...arguments);
    this.baseUrl = customBaseURL ? `https://${customBaseURL}` : this.baseUrl;
  }

  /**
   * @param query Search query
   * @param page Page number (optional)
   */
  override search(query: string, page: number = 1): Promise<ISearch<IAnimeResult>> {
    if (0 >= page) {
      page = 1;
    }
    return this.scrapeCardPage(`${this.baseUrl}/search?keyword=${decodeURIComponent(query)}&page=${page}`);
  }

  /**
   * @param page number
   */
  fetchTopAiring(page: number = 1): Promise<ISearch<IAnimeResult>> {
    if (0 >= page) {
      page = 1;
    }
    return this.scrapeCardPage(`${this.baseUrl}/top-airing?page=${page}`);
  }
  /**
   * @param page number
   */
  fetchMostPopular(page: number = 1): Promise<ISearch<IAnimeResult>> {
    if (0 >= page) {
      page = 1;
    }
    return this.scrapeCardPage(`${this.baseUrl}/most-popular?page=${page}`);
  }
  /**
   * @param page number
   */
  fetchMostFavorite(page: number = 1): Promise<ISearch<IAnimeResult>> {
    if (0 >= page) {
      page = 1;
    }
    return this.scrapeCardPage(`${this.baseUrl}/most-favorite?page=${page}`);
  }
  /**
   * @param page number
   */
  fetchLatestCompleted(page: number = 1): Promise<ISearch<IAnimeResult>> {
    if (0 >= page) {
      page = 1;
    }
    return this.scrapeCardPage(`${this.baseUrl}/completed?page=${page}`);
  }
  /**
   * @param page number
   */
  fetchRecentlyUpdated(page: number = 1): Promise<ISearch<IAnimeResult>> {
    if (0 >= page) {
      page = 1;
    }
    return this.scrapeCardPage(`${this.baseUrl}/recently-updated?page=${page}`);
  }
  /**
   * @param page number
   */
  fetchRecentlyAdded(page: number = 1): Promise<ISearch<IAnimeResult>> {
    if (0 >= page) {
      page = 1;
    }
    return this.scrapeCardPage(`${this.baseUrl}/recently-added?page=${page}`);
  }
  /**
   * @param page number
   */
  fetchTopUpcoming(page: number = 1): Promise<ISearch<IAnimeResult>> {
    if (0 >= page) {
      page = 1;
    }
    return this.scrapeCardPage(`${this.baseUrl}/top-upcoming?page=${page}`);
  }
  /**
   * @param studio Studio id, e.g. "toei-animation"
   * @param page page number (optional) `default 1`
   */
  fetchStudio(studio: string, page: number = 1): Promise<ISearch<IAnimeResult>> {
    if (0 >= page) {
      page = 1;
    }
    return this.scrapeCardPage(`${this.baseUrl}/producer/${studio}?page=${page}`);
  }

  /**
     * Fetches the schedule for a given date.
     * @param date The date in format 'YYYY-MM-DD'. Defaults to the current date.
     * @returns A promise that resolves to an object containing the search results.
     */
  async fetchSchedule(date: string = new Date().toISOString().slice(0, 10)): Promise<ISearch<IAnimeResult>> {
    try {
      const res: ISearch<IAnimeResult> = {
        results: [],
      };
      const { data: { html } } = await this.client.get(`${this.baseUrl}/ajax/schedule/list?tzOffset=360&date=${date}`);
      const $ = load(html);

      $('li').each((i, ele) => {
        const card = $(ele);
        const title = card.find('.film-name');

        const id = card.find("a.tsl-link").attr('href')?.split('/')[1].split('?')[0];
        const airingTime = card.find("div.time").text().replace("\n", "").trim();
        const airingEpisode = card.find("div.film-detail div.fd-play button").text().replace("\n", "").trim();
        res.results.push({
          id: id!,
          title: title.text(),
          japaneseTitle: title.attr('data-jname'),
          url: `${this.baseUrl}/${id}`,
          airingEpisode: airingEpisode,
          airingTime: airingTime,
        });
      })

      return res;
    } catch (err) {
      throw new Error('Something went wrong. Please try again later.');
    }
  }

  async fetchSpotlight(): Promise<ISearch<IAnimeResult>> {
    try {
      const res: ISearch<IAnimeResult> = { results: [] };
      const { data } = await this.client.get(`${this.baseUrl}/home`);
      const $ = load(data);

      $('#slider div.swiper-wrapper div.swiper-slide').each((i, el) => {
        const card = $(el);
        const titleElement = card.find('div.desi-head-title');
        const id = card.find('div.desi-buttons .btn-secondary').attr('href')?.match(/\/([^/]+)$/)?.[1] || null;
        res.results.push({
          id: id!,
          title: titleElement.text(),
          japaneseTitle: titleElement.attr('data-jname'),
          banner: card.find('deslide-cover-img img').attr('data-src') || null,
          rank: parseInt(card.find('.desi-sub-text').text().match(/(\d+)/g)?.[0]!),
          url: `${this.baseUrl}/${id}`,
          type: card.find('div.sc-detail .scd-item:nth-child(1)').text().trim() as MediaFormat,
          duration: card.find('div.sc-detail > div:nth-child(2)').text().trim(),
          releaseDate: card.find('div.sc-detail > div:nth-child(3)').text().trim(),
          quality: card.find('div.sc-detail > div:nth-child(4)').text().trim(),
          sub: parseInt(card.find('div.sc-detail div.tick-sub').text().trim()) || 0,
          dub: parseInt(card.find('div.sc-detail div.tick-dub').text().trim()) || 0,
          episodes: parseInt(card.find('div.sc-detail div.tick-eps').text()) || 0,
          description: card.find('div.desi-description').text().trim()
        });
      });

      return res;
    } catch (error) {
      throw new Error('Something went wrong. Please try again later.');
    }
  }

  async fetchSearchSuggestions(query: string): Promise<ISearch<IAnimeResult>> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const { data } = await this.client.get(`${this.baseUrl}/ajax/search/suggest?keyword=${encodedQuery}`);
      const $ = load(data.html);
      const res: ISearch<IAnimeResult> = {
        results: [],
      };

      $('.nav-item').each((i, el) => {
        const card = $(el);
        if (!card.hasClass("nav-bottom")) {
          const image = card.find('.film-poster img').attr('data-src');
          const title = card.find('.film-name');
          const id = card.attr('href')?.split('/')[1].split('?')[0];
          
          const duration = card.find(".film-infor span").last().text().trim();
          const releaseDate = card.find(".film-infor span:nth-child(1)").text().trim();
          const type = card.find(".film-infor").find("span, i").remove().end().text().trim();
          res.results.push({
            image: image,
            id: id!,
            title: title.text(),
            japaneseTitle: title.attr('data-jname'),
            aliasTitle: card.find(".alias-name").text(),
            releaseDate: releaseDate,
            type: type as MediaFormat,
            duration: duration,
            url: `${this.baseUrl}/${id}`,
          });
        }
      });

      return res;
    } catch (error) {
      throw new Error('Something went wrong. Please try again later.');
    }
  }

  /**
   * @param id Anime id
   */
  override fetchAnimeInfo = async (id: string): Promise<IAnimeInfo> => {
    const info: IAnimeInfo = {
      id: id,
      title: '',
    };
    try {
      const { data } = await this.client.get(`${this.baseUrl}/watch/${id}`);
      const $ = load(data);

      const { mal_id, anilist_id } = JSON.parse($('#syncData').text());
      info.malID = Number(mal_id);
      info.alID = Number(anilist_id);
      info.title = $('h2.film-name > a.text-white').text();
      info.japaneseTitle = $('div.anisc-info div:nth-child(2) span.name').text();
      info.image = $('img.film-poster-img').attr('src');
      info.description = $('div.film-description').text().trim();
      // Movie, TV, OVA, ONA, Special, Music
      info.type = $('span.item').last().prev().prev().text().toUpperCase() as MediaFormat;
      info.url = `${this.baseUrl}/${id}`;
      info.recommendations = await this.scrapeCard($);
      info.relatedAnime = [];
      $("#main-sidebar section:nth-child(1) div.anif-block-ul li").each((i, ele) => {
        const card = $(ele);
        const aTag = card.find('.film-name a');
        const id = aTag.attr('href')?.split('/')[1].split('?')[0];
        info.relatedAnime.push({
          id: id!,
          title: aTag.text(),
          url: `${this.baseUrl}${aTag.attr('href')}`,
          image: card.find('img')?.attr('data-src'),
          japaneseTitle: aTag.attr('data-jname'),
          type: card.find(".tick").contents().last()?.text()?.trim() as MediaFormat,
          sub: parseInt(card.find('.tick-item.tick-sub')?.text()) || 0,
          dub: parseInt(card.find('.tick-item.tick-dub')?.text()) || 0,
          episodes: parseInt(card.find('.tick-item.tick-eps')?.text()) || 0,
        });
      });
      const hasSub: boolean = $('div.film-stats div.tick div.tick-item.tick-sub').length > 0;
      const hasDub: boolean = $('div.film-stats div.tick div.tick-item.tick-dub').length > 0;

      if (hasSub) {
        info.subOrDub = SubOrSub.SUB;
        info.hasSub = hasSub;
      }
      if (hasDub) {
        info.subOrDub = SubOrSub.DUB;
        info.hasDub = hasDub;
      }
      if (hasSub && hasDub) {
        info.subOrDub = SubOrSub.BOTH;
      }

      const episodesAjax = await this.client.get(
        `${this.baseUrl}/ajax/v2/episode/list/${id.split('-').pop()}`,
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Referer: `${this.baseUrl}/watch/${id}`,
          },
        }
      );

      const $$ = load(episodesAjax.data.html);

      info.totalEpisodes = $$('div.detail-infor-content > div > a').length;
      info.episodes = [];
      $$('div.detail-infor-content > div > a').each((i, el) => {
        const episodeId = $$(el)
          .attr('href')
          ?.split('/')[2]
          ?.replace('?ep=', '$episode$')
          ?.concat(`$${info.subOrDub}`)!;
        const number = parseInt($$(el).attr('data-number')!);
        const title = $$(el).attr('title');
        const url = this.baseUrl + $$(el).attr('href');
        const isFiller = $$(el).hasClass('ssl-item-filler');

        info.episodes?.push({
          id: episodeId,
          number: number,
          title: title,
          isFiller: isFiller,
          url: url,
        });
      });

      return info;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  /**
   *
   * @param episodeId Episode id
   */
  override fetchEpisodeSources = async (
    episodeId: string,
    server: StreamingServers = StreamingServers.VidCloud
  ): Promise<ISource> => {
    if (episodeId.startsWith('http')) {
      const serverUrl = new URL(episodeId);
      switch (server) {
        case StreamingServers.VidStreaming:
        case StreamingServers.VidCloud:
          return {
            ...(await new MegaCloud().extract(serverUrl)),
          };
        case StreamingServers.StreamSB:
          return {
            headers: {
              Referer: serverUrl.href,
              watchsb: 'streamsb',
              'User-Agent': USER_AGENT,
            },
            sources: await new StreamSB(this.proxyConfig, this.adapter).extract(serverUrl, true),
          };
        case StreamingServers.StreamTape:
          return {
            headers: { Referer: serverUrl.href, 'User-Agent': USER_AGENT },
            sources: await new StreamTape(this.proxyConfig, this.adapter).extract(serverUrl),
          };
        default:
        case StreamingServers.VidCloud:
          return {
            headers: { Referer: serverUrl.href },
            ...(await new MegaCloud().extract(serverUrl)),
          };
      }
    }
    if (!episodeId.includes('$episode$')) throw new Error('Invalid episode id');

    // Fallback to using sub if no info found in case of compatibility

    // TODO: add both options later
    const subOrDub: 'sub' | 'dub' = episodeId.split('$')?.pop() === 'dub' ? 'dub' : 'sub';

    episodeId = `${this.baseUrl}/watch/${episodeId
      .replace('$episode$', '?ep=')
      .replace(/\$auto|\$sub|\$dub/gi, '')}`;

    try {
      const { data } = await this.client.get(
        `${this.baseUrl}/ajax/v2/episode/servers?episodeId=${episodeId.split('?ep=')[1]}`
      );

      const $ = load(data.html);

      /**
       * vidtreaming -> 4
       * rapidcloud  -> 1
       * streamsb -> 5
       * streamtape -> 3
       */
      let serverId = '';
      try {
        switch (server) {
          case StreamingServers.VidCloud:
            serverId = this.retrieveServerId($, 1, subOrDub);

            // zoro's vidcloud server is rapidcloud
            if (!serverId) throw new Error('RapidCloud not found');
            break;
          case StreamingServers.VidStreaming:
            serverId = this.retrieveServerId($, 4, subOrDub);

            // zoro's vidcloud server is rapidcloud
            if (!serverId) throw new Error('vidtreaming not found');
            break;
          case StreamingServers.StreamSB:
            serverId = this.retrieveServerId($, 5, subOrDub);

            if (!serverId) throw new Error('StreamSB not found');
            break;
          case StreamingServers.StreamTape:
            serverId = this.retrieveServerId($, 3, subOrDub);

            if (!serverId) throw new Error('StreamTape not found');
            break;
        }
      } catch (err) {
        throw new Error("Couldn't find server. Try another server");
      }

      const {
        data: { link },
      } = await this.client.get(`${this.baseUrl}/ajax/v2/episode/sources?id=${serverId}`);

      return await this.fetchEpisodeSources(link, server);
    } catch (err) {
      throw err;
    }
  };

  private retrieveServerId = ($: any, index: number, subOrDub: 'sub' | 'dub') => {
    return $(`.ps_-block.ps_-block-sub.servers-${subOrDub} > .ps__-list .server-item`)
      .map((i: any, el: any) => ($(el).attr('data-server-id') == `${index}` ? $(el) : null))
      .get()[0]
      .attr('data-id')!;
  };

  /**
   * @param url string
   */
  private scrapeCardPage = async (url: string): Promise<ISearch<IAnimeResult>> => {
    try {
      const res: ISearch<IAnimeResult> = {
        currentPage: 0,
        hasNextPage: false,
        totalPages: 0,
        results: [],
      };
      const { data } = await this.client.get(url);
      const $ = load(data);

      const pagination = $('ul.pagination');
      res.currentPage = parseInt(pagination.find('.page-item.active')?.text());
      const nextPage = pagination.find('a[title=Next]')?.attr('href');
      if (nextPage != undefined && nextPage != '') {
        res.hasNextPage = true;
      }
      const totalPages = pagination.find('a[title=Last]').attr('href')?.split('=').pop();
      if (totalPages === undefined || totalPages === '') {
        res.totalPages = res.currentPage;
      } else {
        res.totalPages = parseInt(totalPages);
      }

      res.results = await this.scrapeCard($);
      if (res.results.length === 0) {
        res.currentPage = 0;
        res.hasNextPage = false;
        res.totalPages = 0;
      }
      return res;
    } catch (err) {
      throw new Error('Something went wrong. Please try again later.');
    }
  };

  /**
   * @param $ cheerio instance
   */
  private scrapeCard = async ($: CheerioAPI): Promise<IAnimeResult[]> => {
    try {
      const results: IAnimeResult[] = [];

      $('.flw-item').each((i, ele) => {
        const card = $(ele);
        const atag = card.find('.film-name a');
        const id = atag.attr('href')?.split('/')[1].split('?')[0];
        const type = card
          .find('.fdi-item')
          ?.first()
          ?.text()
          .replace(' (? eps)', '')
          .replace(/\s\(\d+ eps\)/g, '');
        results.push({
          id: id!,
          title: atag.text(),
          url: `${this.baseUrl}${atag.attr('href')}`,
          image: card.find('img')?.attr('data-src'),
          duration: card.find('.fdi-duration')?.text(),
          japaneseTitle: atag.attr('data-jname'),
          type: type as MediaFormat,
          nsfw: card.find('.tick-rate')?.text() === '18+' ? true : false,
          sub: parseInt(card.find('.tick-item.tick-sub')?.text()) || 0,
          dub: parseInt(card.find('.tick-item.tick-dub')?.text()) || 0,
          episodes: parseInt(card.find('.tick-item.tick-eps')?.text()) || 0,
        });

      });
      return results;
    } catch (err) {
      throw new Error('Something went wrong. Please try again later.');
    }
  };
  /**
   * @deprecated
   * @param episodeId Episode id
   */
  override fetchEpisodeServers = (episodeId: string): Promise<IEpisodeServer[]> => {
    throw new Error('Method not implemented.');
  };
}

// (async () => {
//   const zoro = new Zoro();
//   const anime = await zoro.search('classroom of the elite');
//   const info = await zoro.fetchAnimeInfo(anime.results[0].id);
//   const sources = await zoro.fetchEpisodeSources(info.episodes![0].id);
//   console.log(sources);
// })();

export default Zoro;
