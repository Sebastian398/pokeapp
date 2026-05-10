// src/app/pokemon/[id]/page.tsx
import { fetchPokemon } from "@/lib/pokeapi";
import { Collection } from "@/types/collection";

export default async function PokemonDetail(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const pokemon = await fetchPokemon(id);

  let collection: Collection;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collection`);
    collection = await res.json();
  } catch {
    collection = { captured: {}, favorites: {} };
  }

  const idStr = String(pokemon.id);
  const isCaptured = !!collection.captured[idStr];
  const isFavorite = !!collection.favorites[idStr];

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-center capitalize mb-2 text-black">
          {pokemon.name}
        </h1>
        <p className="text-center text-gray-500 mb-4">#{pokemon.id}</p>
        <img
          src={
            pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default
          }
          alt={pokemon.name}
          className="w-40 h-40 mx-auto mb-6"
        />
        {/* Aquí ya puedes mostrar tipos, stats, etc. */}
      </div>
    </main>
  );
}
