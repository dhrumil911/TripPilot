import { Router } from 'express';
import { createTrip, listTrips, getTrip, updateTrip, deleteTrip } from '../controllers/trip.controller';
import { createStop, reorderStops } from '../controllers/stop.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Secure all trip routes using JWT middleware
router.use(authMiddleware);

router.post('/', createTrip);
router.get('/', listTrips);
router.get('/:id', getTrip);
router.patch('/:id', updateTrip);
router.delete('/:id', deleteTrip);

// Nested stops operations
router.post('/:tripId/stops', createStop);
router.put('/:tripId/stops/reorder', reorderStops);

export default router;
