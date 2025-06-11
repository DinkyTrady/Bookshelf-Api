import app from "./app";
import { testDbConnection } from "./db/utils";

const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

// Test database connection before starting the server
async function startServer() {
  // Test database connection
  const dbConnected = await testDbConnection();
  if (!dbConnected) {
    console.error(
      "Failed to connect to the database. Check your connection settings.",
    );
    process.exit(1);
  }

  // Start the server
  Bun.serve({
    hostname: hostname,
    port: port,
    fetch: app.fetch,
  });

  console.log(`Server running at http://${hostname}:${port}`);
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
