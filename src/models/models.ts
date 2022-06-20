import mongoose from 'mongoose';
import libgenSchema from './schema/libgen.schema';

export const libgenModel = mongoose.model('Libgen', libgenSchema);
