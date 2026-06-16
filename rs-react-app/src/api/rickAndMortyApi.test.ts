import { ApiError, fetchCharacters } from './rickAndMortyApi';

import { mockApiResponse } from '@/test-utils/mocks';

describe('fetchCharacters', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => vi.restoreAllMocks());

  describe('successful requests', () => {
    it('fetches all characters when query is empty', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      const result = await fetchCharacters('');
      expect(fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character?page=1'
      );
      expect(result.results).toHaveLength(3);
    });

    it('fetches with name query when provided', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      await fetchCharacters('Rick');
      expect(fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character?name=Rick&page=1'
      );
    });

    it('encodes special characters in query', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      await fetchCharacters('Rick & Morty');
      expect(fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character?name=Rick+%26+Morty&page=1'
      );
    });

    it('trims whitespace from query', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      await fetchCharacters('   ');
      expect(fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character?page=1'
      );
    });

    it('uses correct page number', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      await fetchCharacters('Rick', 3);
      expect(fetch).toHaveBeenCalledWith(
        'https://rickandmortyapi.com/api/character?name=Rick&page=3'
      );
    });
  });

  describe('network errors', () => {
    it('throws ApiError on network failure', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
      await expect(fetchCharacters('')).rejects.toThrow(ApiError);
    });

    it('throws ApiError with status 0 on network failure', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
      await expect(fetchCharacters('')).rejects.toMatchObject({
        status: 0,
        message: 'Network error — check your internet connection.',
      });
    });
  });

  describe('http error status codes', () => {
    it('throws ApiError with 404 message', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);
      await expect(fetchCharacters('xyz')).rejects.toMatchObject({
        status: 404,
        message: 'No characters found for your search.',
      });
    });

    it('throws ApiError with 429 message', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 429,
      } as Response);
      await expect(fetchCharacters('')).rejects.toMatchObject({
        status: 429,
        message: 'Too many requests — please wait a moment and try again.',
      });
    });

    it('throws ApiError with 500 message', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);
      await expect(fetchCharacters('')).rejects.toMatchObject({
        status: 500,
        message: 'The server is having issues. Please try again later.',
      });
    });

    it('throws ApiError with 503 message', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 503,
      } as Response);
      await expect(fetchCharacters('')).rejects.toMatchObject({
        status: 503,
        message: 'Service unavailable. Please try again later.',
      });
    });

    it('throws ApiError with fallback message for unknown status', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 418,
      } as Response);
      await expect(fetchCharacters('')).rejects.toMatchObject({
        status: 418,
        message: 'Unexpected error (418). Please try again.',
      });
    });
  });

  describe('ApiError class', () => {
    it('has correct name', () => {
      const err = new ApiError(404, 'Not found');
      expect(err.name).toBe('ApiError');
    });

    it('has correct status', () => {
      const err = new ApiError(500, 'Server error');
      expect(err.status).toBe(500);
    });

    it('is instance of Error', () => {
      const err = new ApiError(404, 'Not found');
      expect(err).toBeInstanceOf(Error);
    });
  });
});
