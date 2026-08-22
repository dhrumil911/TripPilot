import { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const [user] = await db.select({ isAdmin: users.isAdmin }).from(users).where(eq(users.id, userId)).limit(1);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
    next();
  } catch (error: any) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ success: false, message: 'Authorization check failed' });
  }
};
