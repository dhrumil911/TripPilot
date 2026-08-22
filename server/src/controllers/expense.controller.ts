import { Request, Response } from 'express';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { trips, expenses } from '../db/schema';

const expenseSchema = z.object({
  category: z.enum(['transport', 'stay', 'activity', 'meal', 'other'], {
    errorMap: () => ({ message: 'Category must be one of: transport, stay, activity, meal, other' })
  }),
  description: z.string().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid monetary decimal format (e.g. 99.50)'),
  currency: z.string().min(1, 'Currency is required').default('USD'),
});

/**
 * Logs a new expense under a trip
 */
export const createExpense = async (req: Request, res: Response) => {
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

    const parseResult = expenseSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: parseResult.error.errors });
    }

    const { category, description, amount, currency } = parseResult.data;

    const [newExpense] = await db.insert(expenses).values({
      tripId,
      category,
      description,
      amount,
      currency,
    }).returning();

    return res.status(201).json({
      success: true,
      message: 'Expense logged successfully',
      expense: newExpense
    });
  } catch (error: any) {
    console.error('Create expense error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create expense', error: error.message });
  }
};

/**
 * Lists all expenses logged under a specific trip
 */
export const listExpenses = async (req: Request, res: Response) => {
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

    const tripExpenses = await db.select().from(expenses).where(eq(expenses.tripId, tripId));

    return res.status(200).json({
      success: true,
      expenses: tripExpenses
    });
  } catch (error: any) {
    console.error('List expenses error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve expenses', error: error.message });
  }
};

/**
 * Deletes a specific expense record
 */
export const deleteExpense = async (req: Request, res: Response) => {
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
    const expenseWithTrip = await db.query.expenses.findFirst({
      where: (exps, { eq }) => eq(exps.id, id),
      with: {
        trip: true
      }
    });

    if (!expenseWithTrip || expenseWithTrip.trip.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Expense record not found or unauthorized' });
    }

    const [deletedExpense] = await db.delete(expenses).where(eq(expenses.id, id)).returning();

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      expense: deletedExpense
    });
  } catch (error: any) {
    console.error('Delete expense error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete expense', error: error.message });
  }
};

/**
 * Calculates budget breakdowns and cost splits by categories
 */
export const getBudgetBreakdown = async (req: Request, res: Response) => {
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

    // Fetch all expenses
    const tripExpenses = await db.select().from(expenses).where(eq(expenses.tripId, tripId));

    // Calculate sum aggregates grouped by category
    const categoryTotals: Record<string, number> = {
      transport: 0,
      stay: 0,
      activity: 0,
      meal: 0,
      other: 0,
    };

    let totalSpend = 0;

    tripExpenses.forEach((exp) => {
      const amountNum = parseFloat(exp.amount);
      if (!isNaN(amountNum)) {
        totalSpend += amountNum;
        if (exp.category in categoryTotals) {
          categoryTotals[exp.category] += amountNum;
        } else {
          categoryTotals.other += amountNum;
        }
      }
    });

    // Calculate trip duration in days to find average spend
    const startDateObj = new Date(trip.startDate);
    const endDateObj = new Date(trip.endDate);
    const timeDiff = Math.abs(endDateObj.getTime() - startDateObj.getTime());
    const durationDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    const averageCostPerDay = durationDays > 0 ? (totalSpend / durationDays) : totalSpend;

    return res.status(200).json({
      success: true,
      budgetBreakdown: {
        tripId,
        totalSpend: totalSpend.toFixed(2),
        durationDays,
        averageCostPerDay: averageCostPerDay.toFixed(2),
        currency: tripExpenses[0]?.currency || 'USD',
        categories: {
          transport: categoryTotals.transport.toFixed(2),
          stay: categoryTotals.stay.toFixed(2),
          activity: categoryTotals.activity.toFixed(2),
          meal: categoryTotals.meal.toFixed(2),
          other: categoryTotals.other.toFixed(2),
        }
      }
    });
  } catch (error: any) {
    console.error('Budget breakdown error:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate budget breakdown', error: error.message });
  }
};
