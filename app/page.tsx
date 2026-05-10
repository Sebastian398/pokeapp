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

  useEffect(() => {
    async function load() {
      const resList = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
      const dataList = await resList.json();
      setList(dataList.results);

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-black tracking-wide">
        Mi Pokédex
      </h1>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {list.map((item) => {
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
      <div className="mt-12 text-center">
        <Link href="/pokemon/daily"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
          Ver Pokémon del día
        </Link>
      </div>
    </main>
  );
}
