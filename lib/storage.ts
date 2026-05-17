// lib/storage.ts
import fs from "fs";
import path from "path";

export type Collection = {
  captured: Record<string, boolean>;
  favorites: Record<string, boolean>;
  daily?: {
    id: string;
    date: string; // formato YYYY-MM-DD
  };
};

const filePath = path.join(process.cwd(), "data", "collection.json");

function readFile(): Collection {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return { captured: {}, favorites: {} };
  }
}

function writeFile(collection: Collection) {
  fs.writeFileSync(filePath, JSON.stringify(collection, null, 2), "utf-8");
}

export function getCollection(): Collection {
  return readFile();
}

export function setCaptured(id: string, captured: boolean) {
  const col = readFile();
  if (captured) {
    col.captured[id] = true;
  } else {
    delete col.captured[id];
  }
  writeFile(col);
}

export function setFavorite(id: string, favorite: boolean) {
  const col = readFile();
  if (favorite) {
    col.favorites[id] = true;
  } else {
    delete col.favorites[id];
  }
  writeFile(col);
}
