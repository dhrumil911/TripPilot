import { Router } from 'express';
import { updateItineraryItem, deleteItineraryItem } from '../controllers/itinerary.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Secure all itinerary routes using JWT middleware
router.use(authMiddleware);

router.patch('/:id', updateItineraryItem);
router.delete('/:id', deleteItineraryItem);

export default router;
