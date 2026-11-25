import env from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(
      `[Server] Running in ${env.nodeEnv} mode on http://localhost:${env.port}`
    );
  });

  const shutdown = (signal) => {
    console.log(`[Server] ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch((error) => {
  console.error('[Server] Startup failed:', error);
  process.exit(1);
});
