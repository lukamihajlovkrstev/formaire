import { createApp } from './app.js';
import { database } from './lib/database.js';
import { FormService } from './services/form.service.js';
import { SessionService } from './services/session.service.js';
import { SubmissionService } from './services/submission.service.js';
import { UserService } from './services/user.service.js';

const startServer = async () => {
  try {
    await database.connect();

    const userService = new UserService();
    const sessionService = new SessionService();
    const formService = new FormService();
    const submissionService = new SubmissionService();
    await submissionService.ensureIndexes();
    await userService.ensureIndexes();
    await formService.ensureIndexes();
    await sessionService.ensureIndexes();

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
