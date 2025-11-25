import { Redis } from 'ioredis';

const fetch = async <T>(redis: Redis, key: string, fetcher: () => T, expires: number) => {
  const existing = await get<T>(redis, key);
  if (existing !== null) return existing;

  return set(redis, key, fetcher, expires);
};

const get = async <T>(redis: Redis, key: string): Promise<T> => {
  console.log('GET: ' + key);
  const value = await redis.get(key);
  if (value === null) return null as any;

  return JSON.parse(value);
};

const set = async <T>(redis: Redis, key: string, fetcher: () => T, expires: number) => {
  console.log(`SET: ${key}, EXP: ${expires}`);
  const value = await fetcher();
  await redis.set(key, JSON.stringify(value), 'EX', expires);
  return value;
};

const del = async (redis: Redis, key: string) => {
  await redis.del(key);
};

export default { fetch, set, get, del };
