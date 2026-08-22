import { Request, Response } from 'express';
import { sql, count, sum, desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { users, trips, tripStops, activities, expenses } from '../db/schema';

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const [{ count: totalUsers }] = await db.select({ count: count() }).from(users);
    const [{ count: totalTrips }] = await db.select({ count: count() }).from(trips);
    const [{ count: totalStops }] = await db.select({ count: count() }).from(tripStops);
    
    const [{ total }] = await db.select({ total: sum(expenses.amount) }).from(expenses);
    const totalExpenses = total || '0';

    const topCities = await db.select({
      cityName: tripStops.cityName,
      country: tripStops.country,
      stopCount: count()
    }).from(tripStops)
    .groupBy(tripStops.cityName, tripStops.country)
    .orderBy(desc(count()))
    .limit(5);

    const topActivities = await db.select({
      name: activities.name,
      category: activities.category,
      usageCount: count()
    }).from(activities)
    .groupBy(activities.name, activities.category)
    .orderBy(desc(count()))
    .limit(5);

    return res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalTrips,
        totalStops,
        totalExpenses,
        topCities,
        topActivities
      }
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve analytics' });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, message: 'Database connection is not available' });
    }

    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt
    }).from(users).orderBy(desc(users.createdAt));

    const tripCounts = await db.select({
      userId: trips.userId,
      tripCount: count()
    }).from(trips).groupBy(trips.userId);

    const usersWithTrips = allUsers.map(user => {
      const tripCountObj = tripCounts.find(t => t.userId === user.id);
      return {
        ...user,
        tripCount: tripCountObj ? tripCountObj.tripCount : 0
      };
    });

    return res.status(200).json({ success: true, users: usersWithTrips });
  } catch (error: any) {
    console.error('List users error:', error);
    return res.status(500).json({ success: false, message: 'Failed to list users' });
  }
};
