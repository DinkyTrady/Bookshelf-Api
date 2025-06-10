import app from "./app";

const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

Bun.serve({
  hostname: hostname,
  port: port,
  fetch: app.fetch,
});

console.log(`Server running at http://${hostname}:${port}`);
