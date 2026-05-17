// src/app/pokemon/[id]/page.tsx
import { fetchPokemon } from "@/lib/pokeapi";
import { Collection } from "@/types/collection";
import { EvolutionNode, Pokemon, TypeResponse } from "@/types/pokemon";
import AbilityList from "./AbilityList";
import { JSX } from "react";

export default async function PokemonDetail(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const pokemon: Pokemon = await fetchPokemon(id);
  
  // descripción de species
  const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const species = await resSpecies.json();
  const descriptionEntry = species.flavor_text_entries.find(
    (entry: { language: { name: string } }) => entry.language.name === "es"
  );
  const description = descriptionEntry
    ? descriptionEntry.flavor_text.replace(/\n|\f/g, " ")
    : "Sin descripción disponible";

  // Tipos y relaciones de daño
  const typeRelations = await Promise.all(
    pokemon.types.map(async (t) => {
      const resType = await fetch(t.type.url);
      return resType.json() as Promise<TypeResponse>;
    })
  );
  const combinedRelations = {
    double_damage_from: new Set<string>(),
    half_damage_from: new Set<string>(),
    no_damage_from: new Set<string>(),
  };
  typeRelations.forEach((rel) => {
    rel.damage_relations.double_damage_from.forEach((d) =>
      combinedRelations.double_damage_from.add(d.name)
    );
    rel.damage_relations.half_damage_from.forEach((d) =>
      combinedRelations.half_damage_from.add(d.name)
    );
    rel.damage_relations.no_damage_from.forEach((d) =>
      combinedRelations.no_damage_from.add(d.name)
    );
  });

  // Cadena evolutiva
  const resChain = await fetch(species.evolution_chain.url);
  const chain = await resChain.json();

  let collection: Collection;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collection`);
    collection = await res.json();
  } catch {
    collection = { captured: {}, favorites: {} };
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-center capitalize mb-2 text-black">
          {pokemon.name}
        </h1>
        <p className="text-center text-gray-500 mb-4">#{pokemon.id}</p>
        {/* Sprites normal y shiny */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex flex-col items-center">
            <img
              src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-40 h-40"
            />
            <span className="text-xs text-gray-600">Normal</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={pokemon.sprites.front_shiny}
              alt={`${pokemon.name} shiny`}
              className="w-40 h-40"
            />
            <span className="text-xs text-gray-600">Shiny</span>
          </div>
        </div>
        
        {/* Tipos */}
        <div className="flex justify-center gap-2 mb-4">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className="px-3 py-1 rounded text-white capitalize font-semibold"
              style={{ backgroundColor: getTypeColor(t.type.name) }}
            >
              {t.type.name}
            </span>
          ))}
        </div>

        {/* Habilidades */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2 text-black">Habilidades</h2>
          <AbilityList abilities={pokemon.abilities} />
        </div>

        {/* Descripción */}
        <p className="text-gray-700 italic mb-6">{description}</p>
        
        {/* Stats */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2 text-black">Estadísticas</h2>
          <ul>
            {pokemon.stats.map((s) => (
              <li key={s.stat.name} className="text-sm capitalize mb-2 text-black">
                <div className="flex justify-between">
                  <span>{s.stat.name.replace("-", " ")}</span>
                  <span>{s.base_stat}</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-3 mt-1">
                  <div
                    className={`h-3 rounded ${getStatColorByValue(s.base_stat)}`}
                    style={{ width: `${Math.min(s.base_stat, 200) / 2}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Movimientos */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2 text-black">Movimientos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1 text-left text-black">Movimiento</th>
                  <th className="px-2 py-1 text-left text-black">Método</th>
                  <th className="px-2 py-1 text-left text-black">Nivel</th>
                </tr>
              </thead>
              <tbody>
                {pokemon.moves.slice(0, 20).map((m) => (
                  <tr key={m.move.name} className="odd:bg-white even:bg-gray-50">
                    <td className="px-2 py-1 capitalize text-black">
                      {m.move.name.replace("-", " ")}
                    </td>
                    <td className="px-2 py-1 text-black">
                      {m.version_group_details[0]?.move_learn_method.name || "—"}
                    </td>
                    <td className="px-2 py-1 text-black">
                      {m.version_group_details[0]?.level_learned_at || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Debilidades y resistencias */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2 text-black">Debilidades y Resistencias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-black">
            <div className="bg-red-100 p-3 rounded">
              <p className="font-bold text-red-700">Débil contra</p>
              <p>{[...combinedRelations.double_damage_from].join(", ") || "Ninguno"}</p>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <p className="font-bold text-green-700">Resistente contra</p>
              <p>{[...combinedRelations.half_damage_from].join(", ") || "Ninguno"}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded">
              <p className="font-bold text-blue-700">Inmune contra</p>
              <p>{[...combinedRelations.no_damage_from].join(", ") || "Ninguno"}</p>
            </div>
          </div>
        </div>

      {/* Cadena evolutiva */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2 text-black">Cadena Evolutiva</h2>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {renderChain(chain.chain)}
          </div>
        </div>
      </div>
    </main>
  );
}

function renderChain(node: EvolutionNode): JSX.Element {
  return (
    <div className="flex items-center gap-6">
      {/* Pokémon actual */}
      <div className="flex flex-col items-center">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${extractId(node.species.url)}.png`}
          alt={node.species.name}
          className="w-15 h-15 max-w-[70px] max-h-[70px] object-contain"
        />
        <span className="capitalize font-bold text-black">{node.species.name}</span>
      </div>

      {/* Evoluciones */}
      {node.evolves_to.length > 0 && node.evolves_to.map((next: EvolutionNode) => (
        <div key={next.species.name} className="flex items-center gap-6 text-s">
          <div className="flex flex-col items-center">
            <span className="text-4xl text-blue-900">→</span>
            {next.evolution_details[0] && (
              <span className="text-xs text-green-600">
                {next.evolution_details[0].min_level
                  ? `Nivel ${next.evolution_details[0].min_level}`
                  : next.evolution_details[0].trigger?.name
                  ? `Por ${next.evolution_details[0].trigger.name}`
                  : ""}
              </span>
            )}
          </div>
          {renderChain(next)}
        </div>
      ))}
    </div>
  );
}

// Helper para extraer el ID del URL de species
function extractId(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 2];
}


// Colores dinámicos para tipos
function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    fire: "red", water: "blue", grass: "green", electric: "gold",
    fairy: "pink", flying: "lightblue", ice: "cyan", dark: "black",
    fighting: "brown", ground: "sienna", poison: "purple", normal: "gray",
    steel: "lightgray", bug: "olive", psychic: "magenta", ghost: "indigo",
    dragon: "blueviolet", rock: "burlywood"
  };
  return colors[type] || "gray";
}

function getStatColorByValue(value: number): string {
  if (value < 40) return "bg-red-500";       // Muy bajo
  if (value < 60) return "bg-orange-500";    // Bajo
  if (value < 80) return "bg-yellow-500";    // Medio
  if (value < 100) return "bg-blue-500";     // Bueno
  return "bg-green-500";                     // Excelente
}
