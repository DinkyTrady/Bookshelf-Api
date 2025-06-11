import "dotenv/config";
import { db } from "./utils";
import { authorTable, bookTable, publisherTable } from "./schema";
import { randomUUIDv7 } from "bun";

async function main() {
  const publisher1: typeof publisherTable.$inferInsert = {
    displayId: randomUUIDv7(),
    name: "Bloomsbury",
  };

  await db.insert(publisherTable).values(publisher1);

  const author1: typeof authorTable.$inferInsert = {
    displayId: randomUUIDv7(),
    name: "J.K. Rowling",
  };

  await db.insert(authorTable).values(author1);

  const book1: typeof bookTable.$inferInsert = {
    displayId: randomUUIDv7(),
    authorId: author1.displayId,
    title: "Harry Potter and the Philosopher's Stone",
    summary: "A young wizard's journey begins",
    publisherId: publisher1.displayId,
    pageCount: 223,
    readedPage: 0,
    reading: true,
  };
  const book2: typeof bookTable.$inferInsert = {
    displayId: randomUUIDv7(),
    authorId: author1.displayId,
    title: "Harry Potter and the Chamber of Secrets",
    summary: "The second year at Hogwarts",
    publisherId: publisher1.displayId,
    pageCount: 251,
    readedPage: 100,
    reading: true,
  };

  await db.insert(bookTable).values(book1);
  await db.insert(bookTable).values(book2);

  console.log("Database seeded successfully!");
  console.table([{ publisher1 }, { author1 }, { book1, book2 }]);
}

await main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
