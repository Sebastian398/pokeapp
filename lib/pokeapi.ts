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

export async function fetchPokemon(idOrName: string): Promise<Pokemon> {
  // Corrección: si llega vacío, devolvemos un error más claro
  if (!idOrName || idOrName.trim() === "") {
    return Promise.reject("ID o nombre de Pokémon vacío");
  }

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
  if (!res.ok) {
    throw new Error(`Pokémon no encontrado con id/nombre: ${idOrName}`);
  }
  return res.json();
}
