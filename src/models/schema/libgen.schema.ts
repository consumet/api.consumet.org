import mongoose from 'mongoose';
const { Schema } = mongoose;

const libgenSchema = new Schema({
  title: { type: String, required: true },
  authors: { type: [String] },
  publisher: { type: String },
  year: { type: String },
  edition: String,
  volume: String,
  series: String,
  isbn: [String],
  image: { type: String, required: true },
  description: String,
  downloadLink: { type: String },
  id: { type: String, required: true },
  langauge: { type: String },
  format: { type: String },
  size: { type: String },
  pages: { type: String },
  tableOfContents: String,
  topic: String,
  hashes: {
    AICH: String,
    CRC32: String,
    eDonkey: String,
    MD5: String,
    SHA1: String,
    SHA256: [String],
    TTH: String,
  },
});

export default libgenSchema;
