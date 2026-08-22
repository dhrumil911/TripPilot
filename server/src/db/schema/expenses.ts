import { pgTable, uuid, text, timestamp, decimal, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { trips } from './trips';

export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  tripId: uuid('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  category: text('category').notNull(), // transport, stay, activity, meal, other
  description: text('description'),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tripIdIdx: index('expenses_trip_id_idx').on(table.tripId),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  trip: one(trips, {
    fields: [expenses.tripId],
    references: [trips.id],
  }),
}));
