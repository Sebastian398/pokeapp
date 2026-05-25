import { fetchPokemon } from "@/lib/pokeapi";

export default async function DailyPokemonPage() {
  // Consumir la API que ya guarda en Redis
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/daily`, {
    cache: "no-store", // evita que Next.js cachee la respuesta
  });
  const data = await res.json();

  if (data.error) {
    return (
      <div className="text-center p-8">
        <p>{data.error}</p>
      </div>
    );
  }

  const pokemon = await fetchPokemon(data.id);

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
          loading="lazy"
        />

        <p className="text-xl font-bold capitalize text-black">
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
