import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import tripRoutes from './trip.routes';
import stopRoutes from './stop.routes';
import activityRoutes from './activity.routes';
import searchRoutes from './search.routes';
import itineraryRoutes from './itinerary.routes';
import expenseRoutes from './expense.routes';
import shareRoutes from './share.routes';

const apiRouter = Router();

// Hook up all feature routes
apiRouter.use(healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/user', userRoutes);
apiRouter.use('/trips', tripRoutes);
apiRouter.use('/stops', stopRoutes);
apiRouter.use('/activities', activityRoutes);
apiRouter.use('/search', searchRoutes);
apiRouter.use('/itineraries', itineraryRoutes);
apiRouter.use('/expenses', expenseRoutes);
apiRouter.use('/shared', shareRoutes);

export default apiRouter;
