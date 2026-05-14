import { Redis } from "@upstash/redis";

export type Collection = {
  captured: Record<string, boolean>;
  favorites: Record<string, boolean>;
  daily?: { id: string; date: string };
};

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function getCollection(): Promise<Collection> {
  const data = await redis.get("pokeapp_collection");
  return (data as Collection) || { captured: {}, favorites: {} };
}

export async function setCaptured(id: string, captured: boolean) {
  const col = await getCollection();
  col.captured[id] = captured;
  if (!captured) delete col.captured[id];
  await redis.set("pokeapp_collection", col);
}

export async function setFavorite(id: string, favorite: boolean) {
  const col = await getCollection();
  col.favorites[id] = favorite;
  if (!favorite) delete col.favorites[id];
  await redis.set("pokeapp_collection", col);
}
