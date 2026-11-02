import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { env } from "./src/configs/env";

export default defineConfig({
  out: "./databases/",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.db,
  },
});
