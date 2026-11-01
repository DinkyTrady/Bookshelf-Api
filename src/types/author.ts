import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import { z } from "zod/v4";

import { authors } from "#/db/schema";

export const authorSelectSchema = createSelectSchema(authors);
export const authorInsertSchema = createInsertSchema(authors, {
  publisherId: (schema) => schema.positive(),
});
export const authorUpdateSchema = createUpdateSchema(authors)
  .extend({ publisherId: z.int().positive() })
  .omit({ id: true });

export const authorIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type Author = z.infer<typeof authorSelectSchema>;
export type AuthorInsert = z.infer<typeof authorInsertSchema>;
export type AuthorUpdate = z.infer<typeof authorUpdateSchema>;
