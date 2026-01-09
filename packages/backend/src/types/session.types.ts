import { User } from '@formaire/shared';

export interface Session {
  _id: string;
  user: User;
  createdAt: Date;
  expiresAt: Date;
}
