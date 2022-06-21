import { Schema } from 'mongoose';

const animeSchema = new Schema(
  {
    id: String!,
    title: String!,
    url: String!,
    subOrDub: String,
    type: String,
    genres: [String],
    releasedDate: Number,
    status: String,
    otherNames: [String],
    description: String,
    image: String,
    totalEpisodes: Number,
    episodes: [
      {
        id: String!,
        number: Number!,
        url: String,
      },
    ],
  },
  { collection: 'gogoanime' }
);

export default animeSchema;
