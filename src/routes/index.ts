import { Hono } from "hono";
import books from "./books";

const api = new Hono().basePath("/api");

api.route("/", books);

export default api;
