ALTER TABLE "order_items" ALTER COLUMN "order_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "product_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_postal_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_country" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_slug_unique" UNIQUE("slug");