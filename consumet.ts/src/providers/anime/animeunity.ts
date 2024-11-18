import { Cheerio, load } from 'cheerio';

import {
    AnimeParser,
    ISearch,
    IAnimeInfo,
    IAnimeResult,
    ISource,
    IEpisodeServer,
    SubOrSub,
} from '../../models';

class AnimeUnity extends AnimeParser {
    override readonly name = 'AnimeUnity';
    protected override baseUrl = 'https://www.animeunity.to';
    protected override logo = 'https://www.animeunity.to/favicon-32x32.png';
    protected override classPath = 'ANIME.AnimeUnity';

    /**
     * @param query Search query
     */
    override search = async (query: string): Promise<ISearch<IAnimeResult>> => {
        try {
            const res = await this.client.get(`${this.baseUrl}/archivio?title=${query}`);
            const $ = load(res.data);

            if (!$) return { results: [] };

            const items = JSON.parse("" + $('archivio').attr('records') + "")

            const searchResult: {
                hasNextPage: boolean;
                results: IAnimeResult[];
            } = {
                hasNextPage: false,
                results: [],
            };

            for (const i in items) {
                searchResult.results.push({
                    id: `${items[i].id}-${items[i].slug}`,
                    title: items[i].title ?? items[i].title_eng,
                    url: `${this.baseUrl}/anime/${items[i].id}-${items[i].slug}`,
                    image: `${items[i].imageurl}`,
                    cover: `${items[i].imageurl_cover}`,
                    subOrDub: `${items[i].dub
                        ? SubOrSub.DUB
                        : SubOrSub.SUB}`
                })
            }

            return searchResult
        } catch (err) {
            throw new Error((err as Error).message);
        }
    };

    /**
     * @param id Anime id
     * @param page Page number
     */
    override fetchAnimeInfo = async (id: string, page: number = 1): Promise<IAnimeInfo> => {
        const url = `${this.baseUrl}/anime/${id}`
        const episodesPerPage = 120
        const lastPageEpisode = page*episodesPerPage
        const firstPageEpisode = lastPageEpisode-119
        const url2 = `${this.baseUrl}/info_api/${id}/1?start_range=${firstPageEpisode}&end_range=${lastPageEpisode}`
        
        try {
            const res = await this.client.get(url);
            const $ = load(res.data);
            
            const totalEpisodes = parseInt($('video-player')?.attr('episodes_count') ?? '0')
            const totalPages = Math.round(totalEpisodes/120) + 1

            if(page < 1 || page > totalPages)
                throw new Error(`Argument 'page' for ${id} must be between 1 and ${totalPages}! (You passed ${page})`);

            const animeInfo: IAnimeInfo = {
                currentPage: page,
                hasNextPage: totalPages > page,
                totalPages: totalPages,
                id: id,
                title: $('h1.title')?.text().trim(),
                url: url,
                alID: $('.banner')?.attr('style')?.split('/')?.pop()?.split('-')[0],
                genres:
                    $('.info-wrapper.pt-3.pb-3 small')?.map((_, element): string => {
                        return $(element).text().replace(',', '').trim()
                    }).toArray() ?? undefined,
                totalEpisodes: totalEpisodes,
                image: $('img.cover')?.attr('src'),
                // image: $('meta[property="og:image"]')?.attr('content'),
                cover: $('.banner')?.attr('src') ?? $('.banner')?.attr('style')?.replace('background: url(', ''),
                description: $('.description').text().trim(),
                episodes: []
            }

            // fetch episodes method 1 (only first page can be fetchedd)
            // const items = JSON.parse("" + $('video-player').attr('episodes') + "")

            // fetch episodes method 2 (all pages can be fetched)
            const res2 = await this.client.get(url2);
            const items = res2.data.episodes

            for(const i in items) {
                animeInfo.episodes?.push({
                    id: `${id}/${items[i].id}`,
                    number: parseInt(items[i].number),
                    url: `${url}/${items[i].id}`,
                })
            }

            return animeInfo
        } catch (err) {
            throw new Error((err as Error).message);
        }
    };

    /**
     *
     * @param episodeId Episode id
     */
    override fetchEpisodeSources = async (episodeId: string): Promise<ISource> => {
        try {
            const res = await this.client.get(`${this.baseUrl}/anime/${episodeId}`);
            const $ = load(res.data);
            
            const episodeSources: ISource = {
                sources: []
            }

            const streamUrl = $('video-player').attr('embed_url')
            
            if(streamUrl) {
                const res = await this.client.get(streamUrl);
                const $ = load(res.data);

                const domain = $('script:contains("window.video")').text()?.match(/url: '(.*)'/)![1]
                const token = $('script:contains("window.video")').text()?.match(/token': '(.*)'/)![1]
                const expires = $('script:contains("window.video")').text()?.match(/expires': '(.*)'/)![1]

                const defaultUrl = `${domain}?token=${token}&referer=&expires=${expires}&h=1`
                const m3u8Content = await this.client.get(defaultUrl)

                if (m3u8Content.data.includes('EXTM3U')) {
                  const videoList = m3u8Content.data.split('#EXT-X-STREAM-INF:');
                  for (const video of videoList ?? []) {
                    if (video.includes('BANDWIDTH')) {
                      const url = video.split('\n')[1];
                      const quality = video.split('RESOLUTION=')[1].split('\n')[0].split('x')[1];
          
                      episodeSources.sources.push({
                        url: url,
                        quality: `${quality}p`,
                        isM3U8: true,
                      });
                    }
                  }
                }

                episodeSources.sources.push({
                  url: defaultUrl,
                  quality: `default`,
                  isM3U8: true,
                });

                episodeSources.download = $('script:contains("window.downloadUrl ")').text()?.match(/downloadUrl = '(.*)'/)![1]?.toString()
            }

            return episodeSources
        } catch (err) {
            throw new Error((err as Error).message);
        }
    };

    /**
     *
     * @param episodeId Episode id
     */
    override fetchEpisodeServers = (episodeId: string): Promise<IEpisodeServer[]> => {
        throw new Error('Method not implemented.');
    };
}

export default AnimeUnity

/**
 * old episode sources fetching method, keep it here.
 */
// const domain = $('script:contains("window.video")').text()?.match(/url: '(.*)'/)![1]
// const token = $('script:contains("window.video")').text()?.match(/token': '(.*)'/)![1]
// const token360p = $('script:contains("window.video")').text()?.match(/token360p': '(.*)'/)![1]
// const token480p = $('script:contains("window.video")').text()?.match(/token480p': '(.*)'/)![1]
// const token720p = $('script:contains("window.video")').text()?.match(/token720p': '(.*)'/)![1]
// const token1080p = $('script:contains("window.video")').text()?.match(/token1080p': '(.*)'/)![1]
// const expires = $('script:contains("window.video")').text()?.match(/expires': '(.*)'/)![1]

// episodeSources.sources.push({
//     url: `${domain}?token=${token}&token360p=${token360p}&token480p=${token480p}&token720p=${token720p}&token1080p=${token1080p}&referer=&expires=${expires}`,
//     isM3U8: true
// })
