import { Context, Hono } from "hono";
import { db } from "../db/utils";
import { bookTable } from "../db/schema";
import { eq } from "drizzle-orm";

const books = new Hono().basePath("/books");

books
  .get("/", async (c) => {
    try {
      const booksList = await db.select().from(bookTable).orderBy(bookTable.id);
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
          messages: "Error fetching books from the database " + e,
        },
        500,
      );
    }
  })
  .get("/:id", async (c: Context) => {
    try {
      const bookId = c.req.param("id");
      const getBook = await db
        .select()
        .from(bookTable)
        .where(eq(bookTable.displayId, bookId));

      if (!getBook) {
        return c.json({
          success: false,
          messages: "No book found with the given ID",
        });
      }

      return c.json({
        success: true,
        messages: "Book found from the database",
        data: getBook[0],
      });
    } catch (e: unknown) {
      return c.json(
        {
          success: false,
          messages: "Error fetching book from the database " + e,
        },
        500,
      );
    }
  });

export default books;
