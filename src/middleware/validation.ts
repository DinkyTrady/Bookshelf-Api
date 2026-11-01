import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import { HTTPException } from "hono/http-exception";
import * as z from "zod/v4";

export const zValidator = <
  T extends z.ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result, _c) => {
    if (!result.success) {
      throw new HTTPException(400, {
        message: "Validation Failed",
        cause: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          type: issue.code,
        })),
      });
    }
  });
