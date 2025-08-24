import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  let mongoUri: string = '';
  if (process.env.NODE_ENV == 'production') {
    mongoUri = process.env.MONGO_URI_PROD || '';
  } else if (process.env.NODE_ENV == 'development') {
    mongoUri = process.env.MONGO_URI_DEV || '';
  }

  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not defined');
  }
  await mongoose.connect(mongoUri);
};

export default connectDB;
