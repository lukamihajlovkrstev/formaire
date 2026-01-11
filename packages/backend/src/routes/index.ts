import { Router } from 'express';
import authRoutes from './auth.routes';
import formRoutes from './form.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/forms', formRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
