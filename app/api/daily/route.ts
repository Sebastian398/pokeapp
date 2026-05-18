import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  let id = await redis.get("dailyPokemon");

  if (!id) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    await redis.set("dailyPokemon", randomId, { ex: 86400 }); // expira en 1 día
    id = randomId;
  }

  return NextResponse.json({ id });
}
