// src/app/pokemon/[id]/page.tsx
import { fetchPokemon } from "@/lib/pokeapi";
import { Collection } from "@/types/collection";
import { Pokemon } from "@/types/pokemon";

export default async function PokemonDetail(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const pokemon: Pokemon = await fetchPokemon(id);
  
  // descripción desde species
  const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const species = await resSpecies.json();
  const descriptionEntry = species.flavor_text_entries.find(
    (entry: { language: { name: string } }) => entry.language.name === "es"
  );
  const description = descriptionEntry
    ? descriptionEntry.flavor_text.replace(/\n|\f/g, " ")
    : "Sin descripción disponible";

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
        {/* Descripción */}
        <p className="text-gray-700 italic mb-6">{description}</p>
        
        {/* Stats */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2 text-black">Estadísticas</h2>
          <ul>
            {pokemon.stats.map((s) => (
              <li key={s.stat.name} className="text-sm capitalize mb-1 text-black">
                {s.stat.name.replace("-", " ")}: {s.base_stat}
                <div className="w-full bg-gray-200 rounded h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded"
                    style={{ width: `${s.base_stat / 2}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Movimientos */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2 text-black">Movimientos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
            {pokemon.moves.slice(0, 20).map((m) => (
              <span
                key={m.move.name}
                className="text-xs bg-gray-100 px-2 py-1 rounded capitalize text-black"
              >
                {m.move.name.replace("-", " ")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
