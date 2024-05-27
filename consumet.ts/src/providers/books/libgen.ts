import { load } from 'cheerio';
import { BookParser, LibgenBook, LibgenBookObject } from '../../models';
import { splitAuthor, floorID, formatTitle } from '../../utils';
import { encode } from 'ascii-url-encoder';
import { Worker } from 'worker_threads';
import { LibgenResult } from '../../models/types';

class Libgen extends BookParser {
  private readonly extensions = ['.rs', '.is', '.st'];
  protected override readonly baseUrl = 'http://libgen';
  /**
   * @type {string}
   */
  override readonly name: string = 'Libgen';
  private readonly downloadIP = 'http://62.182.86.140';

  protected override logo =
    'https://f-droid.org/repo/com.manuelvargastapia.libgen/en-US/icon_TP2ezvMwW5ovE-wixagF1WCThMUohX3T_kzYhuZQ8aY=.png';
  protected override classPath = 'BOOKS.Libgen';

  /**
   * scrapes a ligen book page by book page url
   *
   * @param {string} bookUrl - ligen book page url
   * @returns {Promise<LibgenBook>}
   */
  scrapeBook = async (bookUrl: string): Promise<LibgenBook> => {
    bookUrl = encodeURIComponent(bookUrl);
    const container: LibgenBook = new LibgenBookObject();
    const { data } = await this.client.get(bookUrl);
    const $ = load(data);
    let rawAuthor = '';
    $('tbody > tr:eq(10)')
      .children()
      .each((i, el) => {
        switch (i) {
          case 1:
            rawAuthor = $(el).text();
            break;
        }
      });
    container.authors = splitAuthor(rawAuthor);

    let publisher = '';
    $('tbody > tr:eq(12)')
      .children()
      .each((i, el) => {
        switch (i) {
          case 1:
            publisher = $(el).text();
            break;
        }
      });
    container.publisher = publisher;

    let ex = '';
    let size = '';
    $('tbody > tr:eq(18)')
      .children()
      .each((i, el) => {
        switch (i) {
          case 1:
            size = $(el).text();
            break;
          case 3:
            ex = $(el).text();
            break;
        }
      });
    container.format = ex;
    container.size = size;

    let lang = '';
    let page = '';
    $('tbody > tr:eq(14)')
      .children()
      .each((i, el) => {
        switch (i) {
          case 1:
            lang = $(el).text();
            break;
          case 3:
            page = $(el).text().split('/')[0];
            break;
        }
      });
    container.pages = page;
    container.language = lang;

    let tempTitle = '';
    let tempVolume = '';
    $('tbody > tr:eq(1)')
      .children()
      .each((i, el) => {
        switch (i) {
          case 2:
            tempTitle = $(el).text();
            break;
          case 4:
            tempVolume = $(el).text();
        }
      });
    container.title = tempTitle;
    container.volume = tempVolume;
    container.image = `${this.baseUrl}${this.extensions[0]}` + $('img').attr('src');
    let tempIsbn: string[] = [];
    let id = '';
    $('tbody > tr:eq(15)')
      .children()
      .each((i, el) => {
        switch (i) {
          case 1:
            tempIsbn = $(el).text().split(', ');
            break;
          case 3:
            id = $(el).text();
            break;
        }
      });
    container.id = id;
    container.isbn = tempIsbn;
    container.description = $('tbody > tr:eq(31)').text() || '';
    container.tableOfContents = $('tbody > tr:eq(32)').text() || '';
    let tempSeries = '';
    $('tbody > tr:eq(11)')
      .children()
      .each((i, el) => {
        switch (i) {
          case 1:
            tempSeries = $(el).text();
            break;
        }
      });
    container.series = tempSeries;
    let tempTopic = '';
    $('tbody > tr:eq(22)')
      .children()
      .each((i, el) => {
        switch (i) {
          case 1:
            tempTopic = $(el).text();
            break;
        }
      });
    container.topic = tempTopic;
    let tempEdition = '';
    let year = '';
    $('tbody > tr:eq(13)')
      .children()
      .each((i, el) => {
        switch (i) {
          case 1:
            year = $(el).text();
            break;
          case 3:
            tempEdition = $(el).text();
            break;
        }
      });
    container.year = year;
    container.edition = tempEdition;

    for (let p = 2; p <= 8; p++) {
      let temp = '';
      $(`tbody tr:eq(${p})`)
        .children()
        .each((i, el) => {
          switch (i) {
            case 1:
              temp = $(el).text();
          }
        });
      switch (p) {
        case 2:
          container.hashes.AICH = temp;
          break;
        case 3:
          container.hashes.CRC32 = temp;
          break;
        case 4:
          container.hashes.eDonkey = temp;
          break;
        case 5:
          container.hashes.MD5 = temp;
          break;
        case 6:
          container.hashes.SHA1 = temp;
          break;
        case 7:
          container.hashes.SHA256 = temp.split(' ');
          break;
        case 8:
          container.hashes.TTH = temp;
          break;
      }
    }
    let realLink: string = '';
    const fakeLink = bookUrl;
    for (let i = 0; i < fakeLink.length; i++) {
      if (
        fakeLink[i] === 'm' &&
        fakeLink[i + 1] === 'd' &&
        fakeLink[i + 2] === '5' &&
        fakeLink[i + 3] === '='
      ) {
        realLink = fakeLink.substring(i + 4, fakeLink.length);
        break;
      }
    }
    container.link = `${this.downloadIP}/main/${floorID(container.id)}/${realLink.toLowerCase()}/${encode(
      `${container.series == '' ? '' : `(${container.series})`} ${rawAuthor} - ${container.title}-${
        container.publisher
      } (${container.year}).${container.format}`
    )}`;
    return container;
  };

  /**
   * scrapes a libgen search page and returns an array of results
   *
   * @param {string} query - the name of the book
   * @param {number} [maxResults=25] - maximum number of results
   * @returns {Promise<LibgenBook[]>}
   */
  override search = async (query: string, page: number = 1): Promise<LibgenResult> => {
    query = encodeURIComponent(query);
    const workingExtension = this.extensions[0];
    const containers: LibgenBook[] = [];
    const { data } = await this.client.get(
      `${this.baseUrl}.rs/search.php?req=${query}&view=simple&res=25&sort=def&sortmode=ASC&page=${page}`
    );
    const $ = load(data);
    let rawAuthor = '';
    $('table tbody tr').each((i, e) => {
      const container: LibgenBook = new LibgenBookObject();
      $(e.children).each((i, e) => {
        if ($(e).text() === '\n\t\t\t\t') return;
        switch (i) {
          case 0:
            container.id = $(e).text();
            break;
          case 2:
            rawAuthor = $(e).text();
            container.authors = splitAuthor(rawAuthor);
            break;
          case 4:
            let potLink: string = '';
            $(e)
              .children()
              .each((i, el) => {
                if (potLink != '') {
                  return;
                }
                if ($(el).attr('href')?.at(0) === 'b') {
                  potLink = $(el).attr('href') || '';
                }
              });
            container.link = `${this.baseUrl}${workingExtension}/${potLink}`;
          case 6:
            container.publisher = $(e).text();
            break;
          case 8:
            container.year = $(e).text();
            break;
          case 10:
            container.pages = $(e).text();
            break;
          case 12:
            container.language = $(e).text();
            break;
          case 14:
            container.size = $(e).text();
            break;
          case 16:
            container.format = $(e).text();
            break;
        }
      });
      containers[i] = container;
    });
    containers.shift();
    containers.shift();
    containers.shift();
    containers.pop();
    for (let i = 0; i < containers.length; i++) {
      if (containers[i].link == '') {
        continue;
      }
      const data = await this.client.get(containers[i].link);
      const $ = load(data.data);
      let tempTitle = '';
      let tempVolume = '';
      $('tbody > tr:eq(1)')
        .children()
        .each((i, el) => {
          switch (i) {
            case 2:
              tempTitle = $(el).text();
              break;
            case 4:
              tempVolume = $(el).text();
          }
        });
      containers[i].title = tempTitle;
      containers[i].volume = tempVolume;
      containers[i].image = `${this.baseUrl}${workingExtension}` + $('img').attr('src');
      let tempIsbn: string[] = [];
      $('tbody > tr:eq(15)')
        .children()
        .each((i, el) => {
          switch (i) {
            case 1:
              tempIsbn = $(el).text().split(', ');
              break;
          }
        });
      containers[i].isbn = tempIsbn;
      containers[i].description = $('tbody > tr:eq(31)').text() || '';
      containers[i].tableOfContents = $('tbody > tr:eq(32)').text() || '';
      let tempSeries = '';
      $('tbody > tr:eq(11)')
        .children()
        .each((i, el) => {
          switch (i) {
            case 1:
              tempSeries = $(el).text();
              break;
          }
        });
      containers[i].series = tempSeries;
      let tempTopic = '';
      $('tbody > tr:eq(22)')
        .children()
        .each((i, el) => {
          switch (i) {
            case 1:
              tempTopic = $(el).text();
              break;
          }
        });
      containers[i].topic = tempTopic;
      let tempEdition = '';
      $('tbody > tr:eq(13)')
        .children()
        .each((i, el) => {
          switch (i) {
            case 3:
              tempEdition = $(el).text();
              break;
          }
        });
      containers[i].edition = tempEdition;
      for (let p = 2; p <= 8; p++) {
        let temp = '';
        $(`tbody tr:eq(${p})`)
          .children()
          .each((i, el) => {
            switch (i) {
              case 1:
                temp = $(el).text();
            }
          });
        switch (p) {
          case 2:
            containers[i].hashes.AICH = temp;
            break;
          case 3:
            containers[i].hashes.CRC32 = temp;
            break;
          case 4:
            containers[i].hashes.eDonkey = temp;
            break;
          case 5:
            containers[i].hashes.MD5 = temp;
            break;
          case 6:
            containers[i].hashes.SHA1 = temp;
            break;
          case 7:
            containers[i].hashes.SHA256 = temp.split(' ');
            break;
          case 8:
            containers[i].hashes.TTH = temp;
            break;
        }
      }
      let realLink: string = '';
      const fakeLink = containers[i].link;
      for (let i = 0; i < fakeLink.length; i++) {
        if (
          fakeLink[i] === 'm' &&
          fakeLink[i + 1] === 'd' &&
          fakeLink[i + 2] === '5' &&
          fakeLink[i + 3] === '='
        ) {
          realLink = fakeLink.substring(i + 4, fakeLink.length);
          break;
        }
      }
      containers[i].link = `${this.downloadIP}/main/${floorID(
        containers[i].id
      )}/${realLink.toLowerCase()}/${encode(
        `${containers[i].series == '' ? '' : `(${containers[i].series})`} ${rawAuthor} - ${
          containers[i].title
        }-${containers[i].publisher} (${containers[i].year}).${containers[i].format}`
      )}`;
    }
    return {
      result: containers,
      hasNextPage:
        $('table:eq(1) tbody tr td:eq(1) font a:eq(0)').text().trim() == '►' ||
        $('table:eq(1) tbody tr td:eq(1) font a:eq(1)').text().trim() == '►'
          ? true
          : false,
    };
  };
}

export default Libgen;
