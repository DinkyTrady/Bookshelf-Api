import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import { z } from "zod/v4";

import { books } from "#/db/schema";

export const bookSelectSchema = createSelectSchema(books);

export const bookInsertSchema = createInsertSchema(books)
  .omit({
    id: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    pageCount: z.int().positive(),
    readedPage: z.int().nonnegative(),
    authorIds: z
      .array(z.int().positive())
      .refine((items) => new Set(items).size === items.length, {
        message: "Items must be unique",
      }),
  });

export const bookUpdateSchema = createUpdateSchema(books)
  .omit({
    // id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    authorIds: z.array(z.int().positive()).optional(),
    readedPage: z.int().nonnegative().optional(),
  });

export const bookQuerySchema = z.object({
  title: z.coerce.string().optional(),
  limit: z.coerce.number().int().positive().default(20),
  offset: z.coerce.number().int().positive().default(1),
});

export const bookSlugSchema = z.object({
  slug: z.coerce.string().min(1),
});

export type Book = z.infer<typeof bookSelectSchema>;
export type BookInsert = z.infer<typeof bookInsertSchema>;
export type BookUpdate = z.infer<typeof bookUpdateSchema>;
