"use client";

import { useEffect, useState } from "react";
import { Collection } from "@/types/collection";
import Link from "next/link";
import { FaStar, FaRegStar, FaCheckCircle } from "react-icons/fa";

interface PokemonListItem {
  name: string;
  url: string;
}

export default function Home() {
  const [collection, setCollection] = useState<Collection>({
    captured: {},
    favorites: {},
  });
  const [list, setList] = useState<PokemonListItem[]>([]);
  const [filtered, setFiltered] = useState<PokemonListItem[]>([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

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
  }

  function handleDaily() {
    window.location.href = "/pokemon/daily";
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

  return (
    <main className={`${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-gray-100 to-gray-200 text-black"} min-h-screen p-6`}>
      
      {/* Título estilo Pokébola con variación en modo oscuro */}
      <h1 className={`text-6xl font-extrabold text-center mb-6 
        ${darkMode 
          ? "bg-gradient-to-b from-white to-gray-300 [text-shadow:2px_2px_0_black]" 
          : "bg-gradient-to-b from-red-600 to-white [text-shadow:2px_2px_0_black]"} 
        bg-clip-text text-transparent drop-shadow-lg`}>
        Mi Pokédex
      </h1>

      {/* Estadísticas */}
      <div className="flex justify-center gap-10 mb-8">
        <div className={`${darkMode ? "bg-gray-800 border border-gray-600" : "bg-white"} shadow rounded-lg p-4 text-center`}>
          <p className="text-xl font-bold text-red-600">Atrapados</p>
          <p className={`${darkMode ? "text-black" : "text-black"} text-2xl`}>
            {Object.keys(collection.captured).length}
          </p>
        </div>
        <div className={`${darkMode ? "bg-gray-800 border border-gray-600" : "bg-white"} shadow rounded-lg p-4 text-center`}>
          <p className="text-xl font-bold text-yellow-500">Favoritos</p>
          <p className={`${darkMode ? "text-black" : "text-black"} text-2xl`}>
            {Object.keys(collection.favorites).length}
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
              className={`rounded-xl shadow-lg p-4 text-center border transition-transform transform hover:scale-105 
                ${darkMode ? "bg-gray-800 border-gray-700 hover:border-blue-400" : "bg-white hover:border-blue-400 hover:shadow-xl"}`}
            >
              <Link href={`/pokemon/${id}`} className="block cursor-pointer">
                <div>
                  <div className="text-xs text-gray-500 mb-2">#{id}</div>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                    alt={item.name}
                    className="w-20 h-20 mx-auto mb-2"
                    loading="lazy"
                  />
                  <p className="font-semibold text-lg capitalize">{item.name}</p>
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
        <button
          onClick={() => {
            const menu = document.getElementById("floating-menu");
            if (menu) menu.classList.toggle("hidden");
          }}
          className="bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-blue-700"
        >
          ☰
        </button>

        <div id="floating-menu" className="hidden bg-white shadow-lg rounded-lg p-4 mt-2 w-56 border-blue-600 border">
          <button
            onClick={() => handleFilter("captured")}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-black"
          >
            Mostrar atrapados
          </button>
          <button
            onClick={() => handleFilter("favorites")}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-black"
          >
            Mostrar favoritos
          </button>
          <button
            onClick={handleDaily}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-black"
          >
            Pokémon del día
          </button>
          <div className="mt-2">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full border rounded px-2 py-1 text-sm placeholder-black text-black"
            />
          </div>
          {/* Botón de modo oscuro dentro del menú */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="block w-full text-left px-3 py-2 mt-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            {darkMode ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>
      </div>
    </main>
  );
}
