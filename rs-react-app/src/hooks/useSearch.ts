import { useEffect, useRef, useState } from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';

import type { Character } from '@/types/character';

import { ApiError, fetchCharacters } from '@/api/rickAndMortyApi';

function useSearch() {
  const [query, setQuery] = useLocalStorage('search-query', '');
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSearched = useRef<string | null>(null);
  const isMounted = useRef(false);

  const search = async (term: string) => {
    if (term === lastSearched.current) return;
    lastSearched.current = term;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchCharacters(term);
      setResults(data.results);
    } catch (err) {
      setResults([]);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const savedQuery = localStorage.getItem('search-query');
    const initial = savedQuery ? JSON.parse(savedQuery) : '';
    search(initial);
  }, []);

  const handleSearch = () => {
    search(query);
  };

  return { query, setQuery, results, loading, error, handleSearch };
}

export default useSearch;
