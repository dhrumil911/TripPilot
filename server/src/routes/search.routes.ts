import { Router } from 'express';
import { searchCities, searchActivities } from '../controllers/search.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Secure search queries using JWT middleware
router.use(authMiddleware);

router.get('/cities', searchCities);
router.get('/activities', searchActivities);

export default router;
