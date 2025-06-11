import { Hono } from "hono";
import api from "./routes";
import { customLogger } from "./middleware/logger";

const app = new Hono();

app.use("/api/*", customLogger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/", api);

export default app;
