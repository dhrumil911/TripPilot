import { Request, Response } from 'express';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { trips, itineraryItems } from '../db/schema';

const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;

const createItinerarySchema = z.object({
  tripStopId: z.string().uuid('Invalid stop ID format'),
  activityId: z.string().uuid('Invalid activity ID format').nullable().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  itineraryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Itinerary date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(timeRegex, 'Start time must be in HH:MM or HH:MM:SS format').nullable().optional(),
  endTime: z.string().regex(timeRegex, 'End time must be in HH:MM or HH:MM:SS format').nullable().optional(),
  sortOrder: z.number().int('Sort order must be an integer'),
});

const updateItinerarySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  itineraryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Itinerary date must be in YYYY-MM-DD format').optional(),
  startTime: z.string().regex(timeRegex, 'Start time must be in HH:MM or HH:MM:SS format').nullable().optional(),
  endTime: z.string().regex(timeRegex, 'End time must be in HH:MM or HH:MM:SS format').nullable().optional(),
  sortOrder: z.number().int().optional(),
});

const reorderSchema = z.object({
  reorders: z.array(z.object({
    id: z.string().uuid('Invalid itinerary item ID format'),
    sortOrder: z.number().int()
  })).min(1, 'Reorder list cannot be empty')
});

/**
 * Creates a new itinerary item under a trip
 */
export const createItineraryItem = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { tripId } = req.params;

    // Verify trip ownership
    const [trip] = await db.select().from(trips).where(and(eq(trips.id, tripId), eq(trips.userId, userId))).limit(1);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
    }

    const parseResult = createItinerarySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: parseResult.error.errors });
    }

    const itemData = parseResult.data;

    const [newItem] = await db.insert(itineraryItems).values({
      tripId,
      tripStopId: itemData.tripStopId,
      activityId: itemData.activityId || null,
      title: itemData.title,
      description: itemData.description,
      itineraryDate: itemData.itineraryDate,
      startTime: itemData.startTime || null,
      endTime: itemData.endTime || null,
      sortOrder: itemData.sortOrder,
    }).returning();

    return res.status(201).json({
      success: true,
      message: 'Itinerary item created successfully',
      itineraryItem: newItem
    });
  } catch (error: any) {
    console.error('Create itinerary item error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create itinerary item', error: error.message });
  }
};

/**
 * Lists all itinerary items for a specific trip
 */
export const listItineraryItems = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { tripId } = req.params;

    // Verify trip ownership
    const [trip] = await db.select().from(trips).where(and(eq(trips.id, tripId), eq(trips.userId, userId))).limit(1);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
    }

    const items = await db.select().from(itineraryItems)
      .where(eq(itineraryItems.tripId, tripId))
      .orderBy(itineraryItems.itineraryDate, itineraryItems.sortOrder);

    return res.status(200).json({
      success: true,
      itineraryItems: items
    });
  } catch (error: any) {
    console.error('List itinerary items error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve itinerary items', error: error.message });
  }
};

/**
 * Reorders itinerary items within a day inside a database transaction
 */
export const reorderItineraryItems = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { tripId } = req.params;

    // Verify trip ownership
    const [trip] = await db.select().from(trips).where(and(eq(trips.id, tripId), eq(trips.userId, userId))).limit(1);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
    }

    const parseResult = reorderSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: parseResult.error.errors });
    }

    const { reorders } = parseResult.data;

    // Run bulk reordering update statements in a single transaction
    await db.transaction(async (tx) => {
      for (const item of reorders) {
        await tx.update(itineraryItems)
          .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
          .where(and(eq(itineraryItems.id, item.id), eq(itineraryItems.tripId, tripId)));
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Itinerary items reordered successfully'
    });
  } catch (error: any) {
    console.error('Reorder itinerary error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reorder itinerary items', error: error.message });
  }
};

/**
 * Updates a specific itinerary item
 */
export const updateItineraryItem = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    // Verify ownership by checking the parent trip userId
    const itemWithTrip = await db.query.itineraryItems.findFirst({
      where: (items, { eq }) => eq(items.id, id),
      with: {
        trip: true
      }
    });

    if (!itemWithTrip || itemWithTrip.trip.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Itinerary item not found or unauthorized' });
    }

    const parseResult = updateItinerarySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: parseResult.error.errors });
    }

    const updatedFields = parseResult.data;

    const [updatedItem] = await db.update(itineraryItems)
      .set({
        ...updatedFields,
        updatedAt: new Date()
      })
      .where(eq(itineraryItems.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: 'Itinerary item updated successfully',
      itineraryItem: updatedItem
    });
  } catch (error: any) {
    console.error('Update itinerary item error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update itinerary item', error: error.message });
  }
};

/**
 * Deletes a specific itinerary item
 */
export const deleteItineraryItem = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    // Verify ownership
    const itemWithTrip = await db.query.itineraryItems.findFirst({
      where: (items, { eq }) => eq(items.id, id),
      with: {
        trip: true
      }
    });

    if (!itemWithTrip || itemWithTrip.trip.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Itinerary item not found or unauthorized' });
    }

    const [deletedItem] = await db.delete(itineraryItems).where(eq(itineraryItems.id, id)).returning();

    return res.status(200).json({
      success: true,
      message: 'Itinerary item deleted successfully',
      itineraryItem: deletedItem
    });
  } catch (error: any) {
    console.error('Delete itinerary item error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete itinerary item', error: error.message });
  }
};
