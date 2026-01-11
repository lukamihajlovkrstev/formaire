import express from 'express';
import router from './routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    cors((req, callback) => {
      const pathPattern = /^\/api\/forms\/[^\/]+$/;
      const isFormSubmissionPath = pathPattern.test(req.path);

      if (req.method === 'POST' && isFormSubmissionPath) {
        callback(null, {
          origin: true,
          methods: ['POST', 'OPTIONS'],
          allowedHeaders: ['Content-Type'],
        });
      } else if (req.method === 'OPTIONS' && isFormSubmissionPath) {
        const requestOrigin = req.headers.origin;

        if (requestOrigin === process.env.FRONTEND) {
          callback(null, {
            origin: process.env.FRONTEND!,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
          });
        } else {
          callback(null, {
            origin: true,
            methods: ['POST', 'OPTIONS'],
            allowedHeaders: ['Content-Type'],
          });
        }
      } else {
        callback(null, {
          origin: process.env.FRONTEND!,
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization'],
        });
      }
    }),
  );
  app.use('/api', router);

  return app;
}
