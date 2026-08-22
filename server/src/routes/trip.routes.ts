import { Router } from 'express';
import { createTrip, listTrips, getTrip, updateTrip, deleteTrip } from '../controllers/trip.controller';
import { createStop, reorderStops } from '../controllers/stop.controller';
import { createItineraryItem, listItineraryItems, reorderItineraryItems } from '../controllers/itinerary.controller';
import { createExpense, listExpenses, getBudgetBreakdown } from '../controllers/expense.controller';
import { shareTrip, unshareTrip } from '../controllers/share.controller';
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

// Nested itinerary operations
router.post('/:tripId/itinerary', createItineraryItem);
router.get('/:tripId/itinerary', listItineraryItems);
router.put('/:tripId/itinerary/reorder', reorderItineraryItems);

// Nested expense operations
router.post('/:tripId/expenses', createExpense);
router.get('/:tripId/expenses', listExpenses);
router.get('/:tripId/budget-breakdown', getBudgetBreakdown);

// Nested sharing triggers
router.post('/:tripId/share', shareTrip);
router.post('/:tripId/unshare', unshareTrip);

export default router;
