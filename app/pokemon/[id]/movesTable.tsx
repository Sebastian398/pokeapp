"use client";
import React, { useState, useEffect } from "react";
import { MoveDetailed } from "@/types/move";

export default function MovesTable({ groupedMoves }: { groupedMoves: Record<string, MoveDetailed[]> }) {
  const [filter, setFilter] = useState("level-up");
  const [selectedMove, setSelectedMove] = useState<string | null>(null);

  // Ocultar descripción automáticamente después de 5 segundos
  useEffect(() => {
    if (selectedMove) {
      const timer = setTimeout(() => setSelectedMove(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedMove]);

  const categoriesColors: Record<string, string> = {
    physical: "text-red-600 font-bold",
    special: "text-blue-600 font-bold",
    status: "text-gray-600 italic",
  };

  return (
    <div>
      {/* Botones de filtro */}
      <div className="flex gap-2 mb-4 justify-center text-black">
        <button onClick={() => setFilter("level-up")} className={`px-3 py-1 rounded ${filter==="level-up" ? "bg-blue-200" : "bg-gray-100"}`}>Nivel</button>
        <button onClick={() => setFilter("machine")} className={`px-3 py-1 rounded ${filter==="machine" ? "bg-blue-200" : "bg-gray-100"}`}>MT/MO</button>
        <button onClick={() => setFilter("tutor")} className={`px-3 py-1 rounded ${filter==="tutor" ? "bg-blue-200" : "bg-gray-100"}`}>Tutor</button>
        <button onClick={() => setFilter("egg")} className={`px-3 py-1 rounded ${filter==="egg" ? "bg-blue-200" : "bg-gray-100"}`}>Huevo</button>
      </div>

      {/* Tabla o mensaje */}
{groupedMoves[filter] && groupedMoves[filter].length > 0 ? (
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-300 text-sm">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-2 py-1 text-left text-black">Movimiento</th>
          {filter === "level-up" && <th className="px-2 py-1 text-left text-black">Nivel</th>}
          <th className="px-2 py-1 text-left text-black">Potencia</th>
          <th className="px-2 py-1 text-left text-black">Precisión</th>
          <th className="px-2 py-1 text-left text-black">Categoría</th>
        </tr>
      </thead>
      <tbody>
        {groupedMoves[filter].map((m) => (
          <React.Fragment key={m.name}>
            <tr className="odd:bg-white even:bg-gray-50">
              <td
                className="px-2 py-1 capitalize text-black cursor-pointer hover:underline"
                onClick={() => setSelectedMove(m.name)}
              >
                {m.name.replace("-", " ")}
              </td>
              {filter === "level-up" && <td className="px-2 py-1 text-black">{m.level}</td>}
              <td className="px-2 py-1 text-xs sm:text-sm text-black whitespace-nowrap">{m.power}</td>
              <td className="px-2 py-1 text-black">{m.accuracy}</td>
              <td className={`px-2 py-1 capitalize ${categoriesColors[m.category] || "text-black"}`}>
                {m.category}
              </td>
            </tr>

            {selectedMove === m.name && (
              <tr>
                <td colSpan={5} className="px-2 py-1 text-gray-600 italic bg-gray-100">
                  {m.description}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-center text-gray-500 italic">
    Ningún movimiento se puede aprender por este método
  </p>
)}

    </div>
  );
}
