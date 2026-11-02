import app from "#/app";
import { env } from "#/configs/env";
import { createDatabase } from "#/db/client";

// Test database connection before starting the server
function startServer() {
  // Test database connection
  const db = createDatabase();
  if (db.client.closed) {
    console.error(
      "Failed to connect to the database. Check your connection settings.",
    );
    process.exit(1);
  }

  // Start the server
  Bun.serve({
    hostname: env.host,
    port: env.port,
    fetch: app.fetch,
  });

  console.log(`Server running at http://${env.host}:${env.port}`);
}

startServer();
