import { Request, Response } from 'express';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { trips } from '../db/schema';

// Schema for trip input validation
const tripSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

const updateTripSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format').optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

/**
 * Creates a new trip for the authenticated user
 */
export const createTrip = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const parseResult = tripSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: parseResult.error.errors });
    }

    const { title, description, startDate, endDate } = parseResult.data;

    const [newTrip] = await db.insert(trips).values({
      userId,
      title,
      description,
      startDate,
      endDate,
    }).returning();

    return res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip: newTrip
    });
  } catch (error: any) {
    console.error('Create trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create trip', error: error.message });
  }
};

/**
 * Lists all trips belonging to the authenticated user
 */
export const listTrips = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userTrips = await db.select().from(trips).where(eq(trips.userId, userId));

    return res.status(200).json({
      success: true,
      trips: userTrips
    });
  } catch (error: any) {
    console.error('List trips error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve trips', error: error.message });
  }
};

/**
 * Retrieves detailed trip information by ID, including nested stops, activities, and itinerary logs
 */
export const getTrip = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    // Use Drizzle relational queries to load stops, activities, expenses, and itinerary items
    const trip = await db.query.trips.findFirst({
      where: (trips, { eq, and }) => and(eq(trips.id, id), eq(trips.userId, userId)),
      with: {
        stops: {
          orderBy: (stops, { asc }) => [asc(stops.stopOrder)],
          with: {
            activities: true,
          }
        },
        expenses: true,
        itineraryItems: {
          orderBy: (items, { asc }) => [asc(items.itineraryDate), asc(items.sortOrder)],
        }
      }
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    return res.status(200).json({
      success: true,
      trip
    });
  } catch (error: any) {
    console.error('Get trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve trip details', error: error.message });
  }
};

/**
 * Updates trip parameters
 */
export const updateTrip = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    const parseResult = updateTripSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: parseResult.error.errors });
    }

    const updatedFields = parseResult.data;

    const [updatedTrip] = await db.update(trips)
      .set({
        ...updatedFields,
        updatedAt: new Date()
      })
      .where(and(eq(trips.id, id), eq(trips.userId, userId)))
      .returning();

    if (!updatedTrip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
    }

    return res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      trip: updatedTrip
    });
  } catch (error: any) {
    console.error('Update trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update trip', error: error.message });
  }
};

/**
 * Deletes a trip (will cascade delete stops, itinerary, activities, and expenses at database level)
 */
export const deleteTrip = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    const [deletedTrip] = await db.delete(trips)
      .where(and(eq(trips.id, id), eq(trips.userId, userId)))
      .returning();

    if (!deletedTrip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
    }

    return res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
      trip: deletedTrip
    });
  } catch (error: any) {
    console.error('Delete trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete trip', error: error.message });
  }
};
