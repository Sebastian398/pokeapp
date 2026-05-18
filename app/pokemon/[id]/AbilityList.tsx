// AbilityList.tsx
import AbilityItem from "./AbilityItem";

export default function AbilityList({ abilities }: { abilities: { ability: { name: string; url: string } }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {abilities.map((a) => (
        <AbilityItem key={a.ability.name} ability={a.ability} />
      ))}
    </ul>
  );
}
