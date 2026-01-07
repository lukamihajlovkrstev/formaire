import { User } from './auth.types';

export interface Session {
  _id: string;
  user: User;
  createdAt: Date;
  expiresAt: Date;
}
