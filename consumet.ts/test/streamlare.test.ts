import { StreamLare } from '../src/extractors';

const streamlare = new StreamLare();

const testicles = async () => {
  const data = await streamlare.extract(new URL('https://slmaxed.com/v/RWwM7lM8ZPPzZKbo'));
  console.log(data);
};

testicles();
