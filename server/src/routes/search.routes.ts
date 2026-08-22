import { Router } from 'express';
import { searchCities, searchActivities, getCityRecommendations } from '../controllers/search.controller';

const router = Router();

router.get('/cities', searchCities);
router.get('/cities/:cityId/recommendations', getCityRecommendations);
router.get('/activities', searchActivities);

export default router;
