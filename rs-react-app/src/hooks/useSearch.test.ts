import { act, renderHook, waitFor } from '@testing-library/react';

import useSearch from './useSearch';

import { ApiError } from '@/api/rickAndMortyApi';
import { mockApiResponse } from '@/test-utils/mocks';

vi.mock('@/api/rickAndMortyApi', () => ({
  fetchCharacters: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(
      public status: number,
      message: string
    ) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

vi.mock('@/hooks/useLocalStorage', () => ({
  default: vi.fn(() => ['', vi.fn()]),
}));

const { fetchCharacters } = await import('@/api/rickAndMortyApi');

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('useSearch', () => {
  describe('initial load', () => {
    it('starts with empty results and not loading', () => {
      vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
      const { result } = renderHook(() => useSearch());
      expect(result.current.results).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('fetches on mount with empty query', async () => {
      vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
      renderHook(() => useSearch());
      await waitFor(() => {
        expect(fetchCharacters).toHaveBeenCalledWith('');
      });
    });

    it('fetches on mount with saved localStorage query', async () => {
      localStorage.setItem('search-query', JSON.stringify('Rick'));
      vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
      renderHook(() => useSearch());
      await waitFor(() => {
        expect(fetchCharacters).toHaveBeenCalledWith('Rick');
      });
    });

    it('sets results after successful fetch', async () => {
      vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
      const { result } = renderHook(() => useSearch());
      await waitFor(() => {
        expect(result.current.results).toEqual(mockApiResponse.results);
      });
    });

    it('sets loading to false after fetch completes', async () => {
      vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);
      const { result } = renderHook(() => useSearch());
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('handleSearch', () => {
    it('does not fetch if query unchanged', async () => {
      vi.mocked(fetchCharacters).mockResolvedValue(mockApiResponse);
      const { result } = renderHook(() => useSearch());

      await waitFor(() => expect(fetchCharacters).toHaveBeenCalledTimes(1));

      act(() => result.current.handleSearch());

      await waitFor(() => expect(fetchCharacters).toHaveBeenCalledTimes(1));
    });
  });

  describe('error handling', () => {
    it('sets error message on ApiError', async () => {
      vi.mocked(fetchCharacters).mockRejectedValueOnce(
        new ApiError(404, 'No characters found for your search.')
      );
      const { result } = renderHook(() => useSearch());
      await waitFor(() => {
        expect(result.current.error).toBe(
          'No characters found for your search.'
        );
      });
    });

    it('sets generic error on unknown error', async () => {
      vi.mocked(fetchCharacters).mockRejectedValueOnce(new Error('Unknown'));
      const { result } = renderHook(() => useSearch());
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
      const { result } = renderHook(() => useSearch());
      await waitFor(() => {
        expect(result.current.results).toEqual([]);
      });
    });
  });
});
