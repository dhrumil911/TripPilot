import { Router } from 'express';
import { getCityImage } from '../controllers/image.controller';

const router = Router();
router.get('/city', getCityImage);

export default router;