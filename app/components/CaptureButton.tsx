"use client";
interface CaptureButtonProps {
  id: string;
  type: "capture" | "favorite";
  active: boolean;
}

export default function CaptureButton({ id, type, active }: CaptureButtonProps) {
  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); // evita que el Link se dispare

    const body =
      type === "capture"
        ? { id, captured: !active }
        : { id, favorite: !active };

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collection`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  const styles =
    type === "capture"
      ? active
        ? "bg-green-600 text-white"
        : "bg-gray-200 text-black"
      : active
      ? "bg-yellow-500 text-white"
      : "bg-gray-200 text-black";

  const label =
    type === "capture"
      ? active
        ? "Atrapado ✅"
        : "Atrapar"
      : active
      ? "Favorito ⭐"
      : "Favorito";

  return (
    <button
      className={`px-2 py-1 rounded text-xs font-semibold ${styles}`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
 