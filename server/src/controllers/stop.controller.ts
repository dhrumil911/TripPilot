import { Request, Response } from 'express';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { trips, tripStops } from '../db/schema';

const stopSchema = z.object({
  cityName: z.string().min(1, 'City name is required'),
  country: z.string().min(1, 'Country name is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
  stopOrder: z.number().int('Stop order must be an integer'),
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

const updateStopSchema = z.object({
  cityName: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format').optional(),
  stopOrder: z.number().int().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

const reorderSchema = z.object({
  reorders: z.array(z.object({
    id: z.string().uuid('Invalid stop ID format'),
    stopOrder: z.number().int()
  })).min(1, 'Reorder list cannot be empty')
});

/**
 * Creates a stop under a trip after verifying ownership
 */
export const createStop = async (req: Request, res: Response) => {
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

    const parseResult = stopSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: parseResult.error.errors });
    }

    const { cityName, country, startDate, endDate, stopOrder } = parseResult.data;

    const [newStop] = await db.insert(tripStops).values({
      tripId,
      cityName,
      country,
      startDate,
      endDate,
      stopOrder,
    }).returning();

    return res.status(201).json({
      success: true,
      message: 'Trip stop added successfully',
      stop: newStop
    });
  } catch (error: any) {
    console.error('Create stop error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create trip stop', error: error.message });
  }
};

/**
 * Reorders stops under a trip inside a database transaction
 */
export const reorderStops = async (req: Request, res: Response) => {
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

    // Bulk update stopOrder values in a single transaction
    await db.transaction(async (tx) => {
      for (const item of reorders) {
        await tx.update(tripStops)
          .set({ stopOrder: item.stopOrder, updatedAt: new Date() })
          .where(and(eq(tripStops.id, item.id), eq(tripStops.tripId, tripId)));
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Stops reordered successfully'
    });
  } catch (error: any) {
    console.error('Reorder stops error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reorder stops', error: error.message });
  }
};

/**
 * Updates a specific stop
 */
export const updateStop = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    // Load stop and its trip details to verify ownership
    const stopWithTrip = await db.query.tripStops.findFirst({
      where: (stops, { eq }) => eq(stops.id, id),
      with: {
        trip: true
      }
    });

    if (!stopWithTrip || stopWithTrip.trip.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Stop not found or unauthorized' });
    }

    const parseResult = updateStopSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: parseResult.error.errors });
    }

    const updatedFields = parseResult.data;

    const [updatedStop] = await db.update(tripStops)
      .set({
        ...updatedFields,
        updatedAt: new Date()
      })
      .where(eq(tripStops.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: 'Stop updated successfully',
      stop: updatedStop
    });
  } catch (error: any) {
    console.error('Update stop error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update stop', error: error.message });
  }
};

/**
 * Deletes a specific stop
 */
export const deleteStop = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    // Load stop and its trip details to verify ownership
    const stopWithTrip = await db.query.tripStops.findFirst({
      where: (stops, { eq }) => eq(stops.id, id),
      with: {
        trip: true
      }
    });

    if (!stopWithTrip || stopWithTrip.trip.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Stop not found or unauthorized' });
    }

    const [deletedStop] = await db.delete(tripStops).where(eq(tripStops.id, id)).returning();

    return res.status(200).json({
      success: true,
      message: 'Stop deleted successfully',
      stop: deletedStop
    });
  } catch (error: any) {
    console.error('Delete stop error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete stop', error: error.message });
  }
};
