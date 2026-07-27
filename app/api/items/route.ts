import { NextResponse } from 'next/server';

// 🔧 Tipos TypeScript para la PokeAPI
interface PokeAPILanguage {
  name: string;
}

interface PokeAPINameEntry {
  name: string;
  language: PokeAPILanguage;
}

interface PokeAPIEffectEntry {
  effect: string;
  short_effect: string;
  language: PokeAPILanguage;
}

interface PokeAPIItemSprites {
  default: string | null;
}

interface PokeAPIItemDetail {
  name: string;
  names: PokeAPINameEntry[];
  effect_entries: PokeAPIEffectEntry[];
  sprites: PokeAPIItemSprites;
}

interface PokeAPIItemSummary {
  name: string;
  url: string;
}

interface PokeAPIItemList {
  count: number;
  results: PokeAPIItemSummary[];
}

interface ProcessedItem {
  name: string;
  sprite: string | null;
  description: string;
}

// Caché de 24 horas
export const revalidate = 86400;

export async function GET() {
  try {
    // 1. Obtener la lista completa de objetos
    const resList = await fetch('https://pokeapi.co/api/v2/item?limit=2000');
    if (!resList.ok) throw new Error('No se pudo obtener la lista');
    const dataList: PokeAPIItemList = await resList.json();

    // 2. Procesar en batches de 100
    const batchSize = 100;
    const allItems: ProcessedItem[] = [];

    for (let i = 0; i < dataList.results.length; i += batchSize) {
      const batch = dataList.results.slice(i, i + batchSize);
      
      const batchDetails = await Promise.all(
        batch.map(async (item: PokeAPIItemSummary): Promise<ProcessedItem | null> => {
          try {
            const resDetail = await fetch(item.url);
            if (!resDetail.ok) return null;
            const detail: PokeAPIItemDetail = await resDetail.json();
            
            const flavorText = detail.effect_entries.find((e) => e.language.name === 'es') 
              || detail.effect_entries.find((e) => e.language.name === 'en');
            
            const spanishName = detail.names.find((n) => n.language.name === 'es')?.name || detail.name;

            return {
              name: spanishName,
              sprite: detail.sprites.default,
              description: flavorText ? (flavorText.short_effect || flavorText.effect) : 'Sin descripción disponible.',
            };
          } catch {
            return null;
          }
        })
      );
      
      allItems.push(...batchDetails.filter((item): item is ProcessedItem => item !== null));
    }

    return NextResponse.json(allItems);
  } catch (error) {
    console.error('Error en API de items:', error);
    return NextResponse.json({ error: 'Error al cargar los objetos' }, { status: 500 });
  }
}