ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_token_expires" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_verification_token_unique" UNIQUE("verification_token");