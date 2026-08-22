import { Router } from 'express';
import { updateStop, deleteStop } from '../controllers/stop.controller';
import { attachActivity } from '../controllers/search.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Secure all stop routes using JWT middleware
router.use(authMiddleware);

router.patch('/:id', updateStop);
router.delete('/:id', deleteStop);

// Nested activity creation/attachment
router.post('/:stopId/activities', attachActivity);

export default router;
