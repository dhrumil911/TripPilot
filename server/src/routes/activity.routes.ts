import { Router } from 'express';
import { removeActivity } from '../controllers/search.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Secure activity routes using JWT middleware
router.use(authMiddleware);

router.delete('/:id', removeActivity);

export default router;
