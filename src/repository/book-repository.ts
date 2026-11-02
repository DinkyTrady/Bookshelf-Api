import { eq } from "drizzle-orm";

import { createDatabase } from "#/db/client";
import { authorsToBooks, books } from "#/db/schema";
import { Book, BookInsert, BookUpdate } from "#/types/book";

const { db } = createDatabase();

export async function getAllBooks(
  limit: number,
  offset: number,
  title?: string,
): Promise<Book[] | []> {
  const safeLimit = Number(limit) || 20;
  const safeOffset = Number(offset) || 0;

  const data = await db.query.books.findMany({
    limit: safeLimit,
    offset: safeOffset,
    where: title !== undefined ? { title: { like: `%${title}%` } } : {},
    orderBy: { createdAt: "desc" },
  });

  return data ?? [];
}

export async function searchBookByTitle(title: string) {
  const data = await db.query.books.findMany({
    where: { title: { like: `%${title}%` } },
  });

  return data;
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const data = await db.query.books.findFirst({
    where: { slug: { eq: slug } },
  });

  return data ?? null;
}

export async function getBooksbySlug(slug: string): Promise<Book[] | []> {
  const data = db.query.books.findMany({ where: { slug } });

  return data ?? [];
}

export async function getDetailBook(slug: string) {
  const [book] = await db.query.books.findMany({
    where: { slug },
    with: { publisher: true, author: true },
  });

  return book;
}

export async function createNewBook(
  slug: string,
  book: BookInsert,
): Promise<Book | null> {
  try {
    const { authorIds, ...bookData } = book;
    const data = await db.transaction(async (tx) => {
      const [newBook] = await tx
        .insert(books)
        .values({ ...bookData, slug })
        .returning();

      await tx.insert(authorsToBooks).values(
        authorIds.map((aId) => ({
          authorId: aId,
          bookId: newBook.id,
        })),
      );

      return newBook;
    });

    return data ?? null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateBook(slug: string, bookData: BookUpdate) {
  try {
    const [data] = await db
      .update(books)
      .set(bookData)
      .where(eq(books.slug, slug))
      .returning();

    return data ?? null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteBook(slug: string) {
  try {
    const bookDeleted = await db.delete(books).where(eq(books.slug, slug));

    return bookDeleted;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
