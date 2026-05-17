// src/app/pokemon/[id]/AbilityList.tsx
"use client";
import { useState } from "react";

export default function AbilityList({ abilities }: { abilities: { ability: { name: string; url: string } }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {abilities.map((a) => (
        <AbilityItem key={a.ability.name} ability={a.ability} />
      ))}
    </ul>
  );
}

function AbilityItem({ ability }: { ability: { name: string; url: string } }) {
  const [desc, setDesc] = useState<string | null>(null);

  async function handleClick() {
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
        {ability.name.replace("-", " ")}
      </button>
      {desc && (
        <p className="text-xs text-gray-600 mt-1 max-w-xs">{desc}</p>
      )}
    </li>
  );
}
