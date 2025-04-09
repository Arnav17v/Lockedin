import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Initialize global cache
declare global {
  var mongooseCache: MongooseCache;
}

// Initialize cache if not exists
global.mongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studylens';

async function connectToDatabase() {
  // If we have a connection already, return it
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn;
  }

  // If a connection is being established, wait for it
  if (!global.mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    global.mongooseCache.promise = mongoose.connect(MONGODB_URI, opts);
  }
  
  try {
    global.mongooseCache.conn = await global.mongooseCache.promise;
  } catch (e) {
    global.mongooseCache.promise = null;
    throw e;
  }

  return global.mongooseCache.conn;
}

export { connectToDatabase };