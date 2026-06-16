import { screen } from '@testing-library/react';

import SearchResults from './SearchResults';

import { mockCharacters } from '@/test-utils/mocks';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

describe('SearchResults', () => {
  it('renders skeleton cards when loading', () => {
    renderWithProviders(
      <SearchResults results={[]} loading={true} error={null} />
    );
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error message', () => {
    renderWithProviders(
      <SearchResults
        results={[]}
        loading={false}
        error="No characters found."
      />
    );
    expect(screen.getByText('No characters found.')).toBeInTheDocument();
  });

  it('renders character cards', () => {
    renderWithProviders(
      <SearchResults results={mockCharacters} loading={false} error={null} />
    );
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('renders correct number of cards', () => {
    renderWithProviders(
      <SearchResults results={mockCharacters} loading={false} error={null} />
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(mockCharacters.length);
  });
});
