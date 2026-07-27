"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaBox } from "react-icons/fa";

interface PokeAPINameEntry { name: string; language: { name: string }; }
interface PokeAPIEffectEntry { effect: string; short_effect: string; language: { name: string }; }
interface PokeAPIItemDetail { name: string; names: PokeAPINameEntry[]; effect_entries: PokeAPIEffectEntry[]; sprites: { default: string | null }; }
interface PokeAPIItemSummary { name: string; url: string; }
interface PokeAPIItemList { count: number; results: PokeAPIItemSummary[]; }
interface ItemData { name: string; sprite: string | null; description: string; }

export default function ItemsDexPage() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [darkMode, setDarkMode] = useState(true);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false); // 🔧 Nuevo estado

  // setTimeout evita el "cascading render"
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const timer = setTimeout(() => {
      if (saved !== null) {
        setDarkMode(saved === "true");
      }
      setIsThemeLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        const resCount = await fetch("https://pokeapi.co/api/v2/item?limit=1");
        if (!resCount.ok) throw new Error("No se pudo obtener la lista");
        const dataCount: PokeAPIItemList = await resCount.json();
        
        const res = await fetch(`https://pokeapi.co/api/v2/item?limit=${dataCount.count}&offset=0`);
        if (!res.ok) throw new Error("No se pudo obtener los objetos");
        const data: PokeAPIItemList = await res.json();

        const batchSize = 50;
        const allDetails: ItemData[] = [];

        for (let i = 0; i < data.results.length; i += batchSize) {
          const batch = data.results.slice(i, i + batchSize);
          const batchDetails = await Promise.all(
            batch.map(async (item: PokeAPIItemSummary): Promise<ItemData | null> => {
              try {
                const resDetail = await fetch(item.url);
                if (!resDetail.ok) return null;
                const detail: PokeAPIItemDetail = await resDetail.json();

                const flavorText = detail.effect_entries.find((e) => e.language.name === "es") || detail.effect_entries.find((e) => e.language.name === "en");
                const spanishName = detail.names.find((n) => n.language.name === "es")?.name || detail.name;

                return {
                  name: spanishName,
                  sprite: detail.sprites.default,
                  description: flavorText ? flavorText.short_effect || flavorText.effect : "Sin descripción disponible.",
                };
              } catch {
                return null;
              }
            })
          );
          allDetails.push(...batchDetails.filter((item): item is ItemData => item !== null));
        }
        setItems(allDetails);
      } catch (error) {
        console.error("Error cargando objetos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main 
      suppressHydrationWarning
      className={`${darkMode ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"} min-h-screen ${isThemeLoaded ? 'transition-colors duration-75' : ''} relative overflow-hidden`}
    >
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className={`p-3 rounded-full ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-lg transition-colors duration-75`}>
            <FaArrowLeft className="text-xl" />
          </Link>
          <div className="flex items-center gap-3">
            <FaBox className={`text-3xl ${darkMode ? "text-orange-400" : "text-orange-600"}`} />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Dex de Objetos</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar objeto (ej: Restos, Choice Scarf)..."
              className={`w-full pl-4 pr-4 py-3 rounded-2xl border-2 ${darkMode ? "bg-gray-800/80 border-gray-700 text-white placeholder-gray-500 focus:border-orange-500" : "bg-white/80 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500"} backdrop-blur-md shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-75 text-base`}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Cargando objetos...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg font-medium`}>No se encontraron objetos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map((item, index) => (
              <div key={index} className={`group relative rounded-2xl p-5 border-2 transition-all duration-75 hover:scale-[1.02] ${darkMode ? "bg-gray-800/80 backdrop-blur-md border-gray-700 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10" : "bg-white/80 backdrop-blur-md border-gray-200 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-400/10"}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    {item.sprite ? (
                      <img src={item.sprite} alt={item.name} className="w-10 h-10 object-contain" loading="lazy" />
                    ) : (
                      <FaBox className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-lg capitalize mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{item.name}</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}