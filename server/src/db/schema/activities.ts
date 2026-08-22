import { pgTable, uuid, text, timestamp, integer, decimal, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tripStops } from './trip-stops';
import { itineraryItems } from './itinerary-items';

export const activities = pgTable('activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  tripStopId: uuid('trip_stop_id').references(() => tripStops.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 2 }).notNull().default('0.00'),
  durationMinutes: integer('duration_minutes').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tripStopIdIdx: index('activities_trip_stop_id_idx').on(table.tripStopId),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  tripStop: one(tripStops, {
    fields: [activities.tripStopId],
    references: [tripStops.id],
  }),
  itineraryItems: many(itineraryItems),
}));
