// src/app/api/collection/route.ts
import { Collection } from "@/types/collection";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

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
  try {
    const captured = await redis.hgetall("captured") || {};
    const favorites = await redis.hgetall("favorites") || {};

    return NextResponse.json({
      captured,
      favorites,
    });
  } catch (err) {
    return NextResponse.json({
      captured: {},
      favorites: {},
      error: "server error",
      details: String(err),
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, captured, favorite } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "missing id" }, { status: 400 });
    }

    if (captured !== undefined) {
      if (captured) {
        await redis.hset("captured", { [id]: true });
      } else {
        await redis.hdel("captured", id);
      }
    }

    if (favorite !== undefined) {
      if (favorite) {
        await redis.hset("favorites", { [id]: true });
      } else {
        await redis.hdel("favorites", id);
      }
    }

    const updated = {
      captured: await redis.hgetall("captured") || {},
      favorites: await redis.hgetall("favorites") || {},
    };

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: "server error", details: String(err) },
      { status: 500 }
    );
  }
}
