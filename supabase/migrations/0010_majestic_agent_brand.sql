ALTER TABLE "users" ADD COLUMN "detailsUpdated" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" date NOT NULL;