"use client";
import Link from "next/link";
import CaptureButton from "./CaptureButton";

interface PokemonCardProps {
  id: string;
  name: string;
  isCaptured: boolean;
  isFavorite: boolean;
}

export default function PokemonCard({ id, name, isCaptured, isFavorite }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${id}`}>
      <li className="bg-white rounded-lg shadow p-3 text-center border-2 border-gray-100 hover:scale-105 transition cursor-pointer">
        <div className="text-xs text-gray-500 mb-1">#{id}</div>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
          alt={name}
          className="w-16 h-16 mx-auto"
        />
        <p className="font-medium text-sm capitalize text-black">{name}</p>

        <div className="flex justify-center gap-2 mt-2">
          <CaptureButton id={id} type="capture" active={isCaptured} />
          <CaptureButton id={id} type="favorite" active={isFavorite} />
        </div>
      </li>
    </Link>
  );
}
