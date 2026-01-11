import * as z from 'zod';
import { ObjectId } from 'mongodb';

export const submissionDataSchema = z
  .record(z.string(), z.unknown())
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Submission data must contain at least one field',
  });

export type SubmissionData = z.infer<typeof submissionDataSchema>;

export const submissionSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  timestamp: z.date(),
  meta: z.object({
    form: z.instanceof(ObjectId),
  }),
  data: submissionDataSchema,
});

export type Submission = z.infer<typeof submissionSchema>;

export const paginatedSubmissionsSchema = z.object({
  submissions: z.array(submissionSchema),
  columns: z.array(z.string()),
  meta: z.object({
    next: z.string().nullable(),
    more: z.boolean(),
  }),
});

export type PaginatedSubmissions = z.infer<typeof paginatedSubmissionsSchema>;

export const paginatedSubmissionsQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20)),
  cursor: z.string().optional(),
});

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
  active: z.boolean(),
  count: z.number().default(0),
  columns: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Form = z.infer<typeof formSchema>;

export const createFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;

export const updateFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
});

export type UpdateFormInput = z.infer<typeof updateFormSchema>;
