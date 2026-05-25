import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const key = `daily:${today}`;

    // Ver si ya existe para hoy
    let chosenId = await redis.get(key);

    if (!chosenId) {
      const captured = await redis.hgetall("captured");
      const ids = Object.keys(captured || {});

      if (ids.length === 0) {
        return NextResponse.json({ error: "No tienes Pokémon atrapados" }, { status: 404 });
      }

      const randomIndex = Math.floor(Math.random() * ids.length);
      chosenId = ids[randomIndex];

      // Guardar con expiración de 24h
      await redis.set(key, chosenId, { ex: 60 * 60 * 24 });
    }

    return NextResponse.json({ id: chosenId });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
