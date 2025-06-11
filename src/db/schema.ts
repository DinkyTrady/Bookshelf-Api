import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Publisher table schema
 * Represents book publishers in the database
 */
export const publisherTable = pgTable("publisher", {
  id: serial().primaryKey(), // Auto-incrementing primary key
  displayId: varchar({ length: 255 }).notNull().unique(), // Public-facing unique identifier
  name: varchar({ length: 255 }).notNull(), // Publisher's name
});

/**
 * Publisher relations definition
 * Defines the one-to-many relationships between publishers and authors/books
 */
export const publisherRelations = relations(publisherTable, ({ many }) => ({
  authors: many(authorTable), // A publisher can have multiple authors
  books: many(bookTable), // A publisher can publish multiple books
}));

/**
 * Author table schema
 * Represents book authors in the database
 */
export const authorTable = pgTable("author", {
  id: serial().primaryKey(), // Auto-incrementing primary key
  displayId: varchar({ length: 255 }).notNull().unique(), // Public-facing unique identifier
  name: varchar({ length: 255 }).notNull(), // Author's name
});

/**
 * Relationship definition for the Author table
 * Defines the one-to-many relationship between authors and books
 */
export const authorRelations = relations(authorTable, ({ many }) => ({
  book: many(bookTable), // An author can have multiple books
}));

/**
 * Book table schema
 * Represents books in the database with their metadata
 */
export const bookTable = pgTable("book", {
  id: serial().primaryKey(), // Auto-incrementing primary key
  displayId: varchar({ length: 255 }).notNull().unique(), // Public-facing unique identifier
  authorId: varchar({ length: 255 }).notNull(), // Foreign key to author table
  title: varchar({ length: 255 }).notNull(), // Book title
  summary: text().notNull(), // Book summary/description
  publisherId: varchar({ length: 255 }).notNull(), // Foreign key to publisher table
  pageCount: integer().notNull(), // Total number of pages in the book
  readedPage: integer().notNull(), // Current page the user has read up to
  finished: boolean().notNull().default(false), // Whether the book has been completely read
  createdAt: date().notNull().defaultNow(), // Date when the book was added to the database
});

/**
 * Relationship definition for the Book table
 * Defines the many-to-one relationships between books and authors/publishers
 */
export const bookRelations = relations(bookTable, ({ one }) => ({
  author: one(authorTable, {
    fields: [bookTable.authorId], // Local field in the book table
    references: [authorTable.displayId], // Referenced field in the author table
  }),
  publisher: one(publisherTable, {
    fields: [bookTable.publisherId], // Local field in the book table
    references: [publisherTable.displayId], // Referenced field in the publisher table
  }),
}));
