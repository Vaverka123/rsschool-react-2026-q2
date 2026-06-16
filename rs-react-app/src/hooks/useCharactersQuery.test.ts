import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import useCharactersQuery, { characterKeys } from './useCharactersQuery';

import { fetchCharacters } from '@/api/rickAndMortyApi';
import { mockApiResponse } from '@/test-utils/mocks';

vi.mock('@/api/rickAndMortyApi', () => ({
  fetchCharacters: vi.fn(),
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
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

beforeEach(() => vi.clearAllMocks());

describe('useCharactersQuery', () => {
  it('fetches characters with name and page', async () => {
    vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
    const { result } = renderHook(() => useCharactersQuery('Rick', 1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchCharacters).toHaveBeenCalledWith('Rick', 1);
    expect(result.current.data?.results).toHaveLength(3);
  });

  it('is loading initially', () => {
    vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
    const { result } = renderHook(() => useCharactersQuery('', 1), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('sets error on failure', async () => {
    vi.mocked(fetchCharacters).mockRejectedValueOnce(new Error('Failed'));
    const { result } = renderHook(() => useCharactersQuery('xyz', 1), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('sets loading to false after successful fetch', async () => {
    vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
    const { result } = renderHook(() => useCharactersQuery('', 1), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isSuccess).toBe(true);
  });

  it('generates correct query keys', () => {
    expect(characterKeys.list('Rick', 1)).toEqual([
      'characters',
      'list',
      'Rick',
      1,
    ]);
    expect(characterKeys.detail(42)).toEqual(['characters', 'detail', 42]);
  });

  describe('caching', () => {
    const makeCachingWrapper = () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 60_000, gcTime: 60_000 } },
      });
      return {
        queryClient,
        wrapper: ({ children }: { children: React.ReactNode }) =>
          React.createElement(QueryClientProvider, { client: queryClient }, children),
      };
    };

    it('returns cached data without a second fetch for the same query key', async () => {
      vi.mocked(fetchCharacters).mockResolvedValue(mockApiResponse);
      const { wrapper } = makeCachingWrapper();

      const { result: r1, unmount } = renderHook(() => useCharactersQuery('Rick', 1), { wrapper });
      await waitFor(() => expect(r1.current.isSuccess).toBe(true));
      expect(fetchCharacters).toHaveBeenCalledTimes(1);
      unmount();

      const { result: r2 } = renderHook(() => useCharactersQuery('Rick', 1), { wrapper });
      await waitFor(() => expect(r2.current.isSuccess).toBe(true));
      expect(fetchCharacters).toHaveBeenCalledTimes(1);
      expect(r2.current.data?.results).toHaveLength(mockApiResponse.results.length);
    });

    it('fetches again for a different query key', async () => {
      vi.mocked(fetchCharacters).mockResolvedValue(mockApiResponse);
      const { wrapper } = makeCachingWrapper();

      const { result: r1 } = renderHook(() => useCharactersQuery('Rick', 1), { wrapper });
      await waitFor(() => expect(r1.current.isSuccess).toBe(true));
      expect(fetchCharacters).toHaveBeenCalledTimes(1);

      const { result: r2 } = renderHook(() => useCharactersQuery('Morty', 1), { wrapper });
      await waitFor(() => expect(r2.current.isSuccess).toBe(true));
      expect(fetchCharacters).toHaveBeenCalledTimes(2);
    });

    it('provides previous page data via placeholderData while fetching the next page', async () => {
      vi.mocked(fetchCharacters).mockResolvedValue(mockApiResponse);
      const { wrapper } = makeCachingWrapper();

      const { result, rerender } = renderHook(
        ({ page }: { page: number }) => useCharactersQuery('', page),
        { initialProps: { page: 1 }, wrapper }
      );
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      rerender({ page: 2 });

      expect(result.current.data?.results).toHaveLength(mockApiResponse.results.length);
      expect(result.current.isFetching).toBe(true);
    });
  });
});
