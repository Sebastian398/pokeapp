export type Collection = {
  captured: Record<string, boolean>;   // id: true
  favorites: Record<string, boolean>;  // id: true
};

export function getCollection(): Collection {
  const saved = localStorage.getItem("pokeapp_collection");
  return saved ? JSON.parse(saved) : { captured: {}, favorites: {} };
}

export function setCaptured(id: string, captured: boolean) {
  const col = getCollection();
  col.captured[id] = captured;
  if (!captured) delete col.captured[id];
  localStorage.setItem("pokeapp_collection", JSON.stringify(col));
}

export function setFavorite(id: string, favorite: boolean) {
  const col = getCollection();
  col.favorites[id] = favorite;
  if (!favorite) delete col.favorites[id];
  localStorage.setItem("pokeapp_collection", JSON.stringify(col));
}