import mongoose from "mongoose";
import { ENV } from "./env";

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB connected successfully to ${mongoose.connection.host}`);
    return conn;
  } catch (error) {
    console.error("[Database] MongoDB connection error:", error);
    throw error;
  }
}

