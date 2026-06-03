import { createElement, type ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import useCharacterDetailQuery from './useCharacterDetailQuery';

import { fetchCharacter } from '@/api/rickAndMortyApi';

const mockDetail = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive' as const,
  species: 'Human',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  location: { name: 'Citadel of Ricks' },
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)' },
  episode: ['ep1', 'ep2'],
};

vi.mock('@/api/rickAndMortyApi', () => ({
  fetchCharacter: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.name = 'ApiError';
    }
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

beforeEach(() => vi.clearAllMocks());

describe('useCharacterDetailQuery', () => {
  it('does not fetch when id is null', () => {
    const { result } = renderHook(() => useCharacterDetailQuery(null), {
      wrapper: createWrapper(),
    });
    expect(fetchCharacter).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches character when id is provided', async () => {
    vi.mocked(fetchCharacter).mockResolvedValueOnce(mockDetail);
    const { result } = renderHook(() => useCharacterDetailQuery(1), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchCharacter).toHaveBeenCalledWith(1);
    expect(result.current.data).toEqual(mockDetail);
  });

  it('sets error on failure', async () => {
    vi.mocked(fetchCharacter).mockRejectedValueOnce(new Error('Not found'));
    const { result } = renderHook(() => useCharacterDetailQuery(99), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
