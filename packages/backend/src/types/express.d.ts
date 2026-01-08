import { User } from '@formaire/shared';
import { Session } from './session.types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: Session;
    }
  }
}

export {};
