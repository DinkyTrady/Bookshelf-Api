import { eq } from "drizzle-orm";

import { createDatabase } from "#/db/client";
import { authors } from "#/db/schema";
import { Author, AuthorInsert, AuthorUpdate } from "#/types/author";

const { db } = createDatabase();

export async function getAuthors(): Promise<Author[] | []> {
  const data = await db.query.authors.findMany();

  return data ?? [];
}

export async function getAuthorById(id: number): Promise<Author | null> {
  const data = await db.query.authors.findFirst({ where: { id: id } });

  return data ?? null;
}

export async function createNewAuthor(
  authorData: AuthorInsert,
): Promise<Author | null> {
  const [data] = await db
    .insert(authors)
    .values({ ...authorData })
    .returning();

  return data ?? null;
}

export async function getAuthorsByid(aId: number[]): Promise<Author[]> {
  const data: Author[] = await db.query.authors.findMany({
    where: { id: { arrayContains: aId } },
  });

  return data;
}

export async function updateAuthor(
  authorId: number,
  authorData: AuthorUpdate,
): Promise<Author | null> {
  const [data] = await db
    .update(authors)
    .set({ ...authorData })
    .where(eq(authors.id, authorId))
    .returning();

  return data ?? null;
}
