// src/lib/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Database connection string from environment variable
const connectionString = process.env.DATABASE_URL;

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString,
});

// Create a Drizzle instance with the pool
export const db = drizzle(pool);
