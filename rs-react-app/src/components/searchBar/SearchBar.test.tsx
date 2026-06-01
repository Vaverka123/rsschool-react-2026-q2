import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchBar from './SearchBar';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

const onSearch = vi.fn();
const onChange = vi.fn();

beforeEach(() => vi.clearAllMocks());

describe('SearchBar', () => {
  describe('rendering', () => {
    it('renders input with default placeholder', () => {
      renderWithProviders(
        <SearchBar value="" onChange={onChange} onSearch={onSearch} />
      );
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders input with custom placeholder', () => {
      renderWithProviders(
        <SearchBar
          value=""
          onChange={onChange}
          onSearch={onSearch}
          placeholder="Search characters..."
        />
      );
      expect(
        screen.getByPlaceholderText('Search characters...')
      ).toBeInTheDocument();
    });

    it('renders search button', () => {
      renderWithProviders(
        <SearchBar value="" onChange={onChange} onSearch={onSearch} />
      );
      expect(
        screen.getByRole('button', { name: /search/i })
      ).toBeInTheDocument();
    });

    it('displays the current value', () => {
      renderWithProviders(
        <SearchBar value="Rick" onChange={onChange} onSearch={onSearch} />
      );
      expect(screen.getByDisplayValue('Rick')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onChange when typing', async () => {
      renderWithProviders(
        <SearchBar value="" onChange={onChange} onSearch={onSearch} />
      );
      await userEvent.type(screen.getByRole('textbox'), 'Rick');
      expect(onChange).toHaveBeenCalled();
    });

    it('calls onSearch when button clicked', async () => {
      renderWithProviders(
        <SearchBar value="Rick" onChange={onChange} onSearch={onSearch} />
      );
      await userEvent.click(screen.getByRole('button', { name: /search/i }));
      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it('calls onSearch when Enter key pressed', async () => {
      renderWithProviders(
        <SearchBar value="Rick" onChange={onChange} onSearch={onSearch} />
      );
      await userEvent.type(screen.getByRole('textbox'), '{Enter}');
      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it('does not call onSearch on other key presses', async () => {
      renderWithProviders(
        <SearchBar value="" onChange={onChange} onSearch={onSearch} />
      );
      await userEvent.type(screen.getByRole('textbox'), 'a');
      expect(onSearch).not.toHaveBeenCalled();
    });
  });
});
