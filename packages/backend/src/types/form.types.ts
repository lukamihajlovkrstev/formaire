import * as z from 'zod';
import { ObjectId } from 'mongodb';

export const formIdParamSchema = z.object({
  formId: z.string().refine((id) => ObjectId.isValid(id), 'Invalid form ID'),
});

export const submissionParamSchema = z.object({
  formId: z.string().refine((id) => ObjectId.isValid(id), 'Invalid form ID'),
  submissionId: z
    .string()
    .refine((id) => ObjectId.isValid(id), 'Invalid form ID'),
});
