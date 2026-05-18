import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function PATCH(req: Request) {
  try {
    const { id, captured, favorite } = await req.json();

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
      captured: await redis.hgetall("captured"),
      favorites: await redis.hgetall("favorites"),
    };

    return NextResponse.json(updated);
  } catch (err) {
    // 🔹 Siempre devolver algo, incluso si hay error
    return NextResponse.json({ error: "server error", details: String(err) }, { status: 500 });
  }
}
