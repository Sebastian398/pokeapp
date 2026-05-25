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

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${value}`);
  if (!res.ok) {
    throw new Error(`Pokémon no encontrado con id/nombre: ${value}`);
  }
  return res.json();
}

