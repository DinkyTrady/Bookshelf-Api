import { Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import slugify from "slugify";

import { zValidator } from "#/middleware/validation";
import {
  createNewBook,
  deleteBook,
  getAllBooks,
  getBookBySlug,
  getDetailBook,
  updateBook,
} from "#/repository/book-repository";
import {
  bookInsertSchema,
  bookQuerySchema,
  bookSlugSchema,
  bookUpdateSchema,
} from "../types/book";

const books = new Hono().basePath("/books");

const createSlug = (title: string, isbn: string) => {
  return (
    slugify(title, {
      lower: true,
      strict: true,
    }) + `-${isbn}`
  );
};

books
  .get("/", zValidator("query", bookQuerySchema), async (c) => {
    try {
      const { limit, offset, title } = c.req.valid("query");

      const booksList = await getAllBooks(limit, offset - 1, title);

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
  .post("/", zValidator("json", bookInsertSchema), async (c) => {
    const data = c.req.valid("json");

    const bookSlug = createSlug(data.title, data.isbn);

    const newBook = await createNewBook(bookSlug, data);

    if (!newBook) {
      throw new HTTPException(500, {
        message: "Insert operations for books failed",
      });
    }

    return c.json(
      {
        success: true,
        messages: "Successfully create the new book",
        data: [newBook],
      },
      201,
    );
  })
  .get("/:slug", zValidator("param", bookSlugSchema), async (c: Context) => {
    try {
      const { slug: bookSlug } = c.req.valid("param");

      const book = await getDetailBook(bookSlug);

      if (!book) {
        return c.json(
          {
            success: false,
            messages: "No book found with the given slug",
            data: [],
          },
          404,
        );
      }

      return c.json({
        success: true,
        messages: "Book found from the database",
        data: [book],
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
  })
  .put(
    "/:slug",
    zValidator("param", bookSlugSchema),
    zValidator("json", bookUpdateSchema),
    async (c) => {
      const { slug: bookSlug } = c.req.valid("param");
      const data = c.req.valid("json");

      const book = await getBookBySlug(bookSlug);
      if (!book) {
        throw new HTTPException(404, {
          message: "Not found any books with the slug",
        });
      }

      const updatedBook = await updateBook(bookSlug, data);

      return c.json(
        {
          success: true,
          messages: "Successfully updated book data",
          data: [updatedBook],
        },
        200,
      );
    },
  )
  .delete("/:slug", zValidator("param", bookSlugSchema), async (c) => {
    const { slug: bookSlug } = c.req.valid("param");

    const book = await getBookBySlug(bookSlug);
    if (!book) {
      throw new HTTPException(404, {
        message: "Not found any books with the slug",
      });
    }

    const _deletedBook = await deleteBook(bookSlug);
    return c.json(
      { success: true, messages: "Successfully deleted book", data: [] },
      200,
    );
  });

export default books;
