import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../db';
import { trips, tripStops, activities, itineraryItems, expenses } from '../db/schema';

/**
 * Activates public sharing on a trip and generates a unique share key
 */
export const shareTrip = async (req: Request, res: Response) => {
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
    const [trip] = await db.select().from(trips).where(eq(trips.id, tripId)).limit(1);
    if (!trip || trip.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
    }

    // Generate share key if not already defined
    const shareKey = trip.shareKey || randomUUID();

    if (!trip.shareKey) {
      await db.update(trips)
        .set({ shareKey, updatedAt: new Date() })
        .where(eq(trips.id, tripId));
    }

    return res.status(200).json({
      success: true,
      message: 'Trip shared successfully',
      shareKey,
      publicUrl: `/api/shared/trips/${shareKey}`
    });
  } catch (error: any) {
    console.error('Share trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to share trip', error: error.message });
  }
};

/**
 * Deactivates public sharing on a trip
 */
export const unshareTrip = async (req: Request, res: Response) => {
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
    const [trip] = await db.select().from(trips).where(eq(trips.id, tripId)).limit(1);
    if (!trip || trip.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
    }

    await db.update(trips)
      .set({ shareKey: null, updatedAt: new Date() })
      .where(eq(trips.id, tripId));

    return res.status(200).json({
      success: true,
      message: 'Trip unshared successfully'
    });
  } catch (error: any) {
    console.error('Unshare trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to unshare trip', error: error.message });
  }
};

/**
 * Retrieves read-only details of a shared trip publicly (does not require auth)
 */
export const getPublicTrip = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const { shareKey } = req.params;

    // Retrieve public trip with nested Stops, Activities, and Timeline
    const trip = await db.query.trips.findFirst({
      where: (trips, { eq }) => eq(trips.shareKey, shareKey),
      with: {
        stops: {
          orderBy: (stops, { asc }) => [asc(stops.stopOrder)],
          with: {
            activities: true
          }
        },
        itineraryItems: {
          orderBy: (items, { asc }) => [asc(items.itineraryDate), asc(items.sortOrder)],
          with: {
            activity: true
          }
        },
        expenses: true
      }
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Shared trip not found' });
    }

    return res.status(200).json({
      success: true,
      trip: {
        id: trip.id,
        title: trip.title,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        stops: trip.stops,
        itineraryItems: trip.itineraryItems,
        expenses: trip.expenses
      }
    });
  } catch (error: any) {
    console.error('Get public trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve shared trip', error: error.message });
  }
};

/**
 * Performs a deep copy/cloning of a shared trip into the authenticated user's dashboard
 */
export const clonePublicTrip = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { shareKey } = req.params;

    // Load full relational shared trip
    const sharedTrip = await db.query.trips.findFirst({
      where: (trips, { eq }) => eq(trips.shareKey, shareKey),
      with: {
        stops: {
          with: {
            activities: true
          }
        },
        itineraryItems: true,
        expenses: true
      }
    });

    if (!sharedTrip) {
      return res.status(404).json({ success: false, message: 'Shared trip not found' });
    }

    // Execute deep copy inside a database transaction
    const clonedTrip = await db.transaction(async (tx) => {
      // 1. Clone trip parent
      const [newTrip] = await tx.insert(trips).values({
        userId,
        title: `Copy of ${sharedTrip.title}`,
        description: sharedTrip.description,
        startDate: sharedTrip.startDate,
        endDate: sharedTrip.endDate,
      }).returning();

      // Mappings to track relational reference updates
      const stopIdMapping: Record<string, string> = {};
      const activityIdMapping: Record<string, string> = {};

      // 2. Clone Stops and nested Activities
      for (const stop of sharedTrip.stops) {
        const [newStop] = await tx.insert(tripStops).values({
          tripId: newTrip.id,
          cityName: stop.cityName,
          country: stop.country,
          startDate: stop.startDate,
          endDate: stop.endDate,
          stopOrder: stop.stopOrder,
        }).returning();

        stopIdMapping[stop.id] = newStop.id;

        for (const act of stop.activities) {
          const [newAct] = await tx.insert(activities).values({
            tripStopId: newStop.id,
            name: act.name,
            description: act.description,
            category: act.category,
            estimatedCost: act.estimatedCost,
            durationMinutes: act.durationMinutes,
          }).returning();

          activityIdMapping[act.id] = newAct.id;
        }
      }

      // 3. Clone Itinerary Items with mapped references
      for (const item of sharedTrip.itineraryItems) {
        const newStopId = stopIdMapping[item.tripStopId];
        const newActId = item.activityId ? activityIdMapping[item.activityId] : null;

        if (newStopId) {
          await tx.insert(itineraryItems).values({
            tripId: newTrip.id,
            tripStopId: newStopId,
            activityId: newActId,
            title: item.title,
            description: item.description,
            itineraryDate: item.itineraryDate,
            startTime: item.startTime,
            endTime: item.endTime,
            sortOrder: item.sortOrder,
          });
        }
      }

      // 4. Clone Expenses
      for (const exp of sharedTrip.expenses) {
        await tx.insert(expenses).values({
          tripId: newTrip.id,
          category: exp.category,
          description: exp.description,
          amount: exp.amount,
          currency: exp.currency,
        });
      }

      return newTrip;
    });

    return res.status(201).json({
      success: true,
      message: 'Trip cloned successfully',
      trip: clonedTrip
    });
  } catch (error: any) {
    console.error('Clone trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to clone trip', error: error.message });
  }
};
