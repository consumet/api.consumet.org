export interface IBookProviderParams {
  bookProvider: string;
  page?: number;
}

export interface LibgenBook {
  id: string;
  title: string;
  tempAuthor: string;
  author: string[];
  publisher: string;
  year: string;
  language: string;
  format: string;
  size: string;
  pages: string;
  link: string;
  image: string;
  description: string;
  tableOfContents: string;
  edition: string;
  volume: string;
  topic: string;
  series: string;
  isbn: string[];
  hashes: Hashes;
}

interface Hashes {
  AICH: string;
  CRC32: string;
  eDonkey: string;
  MD5: string;
  SHA1: string;
  SHA256: string[];
  TTH: string;
}
