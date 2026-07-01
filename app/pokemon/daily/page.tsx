import { fetchPokemon } from "@/lib/pokeapi";

// Mapeo de tipos a temas completos (gradientes para header/botón + fondo + glow)
const typeThemes: Record<string, { gradient: string; bg: string; shadow: string; glow: string }> = {
  normal:   { gradient: "from-gray-400 via-gray-500 to-gray-600",      bg: "from-slate-800 via-gray-900 to-slate-900",      shadow: "shadow-gray-500/40",   glow: "bg-gray-400/30" },
  fire:     { gradient: "from-orange-500 via-red-500 to-red-600",      bg: "from-slate-900 via-red-950 to-orange-950",      shadow: "shadow-red-500/50",    glow: "bg-orange-500/30" },
  water:    { gradient: "from-blue-400 via-blue-500 to-blue-700",      bg: "from-slate-900 via-blue-950 to-indigo-950",     shadow: "shadow-blue-500/50",   glow: "bg-blue-400/30" },
  electric: { gradient: "from-yellow-300 via-yellow-400 to-amber-500", bg: "from-slate-900 via-yellow-950 to-amber-950",    shadow: "shadow-yellow-400/50", glow: "bg-yellow-400/30" },
  grass:    { gradient: "from-green-400 via-green-500 to-emerald-600", bg: "from-slate-900 via-green-950 to-emerald-950",   shadow: "shadow-green-500/50",  glow: "bg-green-400/30" },
  ice:      { gradient: "from-cyan-300 via-cyan-400 to-blue-400",      bg: "from-slate-900 via-cyan-950 to-blue-950",       shadow: "shadow-cyan-400/50",   glow: "bg-cyan-300/30" },
  fighting: { gradient: "from-red-600 via-red-700 to-amber-800",       bg: "from-slate-900 via-red-950 to-amber-950",       shadow: "shadow-red-700/50",    glow: "bg-red-600/30" },
  poison:   { gradient: "from-purple-400 via-purple-500 to-purple-700",bg: "from-slate-900 via-purple-950 to-fuchsia-950",  shadow: "shadow-purple-500/50", glow: "bg-purple-400/30" },
  ground:   { gradient: "from-amber-500 via-amber-600 to-yellow-700",  bg: "from-slate-900 via-amber-950 to-yellow-950",    shadow: "shadow-amber-600/50",  glow: "bg-amber-500/30" },
  flying:   { gradient: "from-indigo-300 via-sky-400 to-blue-500",     bg: "from-slate-900 via-indigo-950 to-sky-950",      shadow: "shadow-sky-400/50",    glow: "bg-sky-400/30" },
  psychic:  { gradient: "from-pink-400 via-pink-500 to-fuchsia-600",   bg: "from-slate-900 via-pink-950 to-fuchsia-950",    shadow: "shadow-pink-500/50",   glow: "bg-pink-400/30" },
  bug:      { gradient: "from-lime-400 via-lime-500 to-green-600",     bg: "from-slate-900 via-lime-950 to-green-950",      shadow: "shadow-lime-500/50",   glow: "bg-lime-400/30" },
  rock:     { gradient: "from-yellow-600 via-amber-700 to-stone-700",  bg: "from-slate-900 via-yellow-950 to-stone-950",    shadow: "shadow-amber-700/50",  glow: "bg-yellow-600/30" },
  ghost:    { gradient: "from-purple-500 via-purple-600 to-indigo-700",bg: "from-slate-900 via-purple-950 to-indigo-950",   shadow: "shadow-purple-600/50", glow: "bg-purple-500/30" },
  dragon:   { gradient: "from-indigo-500 via-violet-600 to-purple-700",bg: "from-slate-900 via-indigo-950 to-violet-950",   shadow: "shadow-indigo-600/50", glow: "bg-indigo-500/30" },
  dark:     { gradient: "from-gray-600 via-gray-700 to-gray-900",      bg: "from-slate-950 via-gray-950 to-black",          shadow: "shadow-gray-700/50",   glow: "bg-gray-600/30" },
  steel:    { gradient: "from-slate-400 via-slate-500 to-zinc-600",    bg: "from-slate-900 via-slate-950 to-zinc-950",      shadow: "shadow-slate-500/50",  glow: "bg-slate-400/30" },
  fairy:    { gradient: "from-pink-300 via-pink-400 to-rose-500",      bg: "from-slate-900 via-pink-950 to-rose-950",       shadow: "shadow-pink-400/50",   glow: "bg-pink-300/30" },
};

const defaultTheme = typeThemes.normal;

// Colores simples para los badges de tipos
const typeBadgeColors: Record<string, string> = {
  normal: "bg-gray-400", fire: "bg-orange-500", water: "bg-blue-500",
  electric: "bg-yellow-400", grass: "bg-green-500", ice: "bg-cyan-300",
  fighting: "bg-red-700", poison: "bg-purple-500", ground: "bg-yellow-600",
  flying: "bg-indigo-300", psychic: "bg-pink-500", bug: "bg-lime-500",
  rock: "bg-yellow-700", ghost: "bg-purple-700", dragon: "bg-indigo-600",
  dark: "bg-gray-700", steel: "bg-gray-500", fairy: "bg-pink-300",
};

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

  // Obtener el tipo primario para aplicar su tema
  const primaryTypeName =
    pokemon.types && pokemon.types.length > 0
      ? (typeof pokemon.types[0] === "string"
          ? pokemon.types[0]
          : pokemon.types[0].type?.name || pokemon.types[0])
      : "normal";

  const theme = typeThemes[primaryTypeName] || defaultTheme;

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4 transition-colors duration-700`}>
      {/* Pokeball decorativo de fondo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full border-[40px] border-white relative">
          <div className="absolute top-1/2 left-0 right-0 h-[40px] bg-white -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full border-[40px] border-white bg-transparent" />
        </div>
      </div>

      {/* Glow ambiental del tipo primario */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full ${theme.glow} blur-3xl pointer-events-none`} />

      {/* Partículas decorativas */}
      <div className="absolute top-20 left-20 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
      <div className="absolute top-40 right-32 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
      <div className="absolute bottom-32 left-40 w-4 h-4 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: "0.7s" }} />
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-1/3 right-20 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping" />
      <div className="absolute bottom-1/3 left-20 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping" style={{ animationDelay: "1s" }} />

      {/* Tarjeta principal */}
      <div className="relative z-10 w-full max-w-md">
        {/* Tarjeta */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden group hover:border-white/30 transition-all duration-500">
          
          {/* HEADER con gradiente del tipo primario */}
          <div className={`bg-gradient-to-br ${theme.gradient} p-6 pb-20 relative overflow-hidden`}>
            {/* Elementos decorativos del header */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-sm" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-sm" />
            <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white/30 rounded-full" />
            <div className="absolute top-6 right-6 w-4 h-4 border-2 border-white/20 rounded-full" />
            
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-3">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white/90 text-xs font-semibold uppercase tracking-widest">
                  Pokémon del día
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">
                ¡Hoy te toca!
              </h1>
              <p className="text-white/80 text-sm mt-1 font-medium">
                Tu compañero Pokémon del día es...
              </p>
            </div>
          </div>

          {/* Imagen del Pokémon */}
          <div className="relative -mt-20 flex justify-center">
            <div className="relative">
              {/* Halo con color del tipo */}
              <div className={`absolute inset-0 ${theme.glow} rounded-full blur-3xl scale-[2]`} />
              <div className="absolute inset-0 bg-white/10 rounded-full blur-xl scale-150" />
              
              {/* Sombra bajo el Pokémon */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-40 h-8 bg-black/30 rounded-full blur-md" />
              
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                className="relative w-52 h-52 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out"
              />
            </div>
          </div>

          {/* Info del Pokémon */}
          <div className="p-6 pt-4 text-center space-y-4">
            {/* Nombre y ID */}
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-[0.3em]">
                N.° {String(pokemon.id).padStart(4, "0")}
              </p>
              <h2 className="text-4xl font-extrabold text-white capitalize mt-1 drop-shadow-lg tracking-tight">
                {pokemon.name}
              </h2>
            </div>

            {/* Tipos */}
            {pokemon.types && (
              <div className="flex justify-center gap-2 flex-wrap">
                {pokemon.types.map((t: any, index: number) => {
                  const typeName = typeof t === "string" ? t : t.type?.name || t;
                  return (
                    <span
                      key={typeName}
                      className={`${typeBadgeColors[typeName] || "bg-gray-500"} ${
                        index === 0 ? "ring-2 ring-white/30 ring-offset-2 ring-offset-transparent" : ""
                      } text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg capitalize flex items-center gap-1.5`}
                    >
                      {index === 0 && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      {typeName}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Divider decorativo */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Stats rápidas */}
            {pokemon.stats && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 transition-all duration-300 group/stat">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <svg className="w-3.5 h-3.5 text-white/50 group-hover/stat:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Altura</p>
                  </div>
                  <p className="text-white font-extrabold text-xl">
                    {(pokemon.height / 10).toFixed(1)}
                    <span className="text-sm font-medium text-white/60 ml-0.5">m</span>
                  </p>
                </div>
                <div className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 transition-all duration-300 group/stat">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <svg className="w-3.5 h-3.5 text-white/50 group-hover/stat:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Peso</p>
                  </div>
                  <p className="text-white font-extrabold text-xl">
                    {(pokemon.weight / 10).toFixed(1)}
                    <span className="text-sm font-medium text-white/60 ml-0.5">kg</span>
                  </p>
                </div>
              </div>
            )}

            {/* BOTÓN con color del tipo primario */}
            <a
              href={`/pokemon/${pokemon.id}`}
              className={`group/btn relative inline-flex items-center justify-center gap-2 w-full mt-4 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white font-bold py-4 px-6 rounded-2xl shadow-lg ${theme.shadow} transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden`}
            >
              {/* Efecto de brillo al hacer hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              
              <span className="relative flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Ver en la Pokédex</span>
              </span>
              <svg
                className="relative w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer decorativo */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-white/20" />
            <div className="w-2 h-2 border border-white/30 rounded-full" />
            <div className="w-8 h-px bg-white/20" />
          </div>
          <p className="text-white/40 text-xs font-medium">
            Vuelve mañana para descubrir un nuevo Pokémon
          </p>
        </div>
      </div>
    </div>
  );
}