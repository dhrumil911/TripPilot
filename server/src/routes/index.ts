import { Router } from 'express';
import healthRoutes from './health.routes';

const apiRouter = Router();

// Hook up all feature routes
apiRouter.use(healthRoutes);

export default apiRouter;
