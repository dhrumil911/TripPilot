import { Router } from 'express';
import { getPublicTrip, clonePublicTrip } from '../controllers/share.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public route to view a shared trip
router.get('/trips/:shareKey', getPublicTrip);

// Secure route to clone/copy a shared trip to the current user's profile
router.post('/trips/:shareKey/copy', authMiddleware, clonePublicTrip);

export default router;
