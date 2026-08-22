import { Request, Response } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { activities } from '../db/schema';

// Curated discovery catalog until cities become a persisted backend resource.
// Curated discovery catalog until cities become a persisted backend resource.
const CITY_CATALOG = [
  { id: 'c1', cityName: 'Udaipur', country: 'India', popularity: 'High', costIndex: 'Moderate' },
  { id: 'c2', cityName: 'Jaipur', country: 'India', popularity: 'High', costIndex: 'Moderate' },
  { id: 'c3', cityName: 'Delhi', country: 'India', popularity: 'High', costIndex: 'Moderate' },
  { id: 'c4', cityName: 'Kochi', country: 'India', popularity: 'Medium', costIndex: 'Moderate' },
  { id: 'c5', cityName: 'Mumbai', country: 'India', popularity: 'High', costIndex: 'Premium' },
  { id: 'c6', cityName: 'Ahmedabad', country: 'India', popularity: 'Medium', costIndex: 'Moderate' },
  { id: 'c7', cityName: 'Goa', country: 'India', popularity: 'High', costIndex: 'Premium' },
  { id: 'c8', cityName: 'Agra', country: 'India', popularity: 'High', costIndex: 'Moderate' },
  { id: 'c9', cityName: 'Varanasi', country: 'India', popularity: 'High', costIndex: 'Moderate' },
  { id: 'c10', cityName: 'Amritsar', country: 'India', popularity: 'High', costIndex: 'Moderate' },
  { id: 'c11', cityName: 'Jodhpur', country: 'India', popularity: 'High', costIndex: 'Moderate' },
  { id: 'c12', cityName: 'Jaisalmer', country: 'India', popularity: 'Medium', costIndex: 'Moderate' },
];

const CITY_RECOMMENDATIONS: Record<string, Array<{ id: string; name: string; description: string; category: string; estimatedCost: string; durationMinutes: number }>> = {
  c1: [
    { id: 'udaipur-lake-pichola', name: 'Lake Pichola boat ride', description: 'See Udaipur palaces from the water at golden hour.', category: 'sightseeing', estimatedCost: '800.00', durationMinutes: 120 },
    { id: 'udaipur-city-palace', name: 'City Palace museum', description: 'Walk through the royal history overlooking the lake.', category: 'culture', estimatedCost: '400.00', durationMinutes: 150 },
  ],
  c2: [
    { id: 'jaipur-amber-fort', name: 'Amber Fort', description: 'Explore the hilltop fort and its ornate courtyards.', category: 'culture', estimatedCost: '550.00', durationMinutes: 180 },
    { id: 'jaipur-hawa-mahal', name: 'Hawa Mahal', description: 'Visit Jaipur’s famous palace of windows in the old city.', category: 'sightseeing', estimatedCost: '200.00', durationMinutes: 90 },
    { id: 'jaipur-city-palace', name: 'City Palace', description: 'Discover royal galleries and courtyards in the heart of Jaipur.', category: 'culture', estimatedCost: '500.00', durationMinutes: 150 },
  ],
  c3: [{ id: 'delhi-old-city', name: 'Old Delhi food walk', description: 'Taste the lanes and kitchens around Chandni Chowk.', category: 'food', estimatedCost: '1200.00', durationMinutes: 180 }],
  c4: [{ id: 'kochi-fort', name: 'Fort Kochi heritage walk', description: 'Trace the layered history of Kochi on foot.', category: 'culture', estimatedCost: '600.00', durationMinutes: 120 }],
  c5: [{ id: 'mumbai-marine-drive', name: 'Marine Drive sunset', description: 'Take in the city lights along Mumbai’s waterfront.', category: 'sightseeing', estimatedCost: '0.00', durationMinutes: 90 }],
  c7: [{ id: 'goa-anjuna', name: 'Anjuna beach sunset', description: 'Slow down by the coast and catch Goa’s evening light.', category: 'sightseeing', estimatedCost: '0.00', durationMinutes: 120 }],
  c8: [
    { id: 'agra-taj-mahal', name: 'Taj Mahal sunrise tour', description: 'Watch the sunrise paint the marble white palace in pink hues.', category: 'sightseeing', estimatedCost: '1100.00', durationMinutes: 180 },
    { id: 'agra-fort', name: 'Agra Fort walk', description: 'Walk through the massive red sandstone walls enclosing royal quarters.', category: 'culture', estimatedCost: '600.00', durationMinutes: 120 },
  ],
  c9: [
    { id: 'varanasi-ganga-aarti', name: 'Ganges Ganga Aarti', description: 'Witness the grand spiritual fire ceremony of lights at Dashashwamedh Ghat.', category: 'culture', estimatedCost: '200.00', durationMinutes: 90 },
    { id: 'varanasi-sarnath', name: 'Sarnath ancient ruins', description: 'Explore where Lord Buddha gave his first sermon.', category: 'sightseeing', estimatedCost: '300.00', durationMinutes: 150 },
  ],
  c10: [
    { id: 'amritsar-golden-temple', name: 'Golden Temple visit', description: 'Join local devotees in prayer at the holy Harmandir Sahib.', category: 'culture', estimatedCost: '0.00', durationMinutes: 120 },
    { id: 'amritsar-wagah-border', name: 'Wagah Border parade', description: 'Attend the high-energy military flag lowering ceremony.', category: 'sightseeing', estimatedCost: '150.00', durationMinutes: 180 },
  ],
  c11: [
    { id: 'jodhpur-mehrangarh', name: 'Mehrangarh Fort tour', description: 'Explore one of India’s largest and best-preserved fort complexes.', category: 'culture', estimatedCost: '600.00', durationMinutes: 150 },
    { id: 'jodhpur-blue-streets', name: 'Blue City walk', description: 'Wander the narrow streets with bright blue houses surrounding the fort.', category: 'sightseeing', estimatedCost: '250.00', durationMinutes: 120 },
  ],
  c12: [
    { id: 'jaisalmer-safari', name: 'Sam Sand Dunes safari', description: 'Ride camels over sand dunes and enjoy desert camp music.', category: 'sightseeing', estimatedCost: '1500.00', durationMinutes: 240 },
    { id: 'jaisalmer-fort', name: 'Golden Jaisalmer Fort tour', description: 'Walk inside the living fort where thousands of residents reside.', category: 'culture', estimatedCost: '300.00', durationMinutes: 150 },
  ],
};

const MOCK_ACTIVITIES = [
  { id: 'a1', name: 'Amber Fort Elephant Ride', description: 'Enjoy spectacular views of the fort lake.', category: 'sightseeing', estimatedCost: '2000.00', durationMinutes: 120 },
  { id: 'a2', name: 'Taj Mahal Sunrise Tour', description: 'Explore the Taj Mahal with a local historian.', category: 'sightseeing', estimatedCost: '1100.00', durationMinutes: 180 },
  { id: 'a3', name: 'Ganges River Evening Prayer', description: 'Watch the sacred Ganga Aarti ceremony from a boat.', category: 'food', estimatedCost: '500.00', durationMinutes: 150 },
  { id: 'a4', name: 'Golden Temple Kitchen Service', description: 'Volunteer at the langar community kitchen serving thousands.', category: 'sightseeing', estimatedCost: '0.00', durationMinutes: 90 },
  { id: 'a5', name: 'Fort Kochi Spice Market Tour', description: 'Explore local historical warehouses and spice shops.', category: 'sightseeing', estimatedCost: '600.00', durationMinutes: 120 },
  { id: 'a6', name: 'Gateway of India Yacht Ride', description: 'Sail off the coast of South Mumbai.', category: 'food', estimatedCost: '1500.00', durationMinutes: 180 },
];

const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  estimatedCost: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Estimated cost must be a valid monetary decimal format (e.g. 10.00)'),
  durationMinutes: z.number().int().positive('Duration must be positive'),
});

/**
 * Searches the curated discovery catalog using case-insensitive partial matching.
 */
export const searchCities = async (req: Request, res: Response) => {
  try {
    const query = req.query.query ? String(req.query.query).trim().toLocaleLowerCase() : '';

    const results = CITY_CATALOG.filter(city =>
      city.cityName.toLocaleLowerCase().includes(query) ||
      city.country.toLocaleLowerCase().includes(query)
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

export const getCityRecommendations = async (req: Request, res: Response) => {
  const recommendations = CITY_RECOMMENDATIONS[req.params.cityId] || [];
  return res.status(200).json({ success: true, recommendations });
};

/**
 * Searches the in-memory mock activities directory
 */
export const searchActivities = async (req: Request, res: Response) => {
  try {
    const query = req.query.query ? String(req.query.query).trim().toLocaleLowerCase() : '';
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
