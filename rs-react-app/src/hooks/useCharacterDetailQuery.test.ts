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

  it('is loading initially when id is provided', () => {
    vi.mocked(fetchCharacter).mockResolvedValueOnce(mockDetail);
    const { result } = renderHook(() => useCharacterDetailQuery(1), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
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

  it('sets loading to false after successful fetch', async () => {
    vi.mocked(fetchCharacter).mockResolvedValueOnce(mockDetail);
    const { result } = renderHook(() => useCharacterDetailQuery(1), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('sets error on failure', async () => {
    vi.mocked(fetchCharacter).mockRejectedValueOnce(new Error('Not found'));
    const { result } = renderHook(() => useCharacterDetailQuery(99), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  describe('caching', () => {
    const makeCachingWrapper = () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 60_000, gcTime: 60_000 } },
      });
      return {
        wrapper: ({ children }: { children: ReactNode }) =>
          createElement(QueryClientProvider, { client: queryClient }, children),
      };
    };

    it('returns cached data without a second fetch for the same id', async () => {
      vi.mocked(fetchCharacter).mockResolvedValue(mockDetail);
      const { wrapper } = makeCachingWrapper();

      const { result: r1, unmount } = renderHook(() => useCharacterDetailQuery(1), { wrapper });
      await waitFor(() => expect(r1.current.isSuccess).toBe(true));
      expect(fetchCharacter).toHaveBeenCalledTimes(1);
      unmount();

      const { result: r2 } = renderHook(() => useCharacterDetailQuery(1), { wrapper });
      await waitFor(() => expect(r2.current.isSuccess).toBe(true));
      expect(fetchCharacter).toHaveBeenCalledTimes(1);
      expect(r2.current.data).toEqual(mockDetail);
    });

    it('fetches again for a different id', async () => {
      vi.mocked(fetchCharacter).mockResolvedValue(mockDetail);
      const { wrapper } = makeCachingWrapper();

      const { result: r1 } = renderHook(() => useCharacterDetailQuery(1), { wrapper });
      await waitFor(() => expect(r1.current.isSuccess).toBe(true));

      const { result: r2 } = renderHook(() => useCharacterDetailQuery(2), { wrapper });
      await waitFor(() => expect(r2.current.isSuccess).toBe(true));
      expect(fetchCharacter).toHaveBeenCalledTimes(2);
    });
  });
});
