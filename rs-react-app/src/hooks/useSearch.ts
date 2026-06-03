import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import useLocalStorage from '@/hooks/useLocalStorage';

import useCharactersQuery from './useCharactersQuery';

import { ApiError } from '@/api/rickAndMortyApi';

function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useLocalStorage('search-query', '');

  const currentPage = Number(searchParams.get('page') ?? '1');

  const { data, isLoading, isError, error, refetch } = useCharactersQuery(
    query,
    currentPage
  );

  useEffect(() => {
    const savedQuery = localStorage.getItem('search-query');
    const initial = savedQuery ? JSON.parse(savedQuery) : '';
    if (initial !== query) setQuery(initial);
  }, []);

  const handleSearch = () => {
    if (currentPage !== 1) {
      setSearchParams({ page: '1' });
    } else {
      void refetch();
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  return {
    query,
    setQuery,
    results: data?.results ?? [],
    totalPages: data?.info.pages ?? 0,
    currentPage,
    loading: isLoading,
    error: isError
      ? error instanceof ApiError
        ? (error as Error).message
        : 'Something went wrong. Please try again.'
      : null,
    handleSearch,
    handlePageChange,
  };
}

export default useSearch;
