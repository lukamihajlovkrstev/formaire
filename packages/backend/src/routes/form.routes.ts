import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  createFormSchema,
  Form,
  formIdParamSchema,
  updateFormSchema,
} from '../types/form.types';
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
    res.status(500).json({ error: 'Failed to create form' });
  }
});

router.put('/:formId', protect, async (req, res, next) => {
  try {
    const { formId } = formIdParamSchema.parse(req.params);
    const body = updateFormSchema.parse(req.body);

    const exists = formService.find(formId, req.user!._id!);
    if (!exists) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    const result = await formService.update(body.title, formId, req.user!._id!);
    if (!result) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    res.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.issues });
      return;
    }
    res.status(500).json({ error: 'Failed to update form' });
  }
});

export default router;
