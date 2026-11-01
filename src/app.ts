import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod/v4";

import { env } from "#/configs/env";
import { mapDbError } from "#/lib/db-error";
import { customLogger } from "#/middleware/logger";
import api from "#/routes";

const app = new Hono({ strict: false });

app.use("/*", customLogger());

app
  .route("/", api)
  .notFound((c) =>
    c.json({
      success: false,
      messages: `Not found route with given ${c.req.url}`,
    }),
  )
  .onError((err, c) => {
    if (err instanceof ZodError) {
      c.json(
        {
          success: false,
          message: "Validation Error",
          error: err.issues,
        },
        400,
      );
    }
    if (err instanceof HTTPException) {
      console.error(err.getResponse());
      return c.json(
        {
          success: false,
          message: err.message,
          ...(env.nodeEnv !== "production" ? { cause: err.cause } : {}),
        },
        err.status,
      );
    }

    const dbErr = mapDbError(err);
    if (dbErr) {
      console.error("[db]", {
        code: (err as unknown).code,
        extendedCode: (err as unknown).extendedCode,
        message: (err as unknown).messagee,
      });

      return c.json(
        {
          success: false,
          message: dbErr.message,
          code: dbErr.code,
          field: dbErr.field,
        },
        dbErr.status,
      );
    }

    throw new HTTPException(500, {
      message: "Internal Server Error",
      cause: { stack: err.stack, cause: err.cause, message: err.message },
    });
  });

export default app;
