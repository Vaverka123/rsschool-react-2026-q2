import { useQuery } from '@tanstack/react-query';

import { fetchCharacters } from '@/api/rickAndMortyApi';

export const characterKeys = {
  all: ['characters'] as const,
  list: (name: string, page: number) =>
    [...characterKeys.all, 'list', name, page] as const,
  detail: (id: number) => [...characterKeys.all, 'detail', id] as const,
};

function useCharactersQuery(name: string, page: number) {
  return useQuery({
    queryKey: characterKeys.list(name, page),
    queryFn: () => fetchCharacters(name, page),
    placeholderData: (prev) => prev,
  });
}

export default useCharactersQuery;
