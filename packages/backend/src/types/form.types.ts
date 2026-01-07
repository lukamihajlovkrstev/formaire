import * as z from 'zod';
import { ObjectId } from 'mongodb';

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

export const formIdParamSchema = z.object({
  formId: z.string().refine((id) => ObjectId.isValid(id), 'Invalid form ID'),
});
