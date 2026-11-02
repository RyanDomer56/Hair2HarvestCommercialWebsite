import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/hair2harvest";

export async function connect(uri = MONGODB_URI) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  return mongoose.connection;
}

export async function disconnect() {
  await mongoose.disconnect();
}

export const isConnected = () => mongoose.connection.readyState === 1;
