import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { screen, waitFor } from '@testing-library/react';

import App from './App';

import { mockApiResponse } from '@/test-utils/mocks';
import {
  renderWithMemoryRouter,
  renderWithProviders,
} from '@/test-utils/renderWithProviders';

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

describe('App', () => {
  describe('routing', () => {
    it('renders HomePage on / route', () => {
      renderWithProviders(<App />);
      expect(screen.getByText('Rick & Morty')).toBeInTheDocument();
    });

    it('renders AboutPage on /about route', () => {
      renderWithMemoryRouter(
        <MemoryRouter initialEntries={['/about']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByText('About This App')).toBeInTheDocument();
    });

    it('does not render AboutPage on / route', () => {
      renderWithProviders(<App />);
      expect(screen.queryByText('About This App')).not.toBeInTheDocument();
    });

    it('does not render HomePage on /about route', () => {
      renderWithMemoryRouter(
        <MemoryRouter initialEntries={['/about']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.queryByText('Rick & Morty')).not.toBeInTheDocument();
    });

    it('renders results on home page after fetch', async () => {
      renderWithProviders(<App />);
      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      });
    });
  });
});
