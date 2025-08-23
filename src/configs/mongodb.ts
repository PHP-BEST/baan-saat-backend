import mongoose from 'mongoose';
import path from 'path';

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  const entryFile = process.argv[1] || '';
  const isProd = entryFile.includes('dist');

  let mongoUri: string;

  if (isProd) {
    console.log('🚀 Using PRODUCTION Database 🚀');
    mongoUri = process.env.MONGO_URI_PROD || '';
  } else {
    console.log('🔧 Using DEVELOPMENT Database 🔧');
    mongoUri = process.env.MONGO_URI_DEV || '';
  }

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined');
  }

  await mongoose.connect(mongoUri);
};

export default connectDB;
