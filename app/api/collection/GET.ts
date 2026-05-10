// src/app/api/collection/GET.ts

import { Collection } from "@/types/collection";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const COLLECTION_PATH = path.join(process.cwd(), "src/data/collection.json");

async function ensureCollectionFile(): Promise<Collection> {
  try {
    const data = await readFile(COLLECTION_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    const initial: Collection = { captured: {}, favorites: {} };
    await writeFile(COLLECTION_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const forDaily = url.searchParams.get("daily") === "1";

  const collection = await ensureCollectionFile();

  if (forDaily) {
    const capturedIds = Object.keys(collection.captured);
    if (capturedIds.length === 0) {
      return Response.json({ dailyId: null });
    }

    const today = new Date();
    const seed = today.getFullYear() + today.getDate() * 31 + today.getMonth() * 365;
    const index = seed % capturedIds.length;

    const dailyId = capturedIds[index];
    return Response.json({ dailyId });
  }

  return Response.json(collection);
}