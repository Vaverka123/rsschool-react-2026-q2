import { useState } from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ErrorBoundary from '@/components/errorBoundary/ErrorBoundary';

import HomePage from './HomePage';

import { mockApiResponse } from '@/test-utils/mocks';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

vi.mock('@/api/rickAndMortyApi', () => ({
  fetchCharacters: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
    }
  },
}));

vi.mock('@/hooks/useLocalStorage', () => ({
  default: vi.fn((_: string, initialValue: string) => {
    const [value, setValue] = useState(initialValue);
    return [value, setValue];
  }),
}));

const { fetchCharacters } = await import('@/api/rickAndMortyApi');

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.mocked(fetchCharacters).mockResolvedValue(mockApiResponse);
});

describe('HomePage', () => {
  describe('rendering', () => {
    it('renders page title', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('Rick & Morty')).toBeInTheDocument();
    });

    it('renders character count', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByText('826 characters')).toBeInTheDocument();
    });

    it('renders search bar', () => {
      renderWithProviders(<HomePage />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders error trigger button', () => {
      renderWithProviders(<HomePage />);
      expect(
        screen.getByRole('button', { name: /simulate error/i })
      ).toBeInTheDocument();
    });
  });

  describe('search results', () => {
    it('renders results after fetch', async () => {
      renderWithProviders(<HomePage />);
      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      });
    });

    it('shows skeleton while loading', () => {
      vi.mocked(fetchCharacters).mockImplementationOnce(
        () => new Promise(() => {})
      );
      renderWithProviders(<HomePage />);
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('triggers search on button click', async () => {
      renderWithProviders(<HomePage />);
      await waitFor(() => expect(fetchCharacters).toHaveBeenCalledTimes(1));

      const input = screen.getByRole('textbox');
      await userEvent.clear(input);
      await userEvent.type(input, 'Morty');

      vi.mocked(fetchCharacters).mockResolvedValueOnce(mockApiResponse);

      await userEvent.click(screen.getByRole('button', { name: /^search$/i }));

      await waitFor(() =>
        expect(fetchCharacters).toHaveBeenCalledWith('Morty', 1)
      );
    });

    it('shows error boundary fallback on error trigger click', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      renderWithProviders(
        <ErrorBoundary>
          <HomePage />
        </ErrorBoundary>
      );

      await userEvent.click(
        screen.getByRole('button', { name: /simulate error/i })
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      vi.restoreAllMocks();
    });
  });
});
