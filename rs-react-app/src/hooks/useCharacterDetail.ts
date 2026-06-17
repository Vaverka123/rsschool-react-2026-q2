import { useQueryClient } from '@tanstack/react-query';

import useCharacterDetailQuery from '@/hooks/useCharacterDetailQuery';
import { characterKeys } from '@/hooks/useCharactersQuery';

import { ApiError } from '@/api/rickAndMortyApi';

function useCharacterDetail(id: number | null) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useCharacterDetailQuery(id);

  const handleRefresh = () => {
    if (id !== null) {
      void queryClient.invalidateQueries({ queryKey: characterKeys.detail(id) });
    }
  };

  return {
    character: data ?? null,
    loading: isLoading && id !== null,
    error: isError
      ? error instanceof ApiError
        ? (error as Error).message
        : 'Something went wrong.'
      : null,
    handleRefresh,
  };
}

export default useCharacterDetail;
