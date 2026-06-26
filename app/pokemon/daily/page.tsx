import { fetchPokemon } from "@/lib/pokeapi";

export default async function DailyPokemonPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/daily`, {
    cache: "no-store",
  });
  const data = await res.json();

  if (data.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-white text-lg">{data.error}</p>
        </div>
      </div>
    );
  }

  const pokemon = await fetchPokemon(data.id);

  // Mapeo de tipos a colores (por si quieres mostrar los types)
  const typeColors: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-orange-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-cyan-300",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-300",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-700",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-600",
    dark: "bg-gray-700",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      {/* Pokeball decorativo de fondo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full border-[40px] border-white relative">
          <div className="absolute top-1/2 left-0 right-0 h-[40px] bg-white -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full border-[40px] border-white bg-transparent" />
        </div>
      </div>

      {/* Partículas decorativas */}
      <div className="absolute top-20 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      <div className="absolute top-40 right-32 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300" />
      <div className="absolute bottom-32 left-40 w-4 h-4 bg-pink-400 rounded-full animate-pulse delay-700" />
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-500" />

      {/* Tarjeta principal */}
      <div className="relative z-10 w-full max-w-md">

        {/* Tarjeta */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden group hover:border-white/40 transition-all duration-500">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative text-center">
              <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
                ¡Hoy te toca!
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Tu compañero Pokémon del día es...
              </p>
            </div>
          </div>

          {/* Imagen del Pokémon */}
          <div className="relative -mt-8 flex justify-center">
            <div className="relative">
              {/* Halo detrás del Pokémon */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/30 to-transparent rounded-full blur-2xl scale-150" />
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                className="relative w-48 h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Info del Pokémon */}
          <div className="p-6 text-center space-y-4">
            {/* Nombre y ID */}
            <div>
              <p className="text-white/60 text-sm font-medium uppercase tracking-widest">
                #{String(pokemon.id).padStart(3, "0")}
              </p>
              <h2 className="text-4xl font-extrabold text-white capitalize mt-1 drop-shadow-lg">
                {pokemon.name}
              </h2>
            </div>

            {/* Tipos (si están disponibles) */}
            {pokemon.types && (
              <div className="flex justify-center gap-2 flex-wrap">
                {pokemon.types.map((t: any) => {
                  const typeName = typeof t === "string" ? t : t.type?.name || t;
                  return (
                    <span
                      key={typeName}
                      className={`${typeColors[typeName] || "bg-gray-500"} text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md capitalize`}
                    >
                      {typeName}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Stats rápidas (si están disponibles) */}
            {pokemon.stats && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-white/50 text-xs uppercase">Altura</p>
                  <p className="text-white font-bold text-lg">
                    {(pokemon.height / 10).toFixed(1)}m
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-white/50 text-xs uppercase">Peso</p>
                  <p className="text-white font-bold text-lg">
                    {(pokemon.weight / 10).toFixed(1)}kg
                  </p>
                </div>
              </div>
            )}

            {/* Botón Ver en Pokédex */}
            <a
              href={`/pokemon/${pokemon.id}`}
              className="group/btn relative inline-flex items-center justify-center gap-2 w-full mt-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <span>Ver en la Pokédex</span>
              <svg
                className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer decorativo */}
        <p className="text-center text-white/40 text-xs mt-6">
          Vuelve mañana para descubrir un nuevo Pokémon
        </p>
      </div>
    </div>
  );
}