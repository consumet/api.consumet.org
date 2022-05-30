import mongoose from 'mongoose';

/**
 * Connect to the database and return the mongoose client
 * @param options mongoose options object (see mongoose docs)
 * @returns mongoose client
 */
export const connectToDB = async (
  options?: mongoose.ConnectOptions
): Promise<typeof mongoose> => {
  try {
    console.log('Connecting to database...');
    const mongooseClient = await mongoose.connect(process.env.MONGO_URI!, options);
    console.log(`Connected to ${mongooseClient.connection.name} database\n\n`);
    return mongooseClient;
  } catch (err) {
    throw new Error('Error connecting to database.');
  }
};
