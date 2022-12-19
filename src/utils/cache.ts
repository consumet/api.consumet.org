/* eslint-disable import/no-anonymous-default-export */
import Redis from 'ioredis';
const redis = new Redis(`${process.env.REDIS_URL}`);

/*
TLDR; " Expires " is seconds based. for example 60*60 would = 3600 (an hour)
*/

const fetch = async <T>(key: string, fetcher: () => T, expires: number) => {
  const existing = await get<T>(key);
  if (existing !== null) return existing;

  return set(key, fetcher, expires);
};

const get = async <T>(key: string): Promise<T> => {
  console.log('GET: ' + key);
  const value = await redis.get(key);
  if (value === null) return null as any;

  return JSON.parse(value);
};

const set = async <T>(key: string, fetcher: () => T, expires: number) => {
  console.log(`SET: ${key}, EXP: ${expires}`);
  const value = await fetcher();
  await redis.set(key, JSON.stringify(value), 'EX', expires);
  return value;
};

const del = async (key: string) => {
  await redis.del(key);
};

export default { fetch, set, get, del };
