import type { Character } from './character';

type SearchResultsProps = {
  results: Character[];
  loading: boolean;
  error: string | null;
};

export type { SearchResultsProps };
