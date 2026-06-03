import { ApiError } from '@/api/rickAndMortyApi';
import useCharacterDetailQuery from '@/hooks/useCharacterDetailQuery';

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
