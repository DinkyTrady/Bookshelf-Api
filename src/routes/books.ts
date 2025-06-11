import { Context, Hono } from "hono";
import { db } from "../db/utils";
import { eq } from "drizzle-orm";

const books = new Hono().basePath("/books");

books
  .get("/", async (c) => {
    try {
      const booksList = await db.query.bookTable.findMany({
        orderBy: (book) => [book.id],
      });

      if (!booksList) {
        return c.json({ success: false, messages: "No books found" }, 404);
      }

      return c.json({
        success: true,
        messages: "Book found from the database",
        data: booksList,
      });
    } catch (e: unknown) {
      return c.json(
        {
          success: false,
          messages: "Error fetching books from the database",
          error: e instanceof Error ? e.message : String(e),
        },
        500,
      );
    }
  })
  .get("/:id", async (c: Context) => {
    try {
      const bookId = c.req.param("id");
      // Using more consistent query API
      const getBook = await db.query.bookTable.findFirst({
        where: (book) => eq(book.displayId, bookId),
      });

      if (!getBook) {
        return c.json({
          success: false,
          messages: "No book found with the given ID",
        });
      }

      return c.json({
        success: true,
        messages: "Book found from the database",
        data: getBook,
      });
    } catch (e: unknown) {
      return c.json(
        {
          success: false,
          messages: "Error fetching book from the database",
          error: e instanceof Error ? e.message : String(e),
        },
        500,
      );
    }
  });

export default books;
