ALTER TABLE "trips" ADD COLUMN "share_key" uuid;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_share_key_unique" UNIQUE("share_key");