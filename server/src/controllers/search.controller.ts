import { Request, Response } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { activities } from '../db/schema';

// Mock database lists for cities and activities search
const MOCK_CITIES = [
  { id: 'c1', cityName: 'Paris', country: 'France', popularity: 'High', costIndex: '$$$' },
  { id: 'c2', cityName: 'Tokyo', country: 'Japan', popularity: 'High', costIndex: '$$' },
  { id: 'c3', cityName: 'Rome', country: 'Italy', popularity: 'Medium', costIndex: '$$$' },
  { id: 'c4', cityName: 'New York', country: 'United States', popularity: 'High', costIndex: '$$$$' },
  { id: 'c5', cityName: 'Mumbai', country: 'India', popularity: 'Medium', costIndex: '$' },
  { id: 'c6', cityName: 'Cape Town', country: 'South Africa', popularity: 'Medium', costIndex: '$$' },
];

const MOCK_ACTIVITIES = [
  { id: 'a1', name: 'Eiffel Tower Sightseeing', description: 'Enjoy spectacular views from the Eiffel Tower.', category: 'sightseeing', estimatedCost: '45.00', durationMinutes: 120 },
  { id: 'a2', name: 'Louvre Museum Tour', description: 'Explore works of art, including the Mona Lisa.', category: 'museum', estimatedCost: '30.00', durationMinutes: 180 },
  { id: 'a3', name: 'Sushi Making Workshop', description: 'Learn how to make authentic sushi with a master chef.', category: 'food', estimatedCost: '75.00', durationMinutes: 150 },
  { id: 'a4', name: 'Shibuya Sky Observatory', description: 'Panoramic views over Shibuya Crossing.', category: 'sightseeing', estimatedCost: '20.00', durationMinutes: 90 },
  { id: 'a5', name: 'Colosseum Guided Tour', description: 'Walk through Roman history.', category: 'sightseeing', estimatedCost: '35.00', durationMinutes: 120 },
  { id: 'a6', name: 'Authentic Pasta Making Class', description: 'Make fresh handmade pasta in Rome.', category: 'food', estimatedCost: '60.00', durationMinutes: 180 },
];

const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  estimatedCost: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Estimated cost must be a valid monetary decimal format (e.g. 10.00)'),
  durationMinutes: z.number().int().positive('Duration must be positive'),
});

/**
 * Searches the in-memory mock cities directory
 */
export const searchCities = async (req: Request, res: Response) => {
  try {
    const query = req.query.query ? String(req.query.query).toLowerCase() : '';

    const results = MOCK_CITIES.filter(city => 
      city.cityName.toLowerCase().includes(query) || 
      city.country.toLowerCase().includes(query)
    );

    return res.status(200).json({
      success: true,
      cities: results
    });
  } catch (error: any) {
    console.error('Search cities error:', error);
    return res.status(500).json({ success: false, message: 'Failed to search cities', error: error.message });
  }
};

/**
 * Searches the in-memory mock activities directory
 */
export const searchActivities = async (req: Request, res: Response) => {
  try {
    const query = req.query.query ? String(req.query.query).toLowerCase() : '';
    const category = req.query.category ? String(req.query.category).toLowerCase() : '';

    let results = MOCK_ACTIVITIES;

    if (category) {
      results = results.filter(act => act.category.toLowerCase() === category);
    }

    if (query) {
      results = results.filter(act => 
        act.name.toLowerCase().includes(query) || 
        act.description.toLowerCase().includes(query)
      );
    }

    return res.status(200).json({
      success: true,
      activities: results
    });
  } catch (error: any) {
    console.error('Search activities error:', error);
    return res.status(500).json({ success: false, message: 'Failed to search activities', error: error.message });
  }
};

/**
 * Attaches/associates a selected activity to a specific trip stop
 */
export const attachActivity = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { stopId } = req.params;

    // Verify stop ownership by loading stop and trip records
    const stopWithTrip = await db.query.tripStops.findFirst({
      where: (stops, { eq }) => eq(stops.id, stopId),
      with: {
        trip: true
      }
    });

    if (!stopWithTrip || stopWithTrip.trip.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Stop not found or unauthorized' });
    }

    const parseResult = activitySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: parseResult.error.errors });
    }

    const { name, description, category, estimatedCost, durationMinutes } = parseResult.data;

    // Save concrete activity row in database
    const [newActivity] = await db.insert(activities).values({
      tripStopId: stopId,
      name,
      description,
      category,
      estimatedCost,
      durationMinutes,
    }).returning();

    return res.status(201).json({
      success: true,
      message: 'Activity attached successfully',
      activity: newActivity
    });
  } catch (error: any) {
    console.error('Attach activity error:', error);
    return res.status(500).json({ success: false, message: 'Failed to attach activity', error: error.message });
  }
};

/**
 * Deletes an activity association from the database
 */
export const removeActivity = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    // Verify activity ownership
    const activityWithStop = await db.query.activities.findFirst({
      where: (acts, { eq }) => eq(acts.id, id),
      with: {
        tripStop: {
          with: {
            trip: true
          }
        }
      }
    });

    if (!activityWithStop || activityWithStop.tripStop.trip.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Activity not found or unauthorized' });
    }

    const [deletedActivity] = await db.delete(activities)
      .where(eq(activities.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      message: 'Activity removed successfully',
      activity: deletedActivity
    });
  } catch (error: any) {
    console.error('Remove activity error:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove activity', error: error.message });
  }
};
