import { LibgenBook } from '@consumet/extensions/dist/models';
import { libgenModel } from '../models';
import axios from 'axios';
import mongoose from 'mongoose';
import { load } from 'cheerio';
import { BOOKS } from '@consumet/extensions';

const connectToDB = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
};

const popularBooksSites = [
  'https://www.goodreads.com/list/show/1.Best_Books_Ever',
  'https://www.goodreads.com/list/show/50.The_Best_Epic_Fantasy_fiction_',
  'https://www.goodreads.com/list/show/15.Best_Historical_Fiction',
  'https://www.goodreads.com/list/show/10762.Best_Book_Boyfriends',
  'https://www.goodreads.com/list/show/47.Best_Dystopian_and_Post_Apocalyptic_Fiction',
  'https://www.goodreads.com/list/show/9440.100_Best_Books_of_All_Time_The_World_Library_List',
  'https://www.goodreads.com/list/show/36714.The_100_Most_Influential_Books_Ever_Written',
  'https://www.goodreads.com/shelf/show/100-books-everyone-should-read',
  'https://www.goodreads.com/list/show/264.Books_That_Everyone_Should_Read_At_Least_Once',
];

const popularBooks: string[] = [];

const fillBooks = async () => {
  for (let s of popularBooksSites) {
    const res = await axios.get(s);
    const $ = load(res.data);
    $('table tbody tr a.bookTitle').each((n, e) => {
      const rawTitle = $(e).text().trim();
      let title = rawTitle.substring(0, rawTitle.indexOf('(')) || rawTitle;
      title = title.substring(0, title.indexOf('/')) || title;
      title = title.substring(0, title.indexOf(':')) || title;
      title = title.trim();
      if (popularBooks.indexOf(title) == -1) {
        popularBooks.push(title);
      }
    });
  }
};

export const insertNewBook = async ({
  id,
  title,
  authors,
  publisher,
  year,
  language,
  format,
  size,
  pages,
  link,
  image,
  description,
  tableOfContents,
  edition,
  volume,
  topic,
  series,
  hashes,
  isbn,
}: LibgenBook) => {
  const b = await libgenModel.findOne({ id: id });
  if (b) {
    console.log('skipped');
    return;
  }
  const instance = new libgenModel({
    id,
    title,
    authors,
    publisher,
    year,
    language,
    format,
    size,
    pages,
    downloadLink: link,
    image,
    description,
    tableOfContents,
    edition,
    volume,
    topic,
    series,
    hashes,
    isbn,
  });

  instance.save((err: any) => (err ? console.log(err) : 1));
};

const getPopularBooks = async () => {
  await connectToDB();
  await fillBooks();
  let start = false;
  for (let book of popularBooks) {
    if (book == 'The Long Walk') {
      start = true;
      continue;
    }
    if (start) {
      const newString = `${Math.random() * 1000}i`;
      console.time(newString);
      const libgen = new BOOKS.Libgen();
      const urlBook = encodeURIComponent(book);
      const results = await libgen.search(urlBook);
      for (let result of results) {
        insertNewBook(result);
      }
      console.log(`${book} done`);
      console.timeEnd(newString);
    }
  }
};

getPopularBooks();
