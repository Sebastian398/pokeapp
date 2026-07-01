import { fetchPokemon } from "@/lib/pokeapi";
import { EvolutionNode, Pokemon, TypeResponse } from "@/types/pokemon";
import AbilityList from "./AbilityList";
import MovesTable from "./movesTable";
import { MoveDetailed } from "@/types/move";
import { JSX } from "react";
import Link from "next/link";

// Temas completos por tipo (gradientes, colores, glows)
const typeThemes: Record<
  string,
  { gradient: string; bg: string; shadow: string; glow: string; accent: string; text: string }
> = {
  normal:   { gradient: "from-gray-400 via-gray-500 to-gray-600",       bg: "from-slate-100 via-gray-100 to-slate-200",      shadow: "shadow-gray-400/40",   glow: "bg-gray-400/20",    accent: "bg-gray-500",    text: "text-gray-700" },
  fire:     { gradient: "from-orange-500 via-red-500 to-red-600",       bg: "from-orange-50 via-red-50 to-amber-50",         shadow: "shadow-red-500/40",    glow: "bg-orange-500/20",  accent: "bg-red-500",     text: "text-red-700" },
  water:    { gradient: "from-blue-400 via-blue-500 to-blue-700",       bg: "from-blue-50 via-sky-50 to-cyan-50",            shadow: "shadow-blue-500/40",   glow: "bg-blue-500/20",    accent: "bg-blue-500",    text: "text-blue-700" },
  electric: { gradient: "from-yellow-300 via-yellow-400 to-amber-500",  bg: "from-yellow-50 via-amber-50 to-orange-50",      shadow: "shadow-yellow-400/40", glow: "bg-yellow-400/20",  accent: "bg-yellow-500",  text: "text-amber-700" },
  grass:    { gradient: "from-green-400 via-green-500 to-emerald-600",  bg: "from-green-50 via-emerald-50 to-lime-50",       shadow: "shadow-green-500/40",  glow: "bg-green-500/20",   accent: "bg-green-500",   text: "text-green-700" },
  ice:      { gradient: "from-cyan-300 via-cyan-400 to-blue-400",       bg: "from-cyan-50 via-sky-50 to-blue-50",            shadow: "shadow-cyan-400/40",   glow: "bg-cyan-400/20",    accent: "bg-cyan-500",    text: "text-cyan-700" },
  fighting: { gradient: "from-red-600 via-red-700 to-amber-800",        bg: "from-red-50 via-rose-50 to-amber-50",           shadow: "shadow-red-700/40",    glow: "bg-red-600/20",     accent: "bg-red-700",     text: "text-red-800" },
  poison:   { gradient: "from-purple-400 via-purple-500 to-purple-700", bg: "from-purple-50 via-fuchsia-50 to-violet-50",    shadow: "shadow-purple-500/40", glow: "bg-purple-500/20",  accent: "bg-purple-500",  text: "text-purple-700" },
  ground:   { gradient: "from-amber-500 via-amber-600 to-yellow-700",   bg: "from-amber-50 via-yellow-50 to-orange-50",      shadow: "shadow-amber-600/40",  glow: "bg-amber-500/20",   accent: "bg-amber-600",   text: "text-amber-700" },
  flying:   { gradient: "from-indigo-300 via-sky-400 to-blue-500",      bg: "from-indigo-50 via-sky-50 to-blue-50",          shadow: "shadow-sky-400/40",    glow: "bg-sky-400/20",     accent: "bg-sky-500",     text: "text-sky-700" },
  psychic:  { gradient: "from-pink-400 via-pink-500 to-fuchsia-600",    bg: "from-pink-50 via-fuchsia-50 to-rose-50",        shadow: "shadow-pink-500/40",   glow: "bg-pink-500/20",    accent: "bg-pink-500",    text: "text-pink-700" },
  bug:      { gradient: "from-lime-400 via-lime-500 to-green-600",      bg: "from-lime-50 via-green-50 to-emerald-50",       shadow: "shadow-lime-500/40",   glow: "bg-lime-400/20",    accent: "bg-lime-500",    text: "text-lime-700" },
  rock:     { gradient: "from-yellow-600 via-amber-700 to-stone-700",   bg: "from-yellow-50 via-amber-50 to-stone-100",      shadow: "shadow-amber-700/40",  glow: "bg-yellow-600/20",  accent: "bg-amber-700",   text: "text-amber-800" },
  ghost:    { gradient: "from-purple-500 via-purple-600 to-indigo-700", bg: "from-purple-50 via-indigo-50 to-violet-50",     shadow: "shadow-purple-600/40", glow: "bg-purple-600/20",  accent: "bg-purple-600",  text: "text-purple-800" },
  dragon:   { gradient: "from-indigo-500 via-violet-600 to-purple-700", bg: "from-indigo-50 via-violet-50 to-purple-50",     shadow: "shadow-indigo-600/40", glow: "bg-indigo-600/20",  accent: "bg-indigo-600",  text: "text-indigo-800" },
  dark:     { gradient: "from-gray-600 via-gray-700 to-gray-900",       bg: "from-gray-100 via-slate-100 to-zinc-200",       shadow: "shadow-gray-700/40",   glow: "bg-gray-700/20",    accent: "bg-gray-700",    text: "text-gray-800" },
  steel:    { gradient: "from-slate-400 via-slate-500 to-zinc-600",     bg: "from-slate-100 via-zinc-100 to-gray-200",       shadow: "shadow-slate-500/40",  glow: "bg-slate-500/20",   accent: "bg-slate-500",   text: "text-slate-700" },
  fairy:    { gradient: "from-pink-300 via-pink-400 to-rose-500",       bg: "from-pink-50 via-rose-50 to-fuchsia-50",        shadow: "shadow-pink-400/40",   glow: "bg-pink-400/20",    accent: "bg-pink-400",    text: "text-pink-700" },
};

// Colores sólidos para badges de tipos
const typeBadgeColors: Record<string, string> = {
  normal: "bg-gray-400", fire: "bg-orange-500", water: "bg-blue-500",
  electric: "bg-yellow-400", grass: "bg-green-500", ice: "bg-cyan-400",
  fighting: "bg-red-700", poison: "bg-purple-500", ground: "bg-amber-600",
  flying: "bg-indigo-300", psychic: "bg-pink-500", bug: "bg-lime-500",
  rock: "bg-yellow-700", ghost: "bg-purple-700", dragon: "bg-indigo-600",
  dark: "bg-gray-700", steel: "bg-slate-500", fairy: "bg-pink-300",
};

const defaultTheme = typeThemes.normal;

// 🎨 Colores de las barras de stats según el valor (5 niveles)
function getStatBarColor(value: number): string {
  if (value <= 40) return "bg-gradient-to-r from-rose-500 via-red-500 to-red-600";
  if (value <= 69) return "bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500";
  if (value <= 89) return "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500";
  if (value <= 119) return "bg-gradient-to-r from-emerald-400 via-green-500 to-green-600";
  return "bg-gradient-to-r from-cyan-400 via-teal-500 to-cyan-600";
}

export default async function PokemonDetail(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const pokemon: Pokemon = await fetchPokemon(id);

  const primaryType = pokemon.types[0]?.type.name || "normal";
  const theme = typeThemes[primaryType] || defaultTheme;

  let species;
  try {
    const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    if (!resSpecies.ok) throw new Error("Species no encontrada");
    species = await resSpecies.json();
  } catch {
    const resForm = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${id}`);
    if (!resForm.ok) throw new Error("Forma no encontrada");
    const formData = await resForm.json();

    const resBase = await fetch(formData.pokemon.url);
    const baseData = await resBase.json();

    const resSpecies = await fetch(baseData.species.url);
    if (!resSpecies.ok) throw new Error("Species no encontrada");
    species = await resSpecies.json();
  }

  const descriptionEntry =
    species.flavor_text_entries.find(
      (entry: { language: { name: string } }) => entry.language.name === "es"
    ) ||
    species.flavor_text_entries.find(
      (entry: { language: { name: string } }) => entry.language.name === "en"
    );
  const description = descriptionEntry
    ? descriptionEntry.flavor_text.replace(/\n|\f/g, " ")
    : "Sin descripción disponible";

  const typeRelations = await Promise.all(
    pokemon.types.map(async (t) => {
      const resType = await fetch(t.type.url);
      return resType.json() as Promise<TypeResponse>;
    })
  );
  const relations = calculateTypeRelations(pokemon.types, typeRelations);

  const resChain = await fetch(species.evolution_chain.url);
  const chain = await resChain.json();

  const movesDetailed: MoveDetailed[] = await Promise.all(
    pokemon.moves.map(async (m) => {
      const resMove = await fetch(m.move.url);
      const moveData = await resMove.json();
      const entry =
        moveData.effect_entries.find(
          (e: { language: { name: string } }) => e.language.name === "es"
        ) ||
        moveData.effect_entries.find(
          (e: { language: { name: string } }) => e.language.name === "en"
        );
      return {
        name: m.move.name,
        method: m.version_group_details[0]?.move_learn_method.name || "—",
        level: m.version_group_details[0]?.level_learned_at || "—",
        power: moveData.power || "—",
        accuracy: moveData.accuracy || "—",
        category: moveData.damage_class?.name || "—",
        type: moveData.type?.name || "—",
        description: entry ? entry.short_effect : "Sin descripción disponible",
      };
    })
  );

  const groupedMoves: Record<string, typeof movesDetailed> = {};
  movesDetailed.forEach((m) => {
    if (!groupedMoves[m.method]) groupedMoves[m.method] = [];
    groupedMoves[m.method].push(m);
  });

  const totalStats = pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0);

  return (
    <main className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden`}>
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] ${theme.glow} blur-3xl pointer-events-none`} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <div className="w-[1000px] h-[1000px] rounded-full border-[50px] border-black relative">
          <div className="absolute top-1/2 left-0 right-0 h-[50px] bg-black -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] rounded-full border-[50px] border-black bg-transparent" />
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto p-4 sm:p-6">
        {/* HEADER */}
        <div className={`bg-gradient-to-br ${theme.gradient} rounded-3xl shadow-2xl ${theme.shadow} overflow-hidden mb-6 relative`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-sm" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-sm" />

          <div className="relative p-6 pb-32">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </Link>
              <span className="text-white/70 text-sm font-bold tracking-widest">
                N.° {String(pokemon.id).padStart(4, "0")}
              </span>
            </div>

            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white capitalize drop-shadow-lg tracking-tight">
                {pokemon.name}
              </h1>
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                {pokemon.types.map((t) => (
                  <span
                    key={t.type.name}
                    className={`${typeBadgeColors[t.type.name] || "bg-gray-500"} text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider capitalize shadow-md border border-white/20 flex items-center gap-1.5`}
                  >
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sprites */}
          <div className="relative -mt-20 px-6 pb-6">
            <div className="flex justify-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center group">
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-2 border-white/50 group-hover:scale-105 transition-transform duration-300">
                  <div className={`absolute inset-0 ${theme.glow} rounded-2xl blur-xl -z-10`} />
                  <img
                    src={
                      pokemon.sprites.other["official-artwork"].front_default ||
                      pokemon.sprites.front_default
                    }
                    alt={pokemon.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-lg"
                  />
                </div>
                <span className="mt-2 text-white/90 text-xs font-bold uppercase tracking-wider bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  Normal
                </span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-2 border-yellow-300/50 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-xl -z-10" />
                  <img
                    src={pokemon.sprites.front_shiny}
                    alt={`${pokemon.name} shiny`}
                    className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-lg"
                  />
                </div>
                <span className="mt-2 text-white/90 text-xs font-bold uppercase tracking-wider bg-yellow-400/30 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-300/50">
                  ✨ Shiny
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-5 mb-6 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${theme.gradient}`} />
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-md`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className={`${theme.text} italic leading-relaxed text-sm sm:text-base`}>{description}</p>
          </div>
        </div>

        {/* Habilidades */}
        <SectionCard title="Habilidades" icon="M13 10V3L4 14h7v7l9-11h-7z" theme={theme}>
          <AbilityList abilities={pokemon.abilities} />
        </SectionCard>

        {/* 📊 Estadísticas con colores según el valor */}
        <SectionCard title="Estadísticas Base" icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" theme={theme}>
          <ul className="space-y-3">
            {pokemon.stats.map((s) => {
              const percentage = Math.min(s.base_stat, 200) / 2;
              const barColor = getStatBarColor(s.base_stat);
              return (
                <li key={s.stat.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="capitalize font-semibold text-gray-800 text-sm">
                      {s.stat.name.replace("-", " ")}
                    </span>
                    <span className="font-bold text-black text-sm tabular-nums">
                      {s.base_stat}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200/70 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-1000 shadow-sm relative overflow-hidden`}
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className={`font-bold ${theme.text}`}>Total</span>
            <span className="text-2xl font-extrabold text-black tabular-nums">
              {totalStats}
            </span>
          </div>
        </SectionCard>

        {/* Debilidades y Resistencias */}
        <SectionCard title="Debilidades y Resistencias" icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" theme={theme}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TypeRelationBox
              title="Débil"
              types={relations.weaknesses}
              colorClass="bg-red-50 border-red-200"
              titleColor="text-red-700"
              icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
            <TypeRelationBox
              title="Resistente"
              types={relations.resistances}
              colorClass="bg-green-50 border-green-200"
              titleColor="text-green-700"
              icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
            <TypeRelationBox
              title="Inmune"
              types={relations.immunities}
              colorClass="bg-blue-50 border-blue-200"
              titleColor="text-blue-700"
              icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </div>
        </SectionCard>

        {/* Cadena evolutiva */}
        <SectionCard title="Cadena Evolutiva" icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" theme={theme}>
          <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap py-2">
            {renderChain(chain.chain, theme)}
          </div>
        </SectionCard>

        {/* Movimientos */}
        <SectionCard title="Movimientos" icon="M13 10V3L4 14h7v7l9-11h-7z" theme={theme}>
          <MovesTable groupedMoves={groupedMoves} />
        </SectionCard>
      </div>
    </main>
  );
}

function SectionCard({
  title,
  icon,
  theme,
  children,
}: {
  title: string;
  icon: string;
  theme: typeof typeThemes[string];
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-5 mb-6 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${theme.gradient}`} />
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-md`}>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        <h2 className={`text-lg font-bold ${theme.text}`}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function TypeRelationBox({
  title,
  types,
  colorClass,
  titleColor,
  icon,
}: {
  title: string;
  types: string[];
  colorClass: string;
  titleColor: string;
  icon: string;
}) {
  return (
    <div className={`${colorClass} border rounded-xl p-3 transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center gap-1.5 mb-2">
        <svg className={`w-4 h-4 ${titleColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
        <p className={`font-bold ${titleColor} text-sm`}>{title}</p>
      </div>
      {types.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {types.map((typeName) => (
            <span
              key={typeName}
              className={`${typeBadgeColors[typeName] || "bg-gray-500"} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider capitalize shadow-sm`}
            >
              {typeName}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-xs italic">Ninguno</p>
      )}
    </div>
  );
}

function renderChain(node: EvolutionNode, theme: typeof typeThemes[string]): JSX.Element {
  return (
    <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
      <div className="flex flex-col items-center max-w-[110px] group">
        <Link href={`/pokemon/${extractId(node.species.url)}`} className="relative">
          <div className="relative bg-white rounded-2xl p-2 shadow-md border-2 border-gray-100 group-hover:border-current transition-colors duration-300 overflow-hidden">
            <div className={`absolute inset-0 ${theme.glow} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${extractId(node.species.url)}.png`}
              alt={node.species.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </Link>
        <span className="capitalize font-bold text-gray-800 text-xs sm:text-sm mt-2 text-center">
          {node.species.name}
        </span>
      </div>

      {node.evolves_to.length > 0 &&
        node.evolves_to.map((next: EvolutionNode) => (
          <div key={next.species.name} className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-md`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              {next.evolution_details[0] && (
                <span className="text-[10px] text-gray-600 mt-1 text-center max-w-[80px] leading-tight">
                  {next.evolution_details[0].min_level
                    ? `Nv. ${next.evolution_details[0].min_level}`
                    : next.evolution_details[0].item
                    ? `${next.evolution_details[0].item.name.replace("-", " ")}`
                    : next.evolution_details[0].min_happiness
                    ? `Amistad`
                    : next.evolution_details[0].known_move
                    ? `${next.evolution_details[0].known_move.name.replace("-", " ")}`
                    : next.evolution_details[0].trigger?.name
                    ? `${next.evolution_details[0].trigger.name}`
                    : ""}
                </span>
              )}
            </div>
            {renderChain(next, theme)}
          </div>
        ))}
    </div>
  );
}

function extractId(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 2];
}

function calculateTypeRelations(
  types: { type: { name: string; url: string } }[],
  typeRelations: TypeResponse[]
) {
  const allTypes = [
    "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison",
    "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy",
  ];
  const multipliers: Record<string, number> = {};
  allTypes.forEach((t) => (multipliers[t] = 1));

  typeRelations.forEach((rel) => {
    rel.damage_relations.double_damage_from.forEach((d) => (multipliers[d.name] *= 2));
    rel.damage_relations.half_damage_from.forEach((d) => (multipliers[d.name] *= 0.5));
    rel.damage_relations.no_damage_from.forEach((d) => (multipliers[d.name] *= 0));
  });

  return {
    weaknesses: Object.keys(multipliers).filter((t) => multipliers[t] > 1),
    resistances: Object.keys(multipliers).filter((t) => multipliers[t] > 0 && multipliers[t] < 1),
    immunities: Object.keys(multipliers).filter((t) => multipliers[t] === 0),
  };
}