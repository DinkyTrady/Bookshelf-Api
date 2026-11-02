import { Hono } from "hono";

import author from "#/routes/author";
import books from "#/routes/books";
import publisher from "#/routes/publisher";

const api = new Hono().basePath("/api");

api.route("/", books);
api.route("/", publisher);
api.route("/", author);

export default api;
