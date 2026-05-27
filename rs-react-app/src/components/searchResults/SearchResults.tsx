import CharacterCard from '@/components/characterCard/CharacterCard';
import SkeletonCard from '@/components/skeletonCard/SkeletonCard';

import type { SearchResultsProps } from '@/types/searchResultProps';

const SKELETON_COUNT = 20;

function SearchResults({ results, loading, error }: SearchResultsProps) {
  if (error) {
    return (
      <div
        style={{
          border: '1px solid rgba(239,68,68,0.3)',
          background: 'rgba(239,68,68,0.05)',
          color: '#ef4444',
        }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
      >
        <i
          className="ti ti-alert-circle"
          style={{ fontSize: 18 }}
          aria-hidden="true"
        />
        {error}
      </div>
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
