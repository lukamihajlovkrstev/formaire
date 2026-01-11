import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  timelineParamsSchema,
  timelineQuerySchema,
} from '../types/analytics.types';
import { AnalyticsService } from '../services/analytics.service';

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

export default router;
