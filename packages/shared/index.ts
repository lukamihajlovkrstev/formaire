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

export const formSchema = z.object({
  _id: z.instanceof(ObjectId),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  ownerId: z.instanceof(ObjectId),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Form = z.infer<typeof formSchema>;
