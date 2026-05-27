import CharacterCard from '@/components/characterCard/CharacterCard';
import SkeletonCard from '@/components/skeletonCard/SkeletonCard';

import type { SearchResultsProps } from '@/types/searchResultProps';

const SKELETON_COUNT = 20;

function SearchResults({ results, loading, error }: SearchResultsProps) {
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
      {loading
        ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        : results.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
    </ul>
  );
}

export default SearchResults;
