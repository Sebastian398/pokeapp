// AbilityItem.tsx
"use client";
import { useState, useEffect } from "react";

export default function AbilityItem({ ability }: { ability: { name: string; url: string } }) {
  const [desc, setDesc] = useState<string | null>(null);

  useEffect(() => {
    if (desc) {
      const timer = setTimeout(() => setDesc(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [desc]);

  async function handleClick() {
    if (!ability?.url) return;
    const res = await fetch(ability.url);
    const data = await res.json();
    const entry = data.effect_entries.find(
      (e: { language: { name: string } }) => e.language.name === "es"
    ) || data.effect_entries.find(
      (e: { language: { name: string } }) => e.language.name === "en"
    );
    setDesc(entry ? entry.short_effect : "Sin descripción disponible");
  }

  return (
    <li>
      <button
        onClick={handleClick}
        className="px-3 py-1 bg-gray-100 rounded capitalize text-black text-sm hover:bg-gray-200"
      >
        {ability?.name ? ability.name.replace("-", " ") : "Habilidad desconocida"}
      </button>
      {desc && (
        <p className="text-xs text-gray-600 mt-1 max-w-xs transition-opacity duration-500">
          {desc}
        </p>
      )}
    </li>
  );
}
