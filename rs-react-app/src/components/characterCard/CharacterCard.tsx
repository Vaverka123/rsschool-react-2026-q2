import type { Character, CharacterCardProps } from '@/types/character';

const statusColor: Record<Character['status'], string> = {
  Alive: '#22c55e',
  Dead: '#ef4444',
  unknown: '#9ca3af',
};

function CharacterCard({ character }: CharacterCardProps) {
  return (
    <li
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg)',
        boxShadow: 'var(--shadow)',
      }}
      className="flex flex-col rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform"
    >
      <div className="p-3 pb-0">
        <img
          src={character.image}
          alt={character.name}
          className="w-full aspect-square object-cover rounded-xl"
        />
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">
        <h2
          style={{ color: 'var(--text-h)' }}
          className="text-base font-medium leading-tight"
        >
          {character.name}
        </h2>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: statusColor[character.status] }}
          />
          <span style={{ color: 'var(--text)' }} className="text-sm">
            {character.status} · {character.species}
          </span>
        </div>
        <p style={{ color: 'var(--text)' }} className="text-sm truncate">
          {character.location.name}
        </p>
      </div>
    </li>
  );
}

export default CharacterCard;
