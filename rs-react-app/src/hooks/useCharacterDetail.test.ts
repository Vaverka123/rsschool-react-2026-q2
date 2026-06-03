import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { ApiError, fetchCharacter } from '@/api/rickAndMortyApi';

import useCharacterDetail from './useCharacterDetail';

const mockCharacterDetail = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive' as const,
  species: 'Human',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  location: { name: 'Citadel of Ricks' },
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)' },
  episode: ['ep1', 'ep2', 'ep3'],
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
    QueryClientProvider({ client: queryClient, children });
};

beforeEach(() => vi.clearAllMocks());

describe('useCharacterDetail', () => {
  describe('null id', () => {
    it('returns null character when id is null', async () => {
      const { result } = renderHook(() => useCharacterDetail(null), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.character).toBeNull();
      });
    });

    it('does not fetch when id is null', async () => {
      renderHook(() => useCharacterDetail(null), { wrapper: createWrapper() });
      await waitFor(() => {
        expect(fetchCharacter).not.toHaveBeenCalled();
      });
    });

    it('returns loading false when id is null', async () => {
      const { result } = renderHook(() => useCharacterDetail(null), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('successful fetch', () => {
    it('fetches character by id', async () => {
      vi.mocked(fetchCharacter).mockResolvedValueOnce(mockCharacterDetail);
      renderHook(() => useCharacterDetail(1), { wrapper: createWrapper() });
      await waitFor(() => {
        expect(fetchCharacter).toHaveBeenCalledWith(1);
      });
    });

    it('sets character after successful fetch', async () => {
      vi.mocked(fetchCharacter).mockResolvedValueOnce(mockCharacterDetail);
      const { result } = renderHook(() => useCharacterDetail(1), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.character).toEqual(mockCharacterDetail);
      });
    });

    it('sets loading to false after fetch', async () => {
      vi.mocked(fetchCharacter).mockResolvedValueOnce(mockCharacterDetail);
      const { result } = renderHook(() => useCharacterDetail(1), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('has no error after successful fetch', async () => {
      vi.mocked(fetchCharacter).mockResolvedValueOnce(mockCharacterDetail);
      const { result } = renderHook(() => useCharacterDetail(1), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('error handling', () => {
    it('sets ApiError message on api error', async () => {
      vi.mocked(fetchCharacter).mockRejectedValueOnce(
        new ApiError(404, 'No characters found for your search.')
      );
      const { result } = renderHook(() => useCharacterDetail(1), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.error).toBe(
          'No characters found for your search.'
        );
      });
    });

    it('sets generic error on unknown error', async () => {
      vi.mocked(fetchCharacter).mockRejectedValueOnce(new Error('Unknown'));
      const { result } = renderHook(() => useCharacterDetail(1), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.error).toBe('Something went wrong.');
      });
    });

    it('sets character to null on error', async () => {
      vi.mocked(fetchCharacter).mockRejectedValueOnce(
        new ApiError(404, 'Not found.')
      );
      const { result } = renderHook(() => useCharacterDetail(1), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.character).toBeNull();
      });
    });

    it('sets loading to false after error', async () => {
      vi.mocked(fetchCharacter).mockRejectedValueOnce(new Error('fail'));
      const { result } = renderHook(() => useCharacterDetail(1), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('id change', () => {
    it('fetches new character when id changes', async () => {
      vi.mocked(fetchCharacter).mockResolvedValue(mockCharacterDetail);
      const { rerender } = renderHook(({ id }) => useCharacterDetail(id), {
        initialProps: { id: 1 as number | null },
        wrapper: createWrapper(),
      });
      await waitFor(() => expect(fetchCharacter).toHaveBeenCalledWith(1));

      rerender({ id: 2 });
      await waitFor(() => expect(fetchCharacter).toHaveBeenCalledWith(2));
    });

    it('clears character when id changes to null', async () => {
      vi.mocked(fetchCharacter).mockResolvedValueOnce(mockCharacterDetail);
      const { result, rerender } = renderHook(
        ({ id }) => useCharacterDetail(id),
        { initialProps: { id: 1 as number | null }, wrapper: createWrapper() }
      );
      await waitFor(() =>
        expect(result.current.character).toEqual(mockCharacterDetail)
      );

      rerender({ id: null });
      await waitFor(() => expect(result.current.character).toBeNull());
    });
  });
});
