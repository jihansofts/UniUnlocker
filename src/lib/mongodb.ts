import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Stored on globalThis so hot reloads and serverless reuse share one pool.
const globalWithCache = globalThis as typeof globalThis & {
  __mongoose?: MongooseCache;
};
const cached: MongooseCache = (globalWithCache.__mongoose ??= {
  conn: null,
  promise: null,
});

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  cached.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Clear the failed attempt so the next request can retry.
    cached.promise = null;
    throw error;
  }
}
