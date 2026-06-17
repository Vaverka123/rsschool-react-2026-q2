import { MemoryRouter, Route, Routes, useSearchParams } from 'react-router-dom';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CharacterDetail from './CharacterDetail';

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

vi.mock('@/hooks/useCharacterDetail', () => ({
  default: vi.fn(),
}));

const { default: useCharacterDetail } =
  await import('@/hooks/useCharacterDetail');

const LocationDisplay = () => {
  const [searchParams] = useSearchParams();
  return <span data-testid="search">{searchParams.toString()}</span>;
};

const renderWithDetails = (detailsId?: number) => {
  const initialEntry = detailsId != null ? `/?details=${detailsId}` : '/';
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <CharacterDetail />
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

const mockReturn = (overrides: Partial<ReturnType<typeof useCharacterDetail>>) =>
  vi.mocked(useCharacterDetail).mockReturnValue({
    character: null,
    loading: false,
    error: null,
    handleRefresh: vi.fn(),
    ...overrides,
  });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CharacterDetail', () => {
  describe('no selection', () => {
    it('renders nothing when no details param in URL', () => {
      mockReturn({});
      const { container } = renderWithDetails();
      expect(container.querySelector('[aria-label]')).toBeNull();
    });
  });

  describe('loading state', () => {
    it('renders spinner while loading', () => {
      mockReturn({ loading: true });
      renderWithDetails(1);
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('does not render character info while loading', () => {
      mockReturn({ loading: true });
      renderWithDetails(1);
      expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders error message', () => {
      mockReturn({ error: 'No characters found for your search.' });
      renderWithDetails(999);
      expect(
        screen.getByText('No characters found for your search.')
      ).toBeInTheDocument();
    });

    it('renders close button on error', () => {
      mockReturn({ error: 'Something went wrong.' });
      renderWithDetails(999);
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });

  describe('character data', () => {
    beforeEach(() => {
      mockReturn({ character: mockCharacterDetail });
    });

    it('renders character name', () => {
      renderWithDetails(1);
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    it('renders character image', () => {
      renderWithDetails(1);
      const img = screen.getByAltText('Rick Sanchez') as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toBe(mockCharacterDetail.image);
    });

    it('renders status', () => {
      renderWithDetails(1);
      expect(screen.getByText('Alive')).toBeInTheDocument();
    });

    it('renders species', () => {
      renderWithDetails(1);
      expect(screen.getByText('Human')).toBeInTheDocument();
    });

    it('renders gender', () => {
      renderWithDetails(1);
      expect(screen.getByText('Male')).toBeInTheDocument();
    });

    it('renders origin', () => {
      renderWithDetails(1);
      expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    });

    it('renders location', () => {
      renderWithDetails(1);
      expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
    });

    it('renders episode count', () => {
      renderWithDetails(1);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders Unknown for empty type', () => {
      renderWithDetails(1);
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('renders close button', () => {
      renderWithDetails(1);
      expect(
        screen.getByRole('button', { name: /close details/i })
      ).toBeInTheDocument();
    });

    it('renders refresh button', () => {
      renderWithDetails(1);
      expect(
        screen.getByRole('button', { name: /refresh details/i })
      ).toBeInTheDocument();
    });

    it('calls handleRefresh when refresh button is clicked', async () => {
      const mockHandleRefresh = vi.fn();
      mockReturn({ character: mockCharacterDetail, handleRefresh: mockHandleRefresh });
      renderWithDetails(1);
      await userEvent.click(screen.getByRole('button', { name: /refresh details/i }));
      expect(mockHandleRefresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('close behaviour', () => {
    it('removes details param from URL on close click', async () => {
      vi.mocked(useCharacterDetail)
        .mockReturnValueOnce({
          character: mockCharacterDetail,
          loading: false,
          error: null,
          handleRefresh: vi.fn(),
        })
        .mockReturnValue({
          character: null,
          loading: false,
          error: null,
          handleRefresh: vi.fn(),
        });

      renderWithDetails(1);
      expect(screen.getByTestId('search').textContent).toContain('details=1');

      await userEvent.click(
        screen.getByRole('button', { name: /close details/i })
      );

      await waitFor(() => {
        expect(screen.getByTestId('search').textContent).not.toContain('details');
      });
    });
  });
});
