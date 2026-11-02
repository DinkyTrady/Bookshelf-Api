import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { zValidator } from "#/middleware/validation";
import {
  createNewAuthor,
  getAuthorById,
  getAuthors,
  updateAuthor,
} from "#/repository/author-repository";
import { getPublisherById } from "#/repository/publisher-repository";
import {
  authorIdSchema,
  AuthorInsert,
  authorInsertSchema,
  AuthorUpdate,
  authorUpdateSchema,
} from "#/types/author";

const author = new Hono().basePath("author");

author
  .get("/", async (c) => {
    const authors = await getAuthors();

    if (!authors) {
      return c.json(
        { success: false, messages: "Not found any author", data: authors },
        404,
      );
    }

    return c.json(
      { success: true, messages: "Found all the authors data", data: authors },
      200,
    );
  })
  .get("/:id", zValidator("param", authorIdSchema), async (c) => {
    const { id: authorId } = c.req.valid("param");

    const author = await getAuthorById(authorId);

    if (!author) {
      throw new HTTPException(404, {
        message: `Not found any author with given id ${authorId}`,
      });
    }

    return c.json({
      success: true,
      messages: `Found author data with id ${authorId}`,
      data: [author],
    });
  })
  .post("/", zValidator("json", authorInsertSchema), async (c) => {
    const data: AuthorInsert = c.req.valid("json");

    const publisher = await getPublisherById(data.publisherId);
    if (!publisher) {
      throw new HTTPException(400, {
        message: `The publisher is not exist with id ${data.publisherId}`,
      });
    }

    const author = await createNewAuthor(data);

    return c.json(
      {
        success: true,
        messages: "Success fully input an new Author data",
        data: author,
      },
      201,
    );
  })
  .put(
    "/:id",
    zValidator("param", authorIdSchema),
    zValidator("json", authorUpdateSchema),
    async (c) => {
      const { id: authorId } = c.req.valid("param");
      const data: AuthorUpdate = c.req.valid("json");

      const publisher = await getPublisherById(data.publisherId);
      if (!publisher) {
        throw new HTTPException(404, {
          message: `Not found any publisher with given id ${data.publisherId}`,
        });
      }

      const author = await updateAuthor(authorId, data);
      if (!author) {
        throw new HTTPException(404, {
          message: "Failed to retrive author new data",
        });
      }

      return c.json({
        success: true,
        messages: "Successfully update the author data",
        data: author,
      });
    },
  );

export default author;
