import { useQuery } from '@tanstack/react-query';

import { characterKeys } from './useCharactersQuery';

import { fetchCharacter } from '@/api/rickAndMortyApi';

function useCharacterDetailQuery(id: number | null) {
  const queryKey =
    id !== null
      ? characterKeys.detail(id)
      : ([...characterKeys.all, 'detail', null] as const);

  return useQuery({
    queryKey,
    queryFn: () => fetchCharacter(id!),
    enabled: id !== null,
  });
}

export default useCharacterDetailQuery;
