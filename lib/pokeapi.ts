import { Pokemon } from "@/types/pokemon";

type Summary = {
  name: string;
  url: string;
};

type PokemonList = {
  results: Summary[];
  next: string | null;
};

export async function fetchPokemonList(offset = 0): Promise<PokemonList> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=2000&offset=${offset}`
  );
  if (!res.ok) throw new Error("Error al obtener lista de Pokémon");
  return res.json();
}

export async function fetchPokemon(idOrName: string | number) {
  const value = String(idOrName).trim();
  if (!value) {
    throw new Error("El parámetro idOrName está vacío");
  }

  // Intentar primero con /pokemon
  let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`);
  if (!res.ok) {
    // Si falla, probar con /pokemon-form
    res = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${value}`);
    if (!res.ok) {
      throw new Error(`Pokémon o forma no encontrada: ${value}`);
    }
  }

  const data = await res.json();

  // Si es un form, trae también el Pokémon base para stats/habilidades
  if (data.pokemon) {
    const baseRes = await fetch(data.pokemon.url);
    if (!baseRes.ok) throw new Error("Error al obtener datos base del Pokémon");
    const baseData = await baseRes.json();
    return { ...baseData, form: data }; // 👈 devuelves ambos
  }

  return data;
}

