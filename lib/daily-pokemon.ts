// src/lib/daily-pokemon.ts
import { getCollection } from "@/lib/storage";

export function getDailyPokemonId(): string | null {
  const collection = getCollection();
  const capturedIds = Object.keys(collection.captured);

  if (capturedIds.length === 0) return null;

  // Aleatorio puro
  const index = Math.floor(Math.random() * capturedIds.length);
  return capturedIds[index] || null;
}
