// src/types/pokemon.ts

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      ["official-artwork"]: { front_default: string };
    };
  };
  types: { type: { name: string; url: string } }[];
  abilities: { ability: { name: string; url: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  moves: {
    move: { name: string; url: string };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: { name: string };
      version_group: { name: string };
    }[];
  }[];
}

export interface DamageRelations {
  double_damage_from: { name: string; url: string }[];
  half_damage_from: { name: string; url: string }[];
  no_damage_from: { name: string; url: string }[];
}

export interface TypeResponse {
  damage_relations: DamageRelations;
}

export interface EvolutionDetail {
  min_level: number | null;
  trigger: { name: string } | null;
}

export interface EvolutionNode {
  species: { name: string; url: string };
  evolves_to: EvolutionNode[];
  evolution_details: EvolutionDetail[];
}
