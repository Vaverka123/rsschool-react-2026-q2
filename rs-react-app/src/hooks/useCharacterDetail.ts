import useCharacterDetailQuery from '@/hooks/useCharacterDetailQuery';

import { ApiError } from '@/api/rickAndMortyApi';

function useCharacterDetail(id: number | null) {
  const { data, isLoading, isError, error } = useCharacterDetailQuery(id);

  return {
    character: data ?? null,
    loading: isLoading && id !== null,
    error: isError
      ? error instanceof ApiError
        ? (error as Error).message
        : 'Something went wrong.'
      : null,
  };
}

export default useCharacterDetail;
