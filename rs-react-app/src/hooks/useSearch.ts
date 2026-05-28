import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import useLocalStorage from '@/hooks/useLocalStorage';

import type { Character } from '@/types/character';

import { ApiError, fetchCharacters } from '@/api/rickAndMortyApi';

function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useLocalStorage('search-query', '');
  const [results, setResults] = useState<Character[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSearched = useRef<string | null>(null);
  const isMounted = useRef(false);

  const currentPage = Number(searchParams.get('page') ?? '1');

  const search = async (term: string, page: number) => {
    const key = `${term}__${page}`;
    if (key === lastSearched.current) return;
    lastSearched.current = key;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchCharacters(term, page);
      setResults(data.results);
      setTotalPages(data.info.pages);
    } catch (err) {
      setResults([]);
      setTotalPages(0);
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
    search(initial, currentPage);
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    search(query, currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    lastSearched.current = null;
    setSearchParams({ page: '1' });
    search(query, 1);
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  return {
    query,
    setQuery,
    results,
    totalPages,
    currentPage,
    loading,
    error,
    handleSearch,
    handlePageChange,
  };
}

export default useSearch;
