// src/app/api/collection/route.ts
import { Collection } from "@/types/collection";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const COLLECTION_PATH = path.join(process.cwd(), "data/collection.json");

async function getCollection(): Promise<Collection> {
  try {
    const data = await readFile(COLLECTION_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return { captured: {}, favorites: {} };
  }
}

async function updateCollection(updated: Collection) {
  return await writeFile(COLLECTION_PATH, JSON.stringify(updated, null, 2));
}

export async function GET() {
  const collection = await getCollection();
  return Response.json(collection);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, captured = undefined, favorite = undefined } = body;

  if (!id) {
    return Response.json({ error: "missing id" }, { status: 400 });
  }

  const collection = await getCollection();

  if (captured !== undefined) {
    collection.captured[id] = captured;
    if (!captured) delete collection.captured[id];
  }

  if (favorite !== undefined) {
    collection.favorites[id] = favorite;
    if (!favorite) delete collection.favorites[id];
  }

  await updateCollection(collection);

  return Response.json(collection);
}
