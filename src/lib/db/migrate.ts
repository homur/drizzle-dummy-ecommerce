// src/lib/db/migrate.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const main = async () => {
  const databaseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URL_PROD
      : process.env.DATABASE_URL_LOCAL;

  if (!databaseUrl) {
    console.error(
      "Migration Error: Database URL not set. Ensure DATABASE_URL_PROD or DATABASE_URL_LOCAL is defined in your .env file.",
    );
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  const db = drizzle(pool);

  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "src/lib/db/migrations" });

  console.log("Migrations completed successfully!");

  await pool.end();
};

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
