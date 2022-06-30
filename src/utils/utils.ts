import mongoose from 'mongoose';
import { GetComicsComics, LibgenBook } from '@consumet/extensions/dist/models';
import { getComicsModel, libgenModel } from '../models';

/**
 * Connect to the database and return the mongoose client
 * @param options mongoose options object (see mongoose docs)
 * @returns mongoose client
 */
export const connectToDB = async (
  options?: mongoose.ConnectOptions
): Promise<typeof mongoose | undefined> => {
  try {
    console.log('Connecting to database...');
    const mongooseClient = await mongoose.connect(process.env.MONGO_URI!, options);
    console.log(`Connected to ${mongooseClient.connection.name} database\n\n`);
    return mongooseClient;
  } catch (err) {
    console.log('Error connecting to database' + err);
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

export const insertNewComic = async ({
  image,
  title,
  year,
  size,
  excerpt,
  category,
  description,
  download,
  ufile,
  mega,
  mediafire,
  zippyshare,
  readOnline,
}: GetComicsComics) => {
  const b = await getComicsModel.findOne({ title, image });
  if (b) {
    console.log('skipped');
    return;
  }
  const instance = new getComicsModel({
    image,
    title,
    year,
    size,
    excerpt,
    category,
    description,
    download,
    ufile,
    mega,
    mediafire,
    zippyshare,
    readOnline,
  });

  instance.save((err: any) => (err ? console.log(err) : 1));
};
