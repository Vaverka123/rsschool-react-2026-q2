import CharacterCard from '@/components/characterCard/CharacterCard';

import type { Character } from '@/types/character';

interface Props {
  results: Character[];
  loading: boolean;
  error: string | null;
}

function SearchResults({ results, loading, error }: Props) {
  if (loading) {
    return (
      <p style={{ color: 'var(--text)' }} className="text-sm py-8">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ color: '#ef4444' }} className="text-sm py-8">
        {error}
      </p>
    );
  }

  return (
    <ul
      style={{ listStyle: 'none', padding: 0, margin: 0 }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {results.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </ul>
  );
}

export default SearchResults;
