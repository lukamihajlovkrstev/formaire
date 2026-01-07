import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { createFormSchema, Form } from '../types/form.types';
import { ZodError } from 'zod';
import { FormService } from '../services/form.service';

const router = Router();
const formService = new FormService();

router.post('/', protect, async (req, res, next) => {
  try {
    const body = createFormSchema.parse(req.body);
    const result = await formService.create(body.title, req.user!._id!);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.issues });
      return;
    }
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

export default router;
