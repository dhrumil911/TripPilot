import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

/**
 * Retrieves the currently authenticated user's profile details.
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'Database connection is not available. Please configure DATABASE_URL.'
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User ID not found in request context'
      });
    }

    // Query user information by ID
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      profile: user
    });
  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
