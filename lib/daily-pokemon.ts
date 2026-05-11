import { getCollection } from "@/lib/storage";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "collection.json");

export function getDailyPokemonId(): string | null {
  const collection = getCollection();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Si ya existe un daily y la fecha coincide, devolverlo
  if (collection.daily && collection.daily.date === today) {
    return collection.daily.id;
  }

  // Si no hay capturados, no se puede elegir
  const capturedIds = Object.keys(collection.captured);
  if (capturedIds.length === 0) return null;

  // Elegir aleatorio
  const index = Math.floor(Math.random() * capturedIds.length);
  const chosenId = capturedIds[index];

  // Guardar en JSON
  collection.daily = { id: chosenId, date: today };
  fs.writeFileSync(filePath, JSON.stringify(collection, null, 2), "utf-8");

  return chosenId;
}
