import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server'

// * DB UTILS

let mongod: MongoMemoryServer | null = null

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI

  if (!uri) throw new Error('MONGO_URI not definied')

  if (uri === 'memory') {
    mongod = await MongoMemoryServer.create()
    const memUri = mongod.getUri()
    await mongoose.connect(memUri)
    console.log('[DB] MongoMemoryServer initialized')
  } else {
    await mongoose.connect(uri)
    console.log('[DB] Connected to MongoDB')
  }
}

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close()
  if (mongod) await mongod.stop()
}

/*
export const connectDB = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};*/