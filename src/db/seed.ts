import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import slugify from "slugify";

import * as schema from "#/db/schema";

dotenv.config();

if (!process.env.DB_FILE_NAME) {
  throw new Error("DB_FILE_NAME environment variable is not defined.");
}

const db = drizzle(process.env.DB_FILE_NAME, { relations: schema.relations });

const createSlug = (title: string, isbn: string): string => {
  return slugify(title, { lower: true, strict: true }) + "-" + isbn;
};

async function seed() {
  console.log("🌱 Starting database seeding...");

  await db.transaction(async (tx) => {
    // Delete in reverse dependency order.
    await tx.delete(schema.authorsToBooks);
    await tx.delete(schema.books);
    await tx.delete(schema.authors);
    await tx.delete(schema.publisher);

    // 1. Publishers
    const insertedPublishers = await tx
      .insert(schema.publisher)
      .values([
        {
          name: "O'Reilly Media",
        },
        {
          name: "Manning Publications",
        },
      ])
      .returning({ id: schema.publisher.id });

    const [oreilly, manning] = insertedPublishers;

    if (!oreilly || !manning) {
      throw new Error("Failed to insert publishers.");
    }

    // 2. Authors
    const insertedAuthors = await tx
      .insert(schema.authors)
      .values([
        {
          name: "Kyle Simpson",
          biography: "Author of the You Don't Know JS series.",
          publisherId: oreilly.id,
        },
        {
          name: "Dan Abramov",
          biography: "Co-creator of Redux and React core team contributor.",
          publisherId: oreilly.id,
        },
        {
          name: "Alex Xu",
          biography: "Software engineer and author of System Design Interview.",
          publisherId: manning.id,
        },
      ])
      .returning({ id: schema.authors.id });

    const [kyle, dan, alex] = insertedAuthors;

    if (!kyle || !dan || !alex) {
      throw new Error("Failed to insert authors.");
    }

    // 3. Books
    const book1Title = "You Don't Know JS: Scope & Closures";
    const book1Isbn = "9781491904152";

    const book2Title = "React Deep Dive";
    const book2Isbn = "9789790000002";

    const book3Title = "System Design Interview – An insider's guide";
    const book3Isbn = "9781736049111";

    const insertedBooks = await tx
      .insert(schema.books)
      .values([
        {
          title: book1Title,
          isbn: book1Isbn,
          slug: createSlug(book1Title, book1Isbn),
          summary: "A deep dive into JavaScript scope, closures, and hoisting.",
          pageCount: 278,
          readedPage: 278,
          reading: false,
          finished: true,
          publisherId: oreilly.id,
        },
        {
          title: book2Title,
          isbn: book2Isbn,
          slug: createSlug(book2Title, book2Isbn),
          summary: "Understanding the internals of React architecture.",
          pageCount: 350,
          readedPage: 150,
          reading: true,
          finished: false,
          publisherId: oreilly.id,
        },
        {
          title: book3Title,
          isbn: book3Isbn,
          slug: createSlug(book3Title, book3Isbn),
          summary:
            "A practical guide to scaling systems for technical interviews.",
          pageCount: 312,
          readedPage: 312,
          reading: false,
          finished: true,
          publisherId: manning.id,
        },
      ])
      .returning({ id: schema.books.id });

    const [scopeBook, reactBook, systemDesignBook] = insertedBooks;

    if (!scopeBook || !reactBook || !systemDesignBook) {
      throw new Error("Failed to insert books.");
    }

    // 4. Author-book relationships
    await tx.insert(schema.authorsToBooks).values([
      { authorId: kyle.id, bookId: scopeBook.id },
      { authorId: dan.id, bookId: reactBook.id },
      { authorId: alex.id, bookId: systemDesignBook.id },
    ]);
  });

  console.log("Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Error during seeding:", err);
  process.exitCode = 1;
});
