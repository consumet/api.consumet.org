// import sharp from 'sharp';
import { load } from 'cheerio';
// import * as blurhash from 'blurhash';
import { ProxyConfig } from '../models';
import axios, { AxiosRequestConfig } from 'axios';

// Converts object to tuples of [prop name,prop type]
// So { a: 'Hello', b: 'World', c: '!!!' }
// will be  [a, 'Hello'] | [b, 'World'] | [c, '!!!']
type TuplesFromObject<T> = {
  [P in keyof T]: [P, T[P]];
}[keyof T];
// Gets all property  keys of a specified value type
// So GetKeyByValue<{ a: 'Hello', b: 'World', c: '!!!' }, 'Hello'> = 'a'
type GetKeyByValue<T, V> = TuplesFromObject<T> extends infer TT
  ? TT extends [infer P, V]
    ? P
    : never
  : never;

export const remap = <
  T extends { [key: string]: any },
  V extends string, // needed to force string literal types for mapping values
  U extends { [P in keyof T]: V }
>(
  original: T,
  mapping: U
) => {
  const remapped: any = {};

  Object.keys(original).forEach(k => {
    remapped[mapping[k]] = original[k];
  });
  return remapped as {
    // Take all the values in the map,
    // so given { a: 'Hello', b: 'World', c: '!!!' }  U[keyof U] will produce 'Hello' | 'World' | '!!!'
    [P in U[keyof U]]: T[GetKeyByValue<U, P>]; // Get the original type of the key in T by using GetKeyByValue to get to the original key
  };
};

export const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';
export const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const splitAuthor = (authors: string) => {
  const res: string[] = [];
  let eater = '';
  for (let i = 0; i < authors.length; i++) {
    if (authors[i] == ' ' && (authors[i - 1] == ',' || authors[i - 1] == ';')) {
      continue;
    }
    if (authors[i] == ',' || authors[i] == ';') {
      res.push(eater.trim());
      eater = '';
      continue;
    }
    eater += authors[i];
  }
  res.push(eater);
  return res;
};

export const floorID = (id: string) => {
  let imp = '';
  for (let i = 0; i < id?.length - 3; i++) {
    imp += id[i];
  }
  const idV = parseInt(imp);
  return idV * 1000;
};

export const formatTitle = (title: string) => {
  const result = title.replace(/[0-9]/g, '');
  return result.trim();
};

export const genElement = (s: string, e: string) => {
  if (s == '') return;
  const $ = load(e);
  let i = 0;
  let str = '';
  let el = $();
  for (; i < s.length; i++) {
    if (s[i] == ' ') {
      el = $(str);
      str = '';
      i++;
      break;
    }
    str += s[i];
  }
  for (; i < s.length; i++) {
    if (s[i] == ' ') {
      el = $(el).children(str);
      str = '';
      continue;
    }
    str += s[i];
  }
  el = $(el).children(str);
  return el;
};

export const range = ({ from = 0, to = 0, step = 1, length = Math.ceil((to - from) / step) }) =>
  Array.from({ length }, (_, i) => from + i * step);

export const capitalizeFirstLetter = (s: string) => s?.charAt(0).toUpperCase() + s.slice(1);

export const getDays = (day1: string, day2: string) => {
  const day1Index = days.indexOf(capitalizeFirstLetter(day1)) - 1;
  const day2Index = days.indexOf(capitalizeFirstLetter(day2)) - 1;
  const now = new Date();
  const day1Date = new Date();
  const day2Date = new Date();
  day1Date.setDate(now.getDate() + ((day1Index + 7 - now.getDay()) % 7));
  day2Date.setDate(now.getDate() + ((day2Index + 7 - now.getDay()) % 7));
  day1Date.setHours(0, 0, 0, 0);
  day2Date.setHours(0, 0, 0, 0);
  return [day1Date.getTime() / 1000, day2Date.getTime() / 1000];
};

export const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export function convertDuration(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return `PT${hours}H${minutes}M${seconds}S`;
}

export const compareTwoStrings = (first: string, second: string): number => {
  first = first.replace(/\s+/g, '');
  second = second.replace(/\s+/g, '');

  if (first === second) return 1; // identical or empty
  if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

  const firstBigrams = new Map();
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;

    firstBigrams.set(bigram, count);
  }

  let intersectionSize = 0;
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;

    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (first.length + second.length - 2);
};

export const substringAfter = (str: string, toFind: string) => {
  const index = str.indexOf(toFind);
  return index == -1 ? '' : str.substring(index + toFind.length);
};

export const substringBefore = (str: string, toFind: string) => {
  const index = str.indexOf(toFind);
  return index == -1 ? '' : str.substring(0, index);
};

export const substringAfterLast = (str: string, toFind: string) => {
  const index = str.lastIndexOf(toFind);
  return index == -1 ? '' : str.substring(index + toFind.length);
};

export const substringBeforeLast = (str: string, toFind: string) => {
  const index = str.lastIndexOf(toFind);
  return index == -1 ? '' : str.substring(0, index);
};

// const generateHash = async (url: string) => {
//   let returnedBuffer;

//   const response = await fetch(url);
//   const arrayBuffer = await response.arrayBuffer();
//   returnedBuffer = Buffer.from(arrayBuffer);

//   // const { info, data } = await sharp(returnedBuffer).ensureAlpha().raw().toBuffer({
//   //   resolveWithObject: true,
//   // });

//   return blurhash.encode(new Uint8ClampedArray(data), info.width, info.height, 4, 3);
// };

export const getHashFromImage = (url: string) => {
  if (url?.length === 0) {
    return '';
  } else {
    let hash!: string;
    // generateHash(url).then(hashKey => (hash = hashKey));
    return 'hash';
  }
};
