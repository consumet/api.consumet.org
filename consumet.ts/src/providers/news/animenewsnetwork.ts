import { load } from 'cheerio';
import axios from 'axios';
import { getHashFromImage } from '../../utils/utils';
import { NewsParser, INewsFeed, Topics, INewsInfo } from '../../models';

class NewsFeed implements INewsFeed {
  constructor(
    public title: string,
    public id: string,
    public uploadedAt: string,
    public topics: Topics[],
    public preview: INewsFeed['preview'],
    public thumbnail: string,
    public thumbnailHash: string,
    public url: string
  ) {}

  public async getInfo(): Promise<INewsInfo> {
    return await scrapNewsInfo(this.url).catch((err: Error) => {
      throw new Error(err.message);
    });
  }
}

async function scrapNewsInfo(url: string): Promise<INewsInfo> {
  const { data } = await axios.get<string>(url);
  const $ = load(data);
  const title = $('#page_header').text().replace('News', '').trim();
  const intro = $('.intro').first().text().trim();
  const description = $('.meat > p').text().trim().split('\n\n').join('\n');
  const time = $('#page-title > small > time').text().trim();
  const thumbnailSlug = $('.meat > figure.fright').first().find('img').attr('data-src');

  const thumbnail = thumbnailSlug
    ? `https://animenewsnetwork.com${thumbnailSlug}`
    : 'https://i.imgur.com/KkkVr1g.png';

  const thumbnailHash = getHashFromImage(
    thumbnailSlug ? `https://animenewsnetwork.com${thumbnailSlug}` : 'https://i.imgur.com/KkkVr1g.png'
  );

  return {
    id: url.split('news/')[1],
    title,
    uploadedAt: time,
    intro,
    description,
    thumbnail,
    thumbnailHash,
    url,
  };
}

class AnimeNewsNetwork extends NewsParser {
  override readonly name = 'Anime News Network';
  protected override baseUrl = 'https://www.animenewsnetwork.com';
  protected override classPath = 'NEWS.ANN';
  protected override logo = 'https://i.imgur.com/KkkVr1g.png';

  /**
   * @param topic Topic for fetching the feeds
   */
  public fetchNewsFeeds = async (topic?: Topics): Promise<NewsFeed[]> =>
    await axios
      .get<string>(
        `${this.baseUrl}/news${topic && Object.values(Topics).includes(topic) ? `/?topic=${topic}` : ''}`
      )
      .then(({ data }) => {
        const $ = load(data);
        const feeds: NewsFeed[] = [];
        $('.herald.box.news').each((i, el) => {
          const thumbnailSlug = $(el).find('.thumbnail').attr('data-src');
          const thumbnail = thumbnailSlug ? `${this.baseUrl}${thumbnailSlug}` : this.logo;
          const thumbnailHash = getHashFromImage(
            thumbnailSlug ? `${this.baseUrl}${thumbnailSlug}` : this.logo
          );
          const title = $(el).find('h3').text().trim();
          const slug = $(el).find('h3 > a').attr('href') || '';
          const url = `${this.baseUrl}${slug}`;
          const byline = $(el).find('.byline');
          const time = byline.find('time').text().trim();
          const topics: Topics[] = [];
          byline.find('.topics > a').each((i, el) => {
            topics.push($(el).text().trim() as Topics);
          });
          const El = $(el).find('.preview');
          const preview = {
            intro: El.find('.intro').text().trim(),
            full: El.find('.full').text().replace('―', '').trim(),
          };
          feeds.push(
            new NewsFeed(
              title,
              slug.replace('/news/', ''),
              time,
              topics,
              preview,
              thumbnail,
              thumbnailHash,
              url
            )
          );
        });
        return feeds;
      })
      .catch((err: Error) => {
        throw new Error(err.message);
      });

  /**
   * @param id ID of the news from Anime News Network
   * @example
   * fetchNewsInfo('2022-08-26/higurashi-no-naku-koro-ni-rei-oni-okoshi-hen-manga-ends/.188996') // --> https://www.animenewsnetwork.com/news/2022-08-26/higurashi-no-naku-koro-ni-rei-oni-okoshi-hen-manga-ends/.188996
   */
  public fetchNewsInfo = async (id: string): Promise<INewsInfo> => {
    if (!id || typeof id !== 'string')
      throw new TypeError(
        `The type of parameter "id" should be of type "string", received type "${typeof id}" instead`
      );
    return await scrapNewsInfo(`${this.baseUrl}/news/${id}`).catch((err: Error) => {
      throw new Error(err.message);
    });
  };
}

export default AnimeNewsNetwork;
