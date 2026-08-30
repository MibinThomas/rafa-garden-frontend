import mongoose from 'mongoose';

const DEFAULT_URI = "mongodb+srv://Vercel-Admin-rafah-garden-db:6zV4p4hGDT7g9h41@rafah-garden-db.jn3zk3s.mongodb.net/rafa-garden?retryWrites=true&w=majority";
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless invocations on Vercel.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
