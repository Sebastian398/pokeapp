"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaStar, FaRegStar, FaCheckCircle } from "react-icons/fa";

interface PokemonListItem {
  name: string;
  url: string;
}

export default function Home() {
  const [collection, setCollection] = useState<{ captured: Record<string, boolean>, favorites: Record<string, boolean> }>({
  captured: {},
  favorites: {},
});

  const [list, setList] = useState<PokemonListItem[]>([]);
  const [filtered, setFiltered] = useState<PokemonListItem[]>([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    async function load() {
      const resList = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1900");
      const dataList = await resList.json();
      setList(dataList.results);
      setFiltered(dataList.results);

      const resCol = await fetch("/api/collection");
      const col = await resCol.json();
      setCollection(col);
    }
    load();
  }, []);

  async function toggleCaptured(id: string, current: boolean) {
    const res = await fetch("/api/collection", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, captured: !current }),
    });
    const updated = await res.json();
    setCollection(updated);
  }

  async function toggleFavorite(id: string, current: boolean) {
    const res = await fetch("/api/collection", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, favorite: !current }),
    });
    const updated = await res.json();
    setCollection(updated);
  }

  function handleFilter(type: "all" | "captured" | "favorites") {
    if (type === "captured") {
      setFiltered(list.filter((item) => {
        const id = item.url.split("/").at(-2)!;
        return collection.captured[id];
      }));
    } else if (type === "favorites") {
      setFiltered(list.filter((item) => {
        const id = item.url.split("/").at(-2)!;
        return collection.favorites[id];
      }));
    } else {
      setFiltered(list);
    }
      setMenuOpen(false);
  }

  function handleDaily() {
    window.location.href = "/pokemon/daily";
    setMenuOpen(false);
  }

  function handleSearch(query: string) {
    setSearch(query);
    if (!query) {
      setFiltered(list);
      return;
    }
    setFiltered(
      list.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const menu = document.getElementById("floating-menu");
      const button = document.getElementById("menu-button");
      if (menuOpen && menu && !menu.contains(e.target as Node) && !button?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <main className={`${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-gray-50 to-gray-200 text-black"} min-h-screen p-6`}>
      
      {/* Título */}
      <h1 className={`text-6xl font-extrabold text-center mb-6 
        ${darkMode 
          ? "bg-gradient-to-b from-red-600 to-black [text-shadow:2px_2px_0_white]" 
          : "bg-gradient-to-b from-red-600 to-white [text-shadow:2px_2px_0_black]"} 
        bg-clip-text text-transparent drop-shadow-lg`}>
        Mi Pokédex
      </h1>

      {/* Estadísticas */}
      <div className="flex justify-center gap-10 mb-8">
        <div className={`neon-card shadow p-4 text-center ${darkMode ? "bg-gray-900" : "bg-white"}`}>
          <p className={`text-xl font-bold ${darkMode ? "text-cyan-400" : "text-cyan-600"}`}>Atrapados</p>          <p className={`${darkMode ? "text-white" : "text-black"} text-2xl`}>
            {Object.keys(collection.captured || {}).length}
          </p>
        </div>
        <div className={`neon-card shadow rounded-lg p-4 text-center ${darkMode ? "bg-gray-900" : "bg-white"}`}>
          <p className={`text-xl font-bold ${darkMode ? "text-purple-400" : "text-purple-500"}`}>Favoritos</p>
          <p className={`${darkMode ? "text-white" : "text-black"} text-2xl`}>
            {Object.keys(collection.favorites || {}).length}
          </p>
        </div>
      </div>

      {/* Lista de Pokémon */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filtered.map((item) => {
          const id = item.url.split("/").at(-2)!;
          const isCaptured = !!collection.captured[id];
          const isFavorite = !!collection.favorites[id];

          return (
            <li
              key={item.name}
              className={`rounded-2xl shadow-lg p-4 text-center border transition-all duration-300 transform hover:scale-105
                ${darkMode
                  ? "bg-gray-800 border-cyan-700 hover:border-purple-400 hover:shadow-purple-500/30"
                  : "bg-white border-purple-700 hover:border-cyan-400 hover:shadow-cyan-500/30"}`
              }
            >
              <Link href={`/pokemon/${item.name}`} className="block cursor-pointer">
                <div>
                  <div className="text-xs text-gray-400 mb-2">#{id}</div>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                    alt={item.name}
                    className="w-24 h-24 mx-auto mb-2 drop-shadow-md"
                    loading="lazy"
                  />
                  <p className="font-bold text-lg capitalize">{item.name}</p>
                </div>
              </Link>
              
              <div className="flex justify-center gap-4 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCaptured(id, isCaptured);
                  }}
                  className="text-green-600 hover:text-green-700"
                >
                  <FaCheckCircle
                    className={`w-6 h-6 ${isCaptured ? "fill-current" : "opacity-30"}`}
                  />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(id, isFavorite);
                  }}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  {isFavorite ? (
                    <FaStar className="w-6 h-6 fill-current" />
                  ) : (
                    <FaRegStar className="w-6 h-6" />
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Botón flotante con menú */}
      <div className="fixed bottom-6 right-6">
        {!menuOpen && (
          <button
            id="menu-button"
            onClick={() => setMenuOpen(true)}
            className="rounded-full w-16 h-16 shadow-lg hover:border-cyan-500 hover:shadow-cyan-500/30 flex items-center justify-center transition-transform hover:scale-105"
          >
            <img
            src="/pokebola3.png"
            alt="Pokébola"
            className="w-15 h-15 object-contain"
          />
          </button>

        )}

        {menuOpen && (
          <div
            id="floating-menu"
            className={`rounded-2xl p-4 mt-2 w-64 transition-all duration-300
              ${darkMode
                ? "bg-gray-800 text-white shadow-lg border border-cyan-500"
                : "bg-white text-black shadow-lg border border-purple-500"}`}
          >
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700 hover:text-cyan-400 transition-colors"
            >
              {darkMode ? "Modo Claro" : "Modo Oscuro"}
            </button>
            <button
              onClick={() => handleFilter("captured")}
              className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700 hover:text-cyan-400 transition-colors"
            >
              Mostrar atrapados
            </button>
            <button
              onClick={() => handleFilter("favorites")}
              className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700 hover:text-cyan-400 transition-colors"
            >
              Mostrar favoritos
            </button>
            <button
              onClick={() => handleFilter("all")}
              className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700 hover:text-cyan-400 transition-colors"
            >
              Mostrar todos
            </button>
            <button
              onClick={handleDaily}
              className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700 hover:text-cyan-400 transition-colors"
            >
              Pokémon del día
            </button>
            <div className="mt-3">
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full border rounded px-2 py-1 text-sm placeholder-gray-400 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>)}
      </div>
    </main>
  );
}
