import { ObjectId } from 'mongodb';
import * as z from 'zod';

export const timelineParamsSchema = z.object({
  formId: z.string().refine((id) => ObjectId.isValid(id), 'Invalid form ID'),
});

export const timelineQuerySchema = z.object({
  days: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 30)),
});

export const statsParamsSchema = z.object({
  formId: z.string().refine((id) => ObjectId.isValid(id), 'Invalid form ID'),
});

export const peakHoursParamsSchema = z.object({
  formId: z.string().refine((id) => ObjectId.isValid(id), 'Invalid form ID'),
});
