import { createApp } from './app.js';
import { database } from './lib/database.js';

const startServer = async () => {
  try {
    await database.connect();

    const app = createApp();

    const PORT = parseInt(process.env.PORT!);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });

    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Shutting down gracefully...');
      await database.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    await database.disconnect();
    process.exit(1);
  }
};

startServer();
