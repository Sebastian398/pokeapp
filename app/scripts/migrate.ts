import { redis } from "../../lib/redis";
import fs from "fs";

async function migrate() {
  // Leer tu JSON local
  const data = JSON.parse(fs.readFileSync("data/collection.json", "utf-8"));

  // Migrar capturados
  for (const id of Object.keys(data.captured)) {
    await redis.hset("captured", { [id]: true });
  }

  // Migrar favoritos
  for (const id of Object.keys(data.favorites)) {
    await redis.hset("favorites", { [id]: true });
  }

  console.log("✅ Migración completa a Redis");
}

migrate();
