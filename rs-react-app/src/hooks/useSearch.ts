import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import useLocalStorage from '@/hooks/useLocalStorage';

import useCharactersQuery, { characterKeys } from './useCharactersQuery';

import { ApiError } from '@/api/rickAndMortyApi';

function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useLocalStorage('search-query', '');

  const queryClient = useQueryClient();
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
      setSearchParams((prev) => {
        prev.set('page', '1');
        return prev;
      });
    } else {
      void refetch();
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      prev.set('page', String(page));
      return prev;
    });
  };

  const handleRefresh = () => {
    void queryClient.invalidateQueries({
      queryKey: characterKeys.list(query, currentPage),
    });
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
    handleRefresh,
  };
}

export default useSearch;
