import { eq } from "drizzle-orm";

import { createDatabase } from "#/db/client";
import { publisher } from "#/db/schema";
import {
  Publisher,
  PublisherInsert,
  PublisherUpdate,
} from "../types/publisher";

const { db } = createDatabase();
export async function getAllPublisher(): Promise<Publisher[]> {
  const data = await db.query.publisher.findMany();

  return data;
}

export async function getPublisherById(id: number): Promise<Publisher | null> {
  const data = await db.query.publisher.findFirst({ where: { id: id } });

  return data ?? null;
}

export async function createNewPublisher(
  publisherData: PublisherInsert,
): Promise<Publisher | null> {
  const [data] = await db
    .insert(publisher)
    .values({ ...publisherData })
    .returning();

  return data ?? null;
}

export async function updatePublisher(
  id: number,
  publisherData: PublisherUpdate,
): Promise<Publisher | null> {
  const [data] = await db
    .update(publisher)
    .set(publisherData)
    .where(eq(publisher.id, id))
    .returning();

  return data ?? null;
}

export async function deletePublisher(id: number): Promise<Publisher | null> {
  const [data] = await db
    .delete(publisher)
    .where(eq(publisher.id, id))
    .returning();

  return data ?? null;
}
