import { Router } from 'express';
import { getAnalytics, listUsers } from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();
router.get('/analytics', authMiddleware, adminMiddleware, getAnalytics);
router.get('/users', authMiddleware, adminMiddleware, listUsers);

export default router;
