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

  it('generates correct query keys', () => {
    expect(characterKeys.list('Rick', 1)).toEqual([
      'characters',
      'list',
      'Rick',
      1,
    ]);
    expect(characterKeys.detail(42)).toEqual(['characters', 'detail', 42]);
  });
});
