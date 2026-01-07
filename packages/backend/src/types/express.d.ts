import { User } from './auth.types';
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
