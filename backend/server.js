import { createServer } from 'http';
import app from './src/app.js';
import { env } from './src/config/env.js';
import connectDB from './src/config/db.js';
import { initializeSocket } from './src/socket/index.js';
import { startNoShowCleanupJob } from './src/jobs/noShowCleanup.job.js';
import { startWaitTimeRecalculatorJob } from './src/jobs/waitTimeRecalculator.job.js';

const startServer = async () => {
  try {
    await connectDB();

    const server = createServer(app);
    initializeSocket(server);

    startNoShowCleanupJob();
    startWaitTimeRecalculatorJob();

    server.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`Client URL: ${env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
