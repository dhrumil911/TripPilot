import { pgTable, uuid, text, timestamp, date, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { trips } from './trips';
import { activities } from './activities';
import { itineraryItems } from './itinerary-items';

export const tripStops = pgTable('trip_stops', {
  id: uuid('id').defaultRandom().primaryKey(),
  tripId: uuid('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  cityName: text('city_name').notNull(),
  country: text('country').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  stopOrder: integer('stop_order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tripIdIdx: index('trip_stops_trip_id_idx').on(table.tripId),
}));

export const tripStopsRelations = relations(tripStops, ({ one, many }) => ({
  trip: one(trips, {
    fields: [tripStops.tripId],
    references: [trips.id],
  }),
  activities: many(activities),
  itineraryItems: many(itineraryItems),
}));
