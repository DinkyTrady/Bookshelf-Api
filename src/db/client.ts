import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "#/configs/env";
import { relations } from "#/db/schema";

export function createDatabase() {
  const client = createClient({ url: env.db });

  const db = drizzle({ client, relations });

  return { db, client };
}

export type Database = ReturnType<typeof createDatabase>["db"];
