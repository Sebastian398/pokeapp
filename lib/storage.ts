export type Collection = {
  captured: Record<string, boolean>;
  favorites: Record<string, boolean>;
};

export function getCollection(): Collection {
  if (typeof window === "undefined") {
    // SSR: devolver colección vacía
    return { captured: {}, favorites: {} };
  }
  const saved = localStorage.getItem("pokeapp_collection");
  return saved ? JSON.parse(saved) : { captured: {}, favorites: {} };
}

export function setCaptured(id: string, captured: boolean) {
  if (typeof window === "undefined") return;
  const col = getCollection();
  col.captured[id] = captured;
  if (!captured) delete col.captured[id];
  localStorage.setItem("pokeapp_collection", JSON.stringify(col));
}

export function setFavorite(id: string, favorite: boolean) {
  if (typeof window === "undefined") return;
  const col = getCollection();
  col.favorites[id] = favorite;
  if (!favorite) delete col.favorites[id];
  localStorage.setItem("pokeapp_collection", JSON.stringify(col));
}
