import useCharacterDetailQuery from '@/hooks/useCharacterDetailQuery';

function useCharacterDetail(id: number | null) {
  const { data, isLoading, isError, error } = useCharacterDetailQuery(id);

  return {
    character: data ?? null,
    loading: isLoading && id !== null,
    error: isError ? (error as Error).message : null,
  };
}

export default useCharacterDetail;
