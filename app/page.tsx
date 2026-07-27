"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaStar, FaRegStar, FaCheckCircle, FaSearch, FaMoon, FaSun, FaCalendarDay, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { Luckiest_Guy } from "next/font/google";
const luckiestGuy = Luckiest_Guy({ subsets: ["latin"], weight: "400" });

interface PokemonListItem {
  name: string;
  url: string;
}

type FilterType = "all" | "captured" | "favorites";
type SortOrder = "asc" | "desc";

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
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const resList = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1300");
        const dataList = await resList.json();
        setList(dataList.results);
        setFiltered(dataList.results);

        const resCol = await fetch("/api/collection");
        const col = await resCol.json();
        setCollection(col);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
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

  function applyFilterAndSort(filterType: FilterType, order: SortOrder, query: string = "") {
    let result = list;

    if (filterType === "captured") {
      result = list.filter((item) => {
        const id = item.url.split("/").at(-2)!;
        return collection.captured[id];
      });
    } else if (filterType === "favorites") {
      result = list.filter((item) => {
        const id = item.url.split("/").at(-2)!;
        return collection.favorites[id];
      });
    }

    if (query) {
      result = result.filter((item) => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    result = [...result].sort((a, b) => {
      const idA = parseInt(a.url.split("/").at(-2)!);
      const idB = parseInt(b.url.split("/").at(-2)!);
      return order === "asc" ? idA - idB : idB - idA;
    });

    setFiltered(result);
  }

  function handleFilter(type: FilterType) {
    setActiveFilter(type);
    applyFilterAndSort(type, sortOrder, search);
    setMenuOpen(false);
  }

  function handleSort() {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    applyFilterAndSort(activeFilter, newOrder, search);
  }

  function handleDaily() {
    window.location.href = "/pokemon/daily";
    setMenuOpen(false);
  }

  function handleSearch(query: string) {
    setSearch(query);
    applyFilterAndSort(activeFilter, sortOrder, query);
  }

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

  const capturedCount = Object.keys(collection.captured || {}).length;
  const favoritesCount = Object.keys(collection.favorites || {}).length;

  return (
    <main className={`${darkMode ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"} min-h-screen transition-colors duration-500 relative overflow-hidden`}>
      
      {/* Pokeball decorativo de fondo */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <div className="w-[1200px] h-[1200px] rounded-full border-[60px] border-current relative">
          <div className="absolute top-1/2 left-0 right-0 h-[60px] bg-current -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full border-[60px] border-current bg-transparent" />
        </div>
      </div>

      {/* Partículas decorativas */}
      <div className={`absolute top-20 left-20 w-3 h-3 ${darkMode ? "bg-cyan-400" : "bg-blue-400"} rounded-full animate-pulse opacity-30`} />
      <div className={`absolute top-40 right-32 w-2 h-2 ${darkMode ? "bg-purple-400" : "bg-purple-400"} rounded-full animate-pulse opacity-30`} style={{ animationDelay: "0.3s" }} />
      <div className={`absolute bottom-32 left-40 w-4 h-4 ${darkMode ? "bg-pink-400" : "bg-pink-400"} rounded-full animate-pulse opacity-30`} style={{ animationDelay: "0.7s" }} />
      <div className={`absolute bottom-20 right-20 w-2 h-2 ${darkMode ? "bg-yellow-400" : "bg-yellow-400"} rounded-full animate-pulse opacity-30`} style={{ animationDelay: "0.5s" }} />

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* HEADER */}
        <header className="text-center mb-8">
          <h1
            className={`${luckiestGuy.className} text-6xl sm:text-7xl lg:text-8xl mb-3 font-bold tracking-wide
              ${darkMode 
                ? "text-yellow-400 drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)] [text-shadow:3px_3px_0_#0033a0,6px_6px_0_#000]" 
                : "text-yellow-500 drop-shadow-[3px_3px_0_rgba(0,0,0,0.3)] [text-shadow:3px_3px_0_#0033a0,6px_6px_0_rgba(0,0,0,0.2)]"}`}
          >
            Mi Pokédex
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm sm:text-base font-medium`}>
            Atrapa, colecciona y descubre todos los Pokémon
          </p>
        </header>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
          <div className={`${darkMode ? "bg-gray-800/80 border-cyan-500/30" : "bg-white/80 border-blue-300"} backdrop-blur-md border-2 rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform duration-300 text-center`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaCheckCircle className={`${darkMode ? "text-cyan-400" : "text-blue-600"} text-xl`} />
              <p className={`text-sm font-bold uppercase tracking-wider ${darkMode ? "text-cyan-400" : "text-blue-600"}`}>
                Atrapados
              </p>
            </div>
            <p className={`text-3xl font-extrabold text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
              {capturedCount}
            </p>
          </div>

          <div className={`${darkMode ? "bg-gray-800/80 border-yellow-500/30" : "bg-white/80 border-yellow-300"} backdrop-blur-md border-2 rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform duration-300 text-center`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaStar className={`${darkMode ? "text-yellow-400" : "text-yellow-500"} text-xl`} />
              <p className={`text-sm font-bold uppercase tracking-wider ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                Favoritos
              </p>
            </div>
            <p className={`text-3xl font-extrabold text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
              {favoritesCount}
            </p>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"} text-lg`} />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar Pokémon por nombre..."
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 ${
                darkMode 
                  ? "bg-gray-800/80 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500" 
                  : "bg-white/80 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500"
              } backdrop-blur-md shadow-lg focus:outline-none focus:ring-4 ${darkMode ? "focus:ring-cyan-500/20" : "focus:ring-blue-500/20"} transition-all duration-300 text-base`}
            />
          </div>

          {/* Filtros y orden */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => handleFilter("all")}
              className={`px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 ${
                activeFilter === "all"
                  ? darkMode
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/50"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/50"
                  : darkMode
                  ? "bg-gray-800 text-gray-300 border border-gray-700 hover:border-cyan-500"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => handleFilter("captured")}
              className={`px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 flex items-center gap-2 ${
                activeFilter === "captured"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/50"
                  : darkMode
                  ? "bg-gray-800 text-gray-300 border border-gray-700 hover:border-green-500"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-green-500"
              }`}
            >
              <FaCheckCircle className="text-xs" />
              Atrapados
            </button>
            <button
              onClick={() => handleFilter("favorites")}
              className={`px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 flex items-center gap-2 ${
                activeFilter === "favorites"
                  ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-500/50"
                  : darkMode
                  ? "bg-gray-800 text-gray-300 border border-gray-700 hover:border-yellow-500"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-yellow-500"
              }`}
            >
              <FaStar className="text-xs" />
              Favoritos
            </button>

            {/* Botón de orden */}
            <button
              onClick={handleSort}
              className={`px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 flex items-center gap-2 ${
                darkMode
                  ? "bg-gray-800 text-gray-300 border border-gray-700 hover:border-purple-500 hover:text-purple-400"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-purple-500 hover:text-purple-600"
              }`}
              title={sortOrder === "asc" ? "Orden ascendente (ID)" : "Orden descendente (ID)"}
            >
              {sortOrder === "asc" ? (
                <>
                  <FaSortAmountDown className="text-xs" />
                  <span>Ascendente</span>
                </>
              ) : (
                <>
                  <FaSortAmountUp className="text-xs" />
                  <span>Descendente</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* LISTA DE POKÉMON */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <img
                src="/pokebola3.png"
                alt="Cargando"
                className="w-20 h-20 animate-spin"
              />
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg font-medium`}>
              No se encontraron Pokémon
            </p>
            <p className={`${darkMode ? "text-gray-500" : "text-gray-500"} text-sm mt-2`}>
              Intenta con otro nombre o filtro
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {filtered.map((item) => {
              const id = item.url.split("/").at(-2)!;
              const isCaptured = !!collection.captured[id];
              const isFavorite = !!collection.favorites[id];

              return (
                <li
                  key={item.name}
                  className={`group relative rounded-3xl p-4 text-center border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                    darkMode
                      ? "bg-gray-800/80 backdrop-blur-md border-gray-700 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20"
                      : "bg-white/80 backdrop-blur-md border-gray-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20"
                  }`}
                >
                  <Link href={`/pokemon/${item.name}`} className="block cursor-pointer">
                    <div>
                      <div className={`text-xs font-bold mb-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        #{id.padStart(3, "0")}
                      </div>
                      
                      {/* Imagen con fondo circular */}
                      <div className="relative mb-3">
                        <div className={`absolute inset-0 ${darkMode ? "bg-gradient-to-br from-cyan-500/10 to-purple-500/10" : "bg-gradient-to-br from-blue-200/30 to-purple-200/30"} rounded-full blur-xl scale-110 group-hover:scale-125 transition-transform duration-300`} />
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                          alt={item.name}
                          className="relative w-28 h-28 mx-auto object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      <p className={`font-bold text-base capitalize ${darkMode ? "text-white" : "text-gray-900"} group-hover:${darkMode ? "text-cyan-400" : "text-blue-600"} transition-colors duration-300`}>
                        {item.name}
                      </p>
                    </div>
                  </Link>

                  {/* Botones de acción */}
                  <div className="flex justify-center gap-3 mt-3 pt-3 border-t border-gray-200/20">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCaptured(id, isCaptured);
                      }}
                      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                        isCaptured
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                          : darkMode
                          ? "bg-gray-700 text-gray-400 hover:bg-green-500 hover:text-white"
                          : "bg-gray-100 text-gray-400 hover:bg-green-500 hover:text-white"
                      }`}
                      title={isCaptured ? "Desmarcar como atrapado" : "Marcar como atrapado"}
                    >
                      <FaCheckCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(id, isFavorite);
                      }}
                      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                        isFavorite
                          ? "bg-yellow-400 text-white shadow-lg shadow-yellow-400/50"
                          : darkMode
                          ? "bg-gray-700 text-gray-400 hover:bg-yellow-400 hover:text-white"
                          : "bg-gray-100 text-gray-400 hover:bg-yellow-400 hover:text-white"
                      }`}
                      title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      {isFavorite ? (
                        <FaStar className="w-4 h-4" />
                      ) : (
                        <FaRegStar className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* BOTÓN FLOTANTE CON MENÚ */}
      <div className="fixed bottom-6 right-6 z-50">
        {!menuOpen && (
          <button
            id="menu-button"
            onClick={() => setMenuOpen(true)}
            className="rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          >
            <img
              src="/pokebola3.png"
              alt="Pokébola"
              className="w-14 h-14 object-contain drop-shadow-lg group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-300"
            />
          </button>
        )}

        {menuOpen && (
          <div
            id="floating-menu"
            className={`rounded-2xl p-4 w-72 shadow-2xl border-2 transition-all duration-300 ${
              darkMode
                ? "bg-gray-800/95 backdrop-blur-md border-cyan-500/50 text-white"
                : "bg-white/95 backdrop-blur-md border-blue-500/50 text-gray-900"
            }`}
          >
            <div className="space-y-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? "hover:bg-gray-700 hover:text-cyan-400"
                    : "hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
                <span className="font-medium">{darkMode ? "Modo Claro" : "Modo Oscuro"}</span>
              </button>

              <button
                onClick={handleDaily}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? "hover:bg-gray-700 hover:text-cyan-400"
                    : "hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                <FaCalendarDay className={`${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                <span className="font-medium">Pokémon del día</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}