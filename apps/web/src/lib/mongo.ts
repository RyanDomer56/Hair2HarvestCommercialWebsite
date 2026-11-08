import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

type Cached = { conn?: typeof mongoose; promise?: Promise<typeof mongoose> };
const globalForMongo = globalThis as unknown as { _h2hMongo?: Cached };

/**
 * Cached MongoDB connection for serverless route handlers. Reuses the socket
 * across invocations instead of opening a new one per request.
 */
export async function connectMongo(): Promise<typeof mongoose> {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  if (mongoose.connection.readyState === 1) return mongoose;

  if (!globalForMongo._h2hMongo) globalForMongo._h2hMongo = {};
  if (!globalForMongo._h2hMongo.promise) {
    globalForMongo._h2hMongo.promise = mongoose
      .connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
      .then(() => mongoose);
  }
  globalForMongo._h2hMongo.conn = await globalForMongo._h2hMongo.promise;
  return globalForMongo._h2hMongo.conn;
}
