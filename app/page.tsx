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

  //Filtrado
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

  //pokemon del día
  function handleDaily() {
    window.location.href = "/pokemon/daily";
  }

  //Búsqueda
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
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
        Mi Pokédex
      </h1>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filtered.map((item) => {
          const id = item.url.split("/").at(-2)!;
          const isCaptured = !!collection.captured[id];
          const isFavorite = !!collection.favorites[id];

          return (
            <li
              key={item.name}
              className="bg-white rounded-xl shadow-lg p-4 text-center border hover:border-blue-400 hover:shadow-xl transition-transform transform hover:scale-105"
            >
              {/* Card con Link */}
              <Link href={`/pokemon/${id}`} className="block cursor-pointer">
                <div>
                  <div className="text-xs text-gray-500 mb-2">#{id}</div>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                    alt={item.name}
                    className="w-20 h-20 mx-auto mb-2"
                  />
                  <p className="font-semibold text-lg capitalize text-black">{item.name}</p>
                </div>
              </Link>

              {/* Botones con stopPropagation */}
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
          <div className="mt-2" >
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full border rounded px-2 py-1 text-sm placeholder-black text-black"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
