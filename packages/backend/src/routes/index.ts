import { Router } from 'express';
import authRoutes from './auth.routes';
import formRoutes from './form.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/forms', formRoutes);

export default router;
