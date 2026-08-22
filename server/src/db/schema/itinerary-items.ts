import { pgTable, uuid, text, timestamp, date, time, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { trips } from './trips';
import { tripStops } from './trip-stops';
import { activities } from './activities';

export const itineraryItems = pgTable('itinerary_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  tripId: uuid('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  tripStopId: uuid('trip_stop_id').references(() => tripStops.id, { onDelete: 'cascade' }).notNull(),
  activityId: uuid('activity_id').references(() => activities.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description'),
  itineraryDate: date('itinerary_date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  sortOrder: integer('sort_order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tripIdIdx: index('itinerary_items_trip_id_idx').on(table.tripId),
  tripStopIdIdx: index('itinerary_items_trip_stop_id_idx').on(table.tripStopId),
}));

export const itineraryItemsRelations = relations(itineraryItems, ({ one }) => ({
  trip: one(trips, {
    fields: [itineraryItems.tripId],
    references: [trips.id],
  }),
  tripStop: one(tripStops, {
    fields: [itineraryItems.tripStopId],
    references: [tripStops.id],
  }),
  activity: one(activities, {
    fields: [itineraryItems.activityId],
    references: [activities.id],
  }),
}));
