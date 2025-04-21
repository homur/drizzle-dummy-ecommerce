ALTER TABLE "users" ADD COLUMN "reset_password_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_password_token_expires" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_reset_password_token_unique" UNIQUE("reset_password_token");