import { MemoryRouter, Route, Routes, useSearchParams } from 'react-router-dom';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CharacterDetail from './CharacterDetail';

import { renderWithMemoryRouter } from '@/test-utils/renderWithProviders';

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

const renderWithDetails = (detailsId?: string) => {
  const search = detailsId ? `?details=${detailsId}` : '';
  return renderWithMemoryRouter(
    <MemoryRouter initialEntries={[`/${search}`]}>
      <Routes>
        <Route path="/" element={<CharacterDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

beforeEach(() => vi.clearAllMocks());

describe('CharacterDetail', () => {
  describe('no selection', () => {
    it('renders nothing when no details param', () => {
      vi.mocked(useCharacterDetail).mockReturnValue({
        character: null,
        loading: false,
        error: null,
      });
      const { container } = renderWithDetails();
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('loading state', () => {
    it('renders spinner while loading', () => {
      vi.mocked(useCharacterDetail).mockReturnValue({
        character: null,
        loading: true,
        error: null,
      });
      renderWithDetails('1');
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('does not render character info while loading', () => {
      vi.mocked(useCharacterDetail).mockReturnValue({
        character: null,
        loading: true,
        error: null,
      });
      renderWithDetails('1');
      expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders error message', () => {
      vi.mocked(useCharacterDetail).mockReturnValue({
        character: null,
        loading: false,
        error: 'No characters found for your search.',
      });
      renderWithDetails('999');
      expect(
        screen.getByText('No characters found for your search.')
      ).toBeInTheDocument();
    });

    it('renders close button on error', () => {
      vi.mocked(useCharacterDetail).mockReturnValue({
        character: null,
        loading: false,
        error: 'Something went wrong.',
      });
      renderWithDetails('999');
      expect(
        screen.getByRole('button', { name: /close/i })
      ).toBeInTheDocument();
    });
  });

  describe('character data', () => {
    beforeEach(() => {
      vi.mocked(useCharacterDetail).mockReturnValue({
        character: mockCharacterDetail,
        loading: false,
        error: null,
      });
    });

    it('renders character name', () => {
      renderWithDetails('1');
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    it('renders character image', () => {
      renderWithDetails('1');
      const img = screen.getByAltText('Rick Sanchez') as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toBe(mockCharacterDetail.image);
    });

    it('renders status', () => {
      renderWithDetails('1');
      expect(screen.getByText('Alive')).toBeInTheDocument();
    });

    it('renders species', () => {
      renderWithDetails('1');
      expect(screen.getByText('Human')).toBeInTheDocument();
    });

    it('renders gender', () => {
      renderWithDetails('1');
      expect(screen.getByText('Male')).toBeInTheDocument();
    });

    it('renders origin', () => {
      renderWithDetails('1');
      expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    });

    it('renders location', () => {
      renderWithDetails('1');
      expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
    });

    it('renders episode count', () => {
      renderWithDetails('1');
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders Unknown for empty type', () => {
      renderWithDetails('1');
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('renders close button', () => {
      renderWithDetails('1');
      expect(
        screen.getByRole('button', { name: /close details/i })
      ).toBeInTheDocument();
    });
  });

  describe('close behaviour', () => {
    beforeEach(() => {
      vi.mocked(useCharacterDetail).mockReturnValue({
        character: mockCharacterDetail,
        loading: false,
        error: null,
      });
    });

    it('removes details param from URL on close click', async () => {
      vi.mocked(useCharacterDetail)
        .mockReturnValueOnce({
          character: mockCharacterDetail,
          loading: false,
          error: null,
        })
        .mockReturnValue({ character: null, loading: false, error: null });

      const LocationDisplay = () => {
        const [searchParams] = useSearchParams();
        return <span data-testid="search">{searchParams.toString()}</span>;
      };

      renderWithMemoryRouter(
        <MemoryRouter initialEntries={['/?details=1']}>
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

      expect(screen.getByTestId('search').textContent).toBe('details=1');

      await userEvent.click(
        screen.getByRole('button', { name: /close details/i })
      );

      await waitFor(() => {
        expect(screen.getByTestId('search').textContent).toBe('');
      });
    });
  });
});
