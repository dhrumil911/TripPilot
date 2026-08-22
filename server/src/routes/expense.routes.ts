import { Router } from 'express';
import { deleteExpense } from '../controllers/expense.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Secure all expense routes using JWT middleware
router.use(authMiddleware);

router.delete('/:id', deleteExpense);

export default router;
