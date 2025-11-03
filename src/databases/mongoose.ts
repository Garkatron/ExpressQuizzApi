import mongoose from 'mongoose';

// * DB UTILS

const uri: string = process.env.MONGO_URI as string;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};