import * as z from 'zod';
import { ObjectId } from 'mongodb';

export const userSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  googleId: z.string(),
  email: z.email(),
  name: z.string(),
  picture: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
