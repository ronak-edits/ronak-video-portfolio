import mongoose from 'mongoose';
import env from './env.js';

const READY_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/**
 * Establishes a MongoDB connection using Mongoose.
 * In development without MONGO_URI configured, skips connection cleanly so
 * foundation health checks remain testable.
 */
export const connectDB = async () => {
  if (!env.mongoUri) {
    console.warn(
      '[DB] MONGO_URI is not set. Skipping MongoDB connection in Phase 1.'
    );
    return null;
  }

  try {
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[DB] MongoDB connection failed: ${error.message}`);
    if (env.isProduction) {
      process.exit(1);
    }
    return null;
  }
};

export const getDatabaseStatus = () => ({
  configured: Boolean(env.mongoUri),
  status: READY_STATES[mongoose.connection.readyState] || 'unknown',
});
