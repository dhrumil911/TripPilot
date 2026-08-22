import { Router } from 'express';
import { getProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Secure profile route with jwt middleware validation
router.get('/profile', authMiddleware, getProfile);

export default router;
