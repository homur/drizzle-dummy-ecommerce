-- Add the slug column
ALTER TABLE "products" ADD COLUMN "slug" varchar(255);

-- Update existing products with slugs based on their names
UPDATE "products" SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'));

-- Add unique constraint and not null constraint after populating data
ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "products" ADD CONSTRAINT "products_slug_unique" UNIQUE ("slug"); 