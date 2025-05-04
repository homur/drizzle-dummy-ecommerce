// drizzle.config.ts
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env["DATABASE_URL_PROD"]
    : process.env["DATABASE_URL_LOCAL"];

if (!databaseUrl) {
  throw new Error(
    "Database URL not set. Ensure DATABASE_URL_PROD or DATABASE_URL_LOCAL is defined.",
  );
}

export default {
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dbCredentials: {
    url: databaseUrl,
  },
} satisfies Config;
