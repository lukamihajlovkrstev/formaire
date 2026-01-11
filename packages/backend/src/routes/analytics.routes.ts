import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  statsParamsSchema,
  timelineParamsSchema,
  timelineQuerySchema,
} from '../types/analytics.types';
import { AnalyticsService } from '../services/analytics.service';
import { ZodError } from 'zod';

const router = Router();
const analyiticsService = new AnalyticsService();

router.get('/:formId/timeline', protect, async (req, res, next) => {
  try {
    const { formId } = timelineParamsSchema.parse(req.params);
    const { days } = timelineQuerySchema.parse(req.query);

    const result = await analyiticsService.timeline(formId, days);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:formId/stats', async (req, res) => {
  try {
    const { formId } = statsParamsSchema.parse(req.params);
    const results = await analyiticsService.stats(formId);
    res.json(results);
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ error: 'Validation error', details: error.issues });
      return;
    }
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
