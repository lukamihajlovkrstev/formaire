import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { formIdParamSchema, submissionParamSchema } from '../types/form.types';
import { ZodError } from 'zod';
import { FormService } from '../services/form.service';
import {
  createFormSchema,
  paginatedSubmissionsQuerySchema,
  submissionDataSchema,
  updateFormSchema,
} from '@formaire/shared';
import { SubmissionService } from '../services/submission.service';

const router = Router();
const formService = new FormService();
const submissionService = new SubmissionService();

router.get('/', protect, async (req, res) => {
  try {
    const result = await formService.get(req.user!._id!);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create form' });
  }
});

router.post('/', protect, async (req, res) => {
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

router.delete('/:formId/:submissionId', protect, async (req, res) => {
  try {
    const { formId, submissionId } = submissionParamSchema.parse(req.params);

    const exists = await formService.find(formId, req.user!._id!);
    if (!exists) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    await submissionService.delete(formId, submissionId);

    res.status(204).send();
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.issues });
      return;
    }
    console.log(error);
    res.status(500).json({ error: 'Failed to update form' });
  }
});

router.get('/:formId', async (req, res) => {
  try {
    const { formId } = formIdParamSchema.parse(req.params);
    const { limit, cursor } = paginatedSubmissionsQuerySchema.parse(req.query);

    const exists = await formService.active(formId);
    if (!exists) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    const result = await submissionService.fetch(formId, limit, cursor);

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.issues });
      return;
    }
    console.log(error);
    res.status(500).json({ error: 'Failed to update form' });
  }
});

router.post('/:formId', async (req, res) => {
  try {
    const { formId } = formIdParamSchema.parse(req.params);
    const data = submissionDataSchema.parse(req.body);

    const exists = await formService.active(formId);
    if (!exists) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    await submissionService.submit(formId, data);

    res.status(201).send();
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.issues });
      return;
    }
    console.log(error);
    res.status(500).json({ error: 'Failed to update form' });
  }
});

router.put('/:formId', protect, async (req, res) => {
  try {
    const { formId } = formIdParamSchema.parse(req.params);
    const body = updateFormSchema.parse(req.body);

    const exists = await formService.find(formId, req.user!._id!);
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

router.delete('/:formId', protect, async (req, res) => {
  try {
    const { formId } = formIdParamSchema.parse(req.params);

    const exists = await formService.find(formId, req.user!._id!);
    if (!exists) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    await formService.delete(formId, req.user!._id!);

    res.status(204).send();
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
