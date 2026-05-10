/* // src/app/pokemon/daily/page.tsx
import { fetchPokemon } from "@/lib/pokeapi";
import { getDailyPokemonId } from "@/lib/daily-pokemon";

export default async function DailyPokemonPage() {
  const dailyId = getDailyPokemonId();

  if (!dailyId) {
    return (
      <div className="text-center p-8">
        <p>Aún no tienes ningún Pokémon marcado como atrapado.</p>
      </div>
    );
  }

  const pokemon = await fetchPokemon(dailyId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-sm">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Pokémon del día 🎉
        </h1>
        <p className="text-gray-700 mb-4">Tu Pokémon del día es...</p>

        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
          alt={pokemon.name}
          className="w-32 h-32 mx-auto mb-4"
        />

        <p className="text-xl font-bold capitalize">
          {pokemon.name} #{pokemon.id}
        </p>

        <a
          href={`/pokemon/${pokemon.id}`}
          className="block mt-6 text-blue-600 hover:underline"
        >
          Ver en la Pokédex
        </a>
      </div>
    </div>
  );
}
 */