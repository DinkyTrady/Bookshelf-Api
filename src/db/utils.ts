import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  // Adding connection validation
  allowExitOnIdle: false,
});

// Add event listeners for connection issues
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// For better error handling
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

export const db = drizzle(pool, { schema, logger: true });

// Function to test the database connection
export const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Database connection successful");
    client.release();
    return true;
  } catch (err) {
    console.error("Database connection error:", err);
    return false;
  }
};
