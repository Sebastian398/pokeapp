import { fetchPokemon } from "@/lib/pokeapi";

export default async function DailyPokemonPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/daily`, {
    cache: "no-store",
  });
  const data = await res.json();

  if (data.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Oops!</h2>
          <p className="text-gray-600">{data.error}</p>
        </div>
      </div>
    );
  }

  const pokemon = await fetchPokemon(data.id);

  const typeColors: Record<string, string> = {
    normal: "from-gray-400 to-gray-500",
    fire: "from-orange-400 to-red-500",
    water: "from-blue-400 to-blue-600",
    electric: "from-yellow-300 to-yellow-500",
    grass: "from-green-400 to-green-600",
    ice: "from-cyan-300 to-blue-400",
    fighting: "from-red-600 to-red-800",
    poison: "from-purple-400 to-purple-600",
    ground: "from-yellow-600 to-amber-700",
    flying: "from-indigo-300 to-indigo-500",
    psychic: "from-pink-400 to-pink-600",
    bug: "from-lime-400 to-green-500",
    rock: "from-yellow-700 to-stone-600",
    ghost: "from-purple-600 to-purple-900",
    dragon: "from-indigo-600 to-purple-700",
    dark: "from-gray-700 to-gray-900",
    steel: "from-gray-400 to-slate-500",
    fairy: "from-pink-300 to-pink-500",
  };

  const mainType = pokemon.types[0]?.type.name || "normal";
  const gradientClass = typeColors[mainType] || "from-blue-400 to-blue-600";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 md:p-8 flex items-center justify-center relative overflow-hidden`}>
      {/* Pokéballs decorativas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-6 py-2 mb-3">
            <span className="text-white font-semibold text-sm tracking-wider uppercase">
              ✨ Pokémon del día ✨
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
            ¡Hoy te toca {pokemon.name}!
          </h1>
        </div>

        {/* Card principal */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02] duration-300">
          {/* Imagen del Pokémon */}
          <div className={`relative bg-gradient-to-br ${gradientClass} p-8`}>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative flex justify-center">
              <img
                src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-64 h-64 object-contain drop-shadow-2xl animate-bounce-slow"
                style={{
                  filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.3))",
                }}
              />
            </div>
            {/* Número del Pokémon */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                #{String(pokemon.id).padStart(3, "0")}
              </span>
            </div>
          </div>

          {/* Información */}
          <div className="p-8">
            {/* Nombre y tipos */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 capitalize mb-3">
                {pokemon.name}
              </h2>
              <div className="flex justify-center gap-2 flex-wrap">
                {pokemon.types.map((typeInfo: any) => (
                  <span
                    key={typeInfo.type.name}
                    className={`bg-gradient-to-r ${typeColors[typeInfo.type.name] || "from-gray-400 to-gray-500"} text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md capitalize`}
                  >
                    {typeInfo.type.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{pokemon.height / 10}m</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Altura</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{pokemon.weight / 10}kg</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Peso</div>
              </div>
            </div>

            {/* Habilidades */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Habilidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability: any) => (
                  <span
                    key={ability.ability.name}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm capitalize border border-gray-200"
                  >
                    {ability.ability.name.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Estadísticas base */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                Estadísticas base
              </h3>
              <div className="space-y-2">
                {pokemon.stats.map((stat: any) => (
                  <div key={stat.stat.name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-20 capitalize truncate">
                      {stat.stat.name.replace("-", " ")}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${gradientClass} rounded-full transition-all duration-1000`}
                        style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-8 text-right">
                      {stat.base_stat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            Vuelve mañana para descubrir un nuevo Pokémon
          </p>
        </div>
      </div>
    </div>
  );
}