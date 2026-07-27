"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaBox } from "react-icons/fa";

interface ItemData {
  name: string;
  sprite: string;
  description: string;
}

export default function ItemsDexPage() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    async function loadItems() {
      try {
        // Obtenemos los primeros 200 objetos (cubre el 95% de objetos competitivos)
        const res = await fetch("https://pokeapi.co/api/v2/item?limit=200");
        const data = await res.json();
        
        // Fetch en paralelo de los detalles de cada objeto para obtener su descripción
        const itemsDetails = await Promise.all(
          data.results.map(async (item: any) => {
            const resDetail = await fetch(item.url);
            const detail = await resDetail.json();
            
            // Buscar descripción en español, si no, en inglés
            const flavorText = detail.effect_entries.find(
              (entry: any) => entry.language.name === "es"
            ) || detail.effect_entries.find(
              (entry: any) => entry.language.name === "en"
            );

            return {
              name: detail.names.find((n: any) => n.language.name === "es")?.name || detail.name,
              sprite: detail.sprites.default,
              description: flavorText ? flavorText.short_effect || flavorText.effect : "Sin descripción disponible.",
            };
          })
        );
        
        setItems(itemsDetails);
      } catch (error) {
        console.error("Error cargando objetos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={`${darkMode ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"} min-h-screen transition-colors duration-500 relative overflow-hidden`}>
      
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className={`p-3 rounded-full ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-lg transition-colors`}>
            <FaArrowLeft className="text-xl" />
          </Link>
          <div className="flex items-center gap-3">
            <FaBox className={`text-3xl ${darkMode ? "text-orange-400" : "text-orange-600"}`} />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Dex de Objetos Competitivos</h1>
          </div>
        </div>

        {/* Buscador y Toggle de Tema */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar objeto (ej: Leftovers, Choice Scarf)..."
              className={`w-full pl-4 pr-4 py-3 rounded-2xl border-2 ${
                darkMode 
                  ? "bg-gray-800/80 border-gray-700 text-white placeholder-gray-500 focus:border-orange-500" 
                  : "bg-white/80 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-orange-500"
              } backdrop-blur-md shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 text-base`}
            />
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-6 py-3 rounded-2xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              darkMode ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" : "bg-white hover:bg-gray-100 text-gray-700"
            }`}
          >
            {darkMode ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>

        {/* Lista de Objetos */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className={`group relative rounded-2xl p-5 border-2 transition-all duration-300 hover:scale-[1.02] ${
                  darkMode
                    ? "bg-gray-800/80 backdrop-blur-md border-gray-700 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10"
                    : "bg-white/80 backdrop-blur-md border-gray-200 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-400/10"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Sprite del objeto */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    {item.sprite ? (
                      <img src={item.sprite} alt={item.name} className="w-10 h-10 object-contain" />
                    ) : (
                      <FaBox className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  
                  {/* Info del objeto */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-lg capitalize mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {item.name}
                    </h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg font-medium`}>
              No se encontraron objetos
            </p>
          </div>
        )}
      </div>
    </main>
  );
}