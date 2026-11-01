import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import { z } from "zod/v4";

import { publisher } from "#/db/schema";

export const publisherSelectSchema = createSelectSchema(publisher);
export const publisherInsertSchmea = createInsertSchema(publisher);
export const publisherUpdateSchmea = createUpdateSchema(publisher);

export const publisherParamIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type Publisher = z.infer<typeof publisherSelectSchema>;
export type PublisherInsert = z.infer<typeof publisherInsertSchmea>;
export type PublisherUpdate = z.infer<typeof publisherUpdateSchmea>;
