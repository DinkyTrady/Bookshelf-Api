import { defineRelations } from "drizzle-orm";
import {
  index,
  int,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const publisher = sqliteTable(
  "publisher",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text({ length: 255 }).notNull(),
  },
  (t) => [index("publisher_name_idx").on(t.name)],
);

export const authors = sqliteTable(
  "author",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text({ length: 255 }).notNull(),
    biography: text().notNull().default(""),

    publisherId: integer("publisher_id")
      .notNull()
      .references(() => publisher.id, { onDelete: "restrict" }),
  },
  (t) => [index("author_name_idx").on(t.name)],
);

export const books = sqliteTable(
  "book",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    title: text({ length: 255 }).notNull(),
    slug: text().notNull(),
    isbn: text().notNull(),
    summary: text().notNull(),
    pageCount: int("page_count", { mode: "number" }).notNull(),
    readedPage: int("readed_page", { mode: "number" }).notNull(),
    reading: int({ mode: "boolean" }).notNull().default(false),
    finished: int({ mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),

    publisherId: integer("publisher_id")
      .notNull()
      .references(() => publisher.id, { onDelete: "restrict" }),
  },
  (t) => [
    uniqueIndex("book_isbn_idx").on(t.isbn),
    uniqueIndex("book_slug_idx").on(t.slug),
  ],
);

export const authorsToBooks = sqliteTable(
  "authors_to_books",
  {
    authorId: integer("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),
    bookId: integer("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.authorId, t.bookId] })],
);

export const relations = defineRelations(
  { publisher, authors, books, authorsToBooks },
  (r) => ({
    publisher: {
      books: r.many.books(),
      authors: r.many.authors({
        from: r.publisher.id,
        to: r.authors.publisherId,
      }),
    },
    author: {
      publisher: r.one.publisher({
        from: r.authors.publisherId,
        to: r.publisher.id,
      }),
      books: r.many.books({
        from: r.authors.id.through(r.authorsToBooks.authorId),
        to: r.books.id.through(r.authorsToBooks.bookId),
      }),
    },
    books: {
      publisher: r.one.publisher({
        from: r.books.publisherId,
        to: r.publisher.id,
      }),
      author: r.many.authors({
        from: r.books.id.through(r.authorsToBooks.bookId),
        to: r.authors.id.through(r.authorsToBooks.authorId),
      }),
    },
  }),
);
