import "dotenv/config";

import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });
