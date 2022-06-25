import mongoose from 'mongoose';
import libgenSchema from './schema/libgen.schema';
import getComicsSchema from './schema/getComics.schema';

export const libgenModel = mongoose.model('Libgen', libgenSchema);
export const getComicsModel = mongoose.model('GetComics', getComicsSchema);
