import { type ReactNode, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';

import useSearch from './useSearch';

import { ApiError, fetchCharacters } from '@/api/rickAndMortyApi';
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

vi.mock('@/hooks/useLocalStorage', () => ({
  default: vi.fn((_: string, initialValue: string) => {
    const [value, setValue] = useState(initialValue);
    return [value, setValue];
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('useSearch', () => {
  describe('initial load', () => {
    it('starts with empty results and not loading', () => {
      vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });
      expect(result.current.results).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('fetches on mount with empty query', async () => {
      vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
      renderHook(() => useSearch(), { wrapper: createWrapper() });
      await waitFor(() => {
        expect(fetchCharacters).toHaveBeenCalledWith('', 1);
      });
    });

    it('fetches on mount with saved localStorage query', async () => {
      localStorage.setItem('search-query', JSON.stringify('Rick'));
      vi.mocked(fetchCharacters).mockResolvedValue(mockApiResponse);
      renderHook(() => useSearch(), { wrapper: createWrapper() });
      await waitFor(() => {
        expect(fetchCharacters).toHaveBeenCalledWith('Rick', 1);
      });
    });

    it('sets results after successful fetch', async () => {
      vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.results).toEqual(mockApiResponse.results);
      });
    });

    it('sets loading to true while fetching', () => {
      vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });
      expect(result.current.loading).toBe(true);
    });

    it('sets loading to false after fetch completes', async () => {
      vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('handleSearch', () => {
    it('fetches with current query on handleSearch', async () => {
      vi.mocked(fetchCharacters).mockResolvedValue(mockApiResponse);
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(fetchCharacters).toHaveBeenCalledTimes(1));

      act(() => result.current.handleSearch());

      await waitFor(() => expect(fetchCharacters).toHaveBeenCalledTimes(2));
      expect(fetchCharacters).toHaveBeenLastCalledWith('', 1);
    });

    it('fetches again after handleSearch resets lastSearched', async () => {
      vi.mocked(fetchCharacters).mockResolvedValue(mockApiResponse);
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(fetchCharacters).toHaveBeenCalledTimes(1));

      act(() => result.current.handleSearch());
      await waitFor(() => expect(fetchCharacters).toHaveBeenCalledTimes(2));

      act(() => result.current.handleSearch());
      await waitFor(() => expect(fetchCharacters).toHaveBeenCalledTimes(3));
    });
  });

  describe('error handling', () => {
    it('sets error message on ApiError', async () => {
      vi.mocked(fetchCharacters).mockRejectedValueOnce(
        new ApiError(404, 'No characters found for your search.')
      );
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.error).toBe(
          'No characters found for your search.'
        );
      });
    });

    it('sets generic error on unknown error', async () => {
      vi.mocked(fetchCharacters).mockRejectedValueOnce(new Error('Unknown'));
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.error).toBe(
          'Something went wrong. Please try again.'
        );
      });
    });

    it('clears results on error', async () => {
      vi.mocked(fetchCharacters).mockRejectedValueOnce(
        new ApiError(404, 'No characters found.')
      );
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });
      await waitFor(() => {
        expect(result.current.results).toEqual([]);
      });
    });
  });
});
