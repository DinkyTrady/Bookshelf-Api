import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { zValidator } from "#/middleware/validation";
import {
  createNewPublisher,
  deletePublisher,
  getAllPublisher,
  getPublisherById,
  updatePublisher,
} from "#/repository/publisher-repository";
import {
  PublisherInsert,
  publisherInsertSchmea,
  publisherParamIdSchema,
  publisherUpdateSchmea,
} from "#/types/publisher";

const publisher = new Hono().basePath("/publisher");

publisher
  .get("/", async (c) => {
    const publisher = await getAllPublisher();

    return c.json({
      success: true,
      messages: "Found publisher",
      data: publisher,
    });
  })
  .post("/", zValidator("json", publisherInsertSchmea), async (c) => {
    const data: PublisherInsert = c.req.valid("json");

    const publisher = await createNewPublisher(data);
    if (!publisher) {
      throw new HTTPException(500, {
        message: "Failed to create and retrive new publisher",
      });
    }

    return c.json(
      {
        success: true,
        messages: "Successfully add new publisher",
        data: publisher,
      },
      201,
    );
  })
  .get("/:id", zValidator("param", publisherParamIdSchema), async (c) => {
    const { id: publisherId } = c.req.valid("param");

    const data = await getPublisherById(publisherId);
    if (!data) {
      throw new HTTPException(404, {
        message: "Not found publisher with given id",
      });
    }

    return c.json(
      {
        success: true,
        message: `Found publisher with given id of ${publisherId}`,
        data: [data],
      },
      200,
    );
  })
  .put(
    "/:id",
    zValidator("param", publisherParamIdSchema),
    zValidator("json", publisherUpdateSchmea),
    async (c) => {
      const { id: publisherId } = c.req.valid("param");
      const publisherData = c.req.valid("json");

      const publisher = await updatePublisher(publisherId, publisherData);
      if (!publisher) {
        throw new HTTPException(500, {
          message: "Failed to update and retrive the new data of publisher",
        });
      }

      return c.json({
        success: true,
        messages: "Successfully update and retrive publisher",
        data: [publisher],
      });
    },
  )
  .delete("/:id", zValidator("param", publisherParamIdSchema), async (c) => {
    const { id: publisherId } = c.req.valid("param");

    const publisher = await deletePublisher(publisherId);

    if (!publisher) {
      throw new HTTPException(500, {
        message: "Possibly failed to delete data of publisher",
      });
    }

    return c.json(
      {
        success: true,
        messages: "Successfully delete publisher",
        data: [],
      },
      200,
    );
  });

export default publisher;
