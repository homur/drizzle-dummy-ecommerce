// src/lib/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";

// Load environment variables similarly to drizzle.config.ts
dotenv.config({ path: ".env.local" }); 
dotenv.config();

// Select the appropriate database URL
const connectionString =
  process.env.NODE_ENV === "production"
    ? process.env["DATABASE_URL_PROD"]
    : process.env["DATABASE_URL_LOCAL"];

// Check if the connection string is defined
if (!connectionString) {
  throw new Error(
    "Database connection string not defined. Set DATABASE_URL_PROD or DATABASE_URL_LOCAL.",
  );
}

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString,
});

// Create a Drizzle instance with the pool
export const db = drizzle(pool);
