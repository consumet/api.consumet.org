import mongoose from 'mongoose';
const { Schema } = mongoose;

const getComicsSchema = new Schema({
  image: String,
  title: String,
  year: String,
  size: String,
  excerpt: String,
  category: String,
  description: String,
  download: String,
  ufile: String,
  mega: String,
  mediafire: String,
  zippyshare: String,
  readOnline: String,
});

export default getComicsSchema;
