import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    max: 20,
    idleTimeoutMillis: 30000,
    maxLifetimeSeconds: 3600,
  },
  logging: true,
});
