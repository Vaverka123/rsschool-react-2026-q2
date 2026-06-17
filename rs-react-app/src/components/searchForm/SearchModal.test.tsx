import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchModal from './SearchModal';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

const onClose = vi.fn();
const onSearch = vi.fn();

beforeEach(() => vi.clearAllMocks());

const renderSearchModal = (isOpen = true, initialQuery = '') =>
  renderWithProviders(
    <SearchModal
      isOpen={isOpen}
      onClose={onClose}
      initialQuery={initialQuery}
      onSearch={onSearch}
    />
  );

describe('SearchModal', () => {
  describe('rendering', () => {
    it('renders both form tabs', () => {
      renderSearchModal();
      expect(screen.getByRole('tab', { name: /uncontrolled/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /react hook form/i })).toBeInTheDocument();
    });

    it('shows uncontrolled tab as selected by default', () => {
      renderSearchModal();
      expect(
        screen.getByRole('tab', { name: /uncontrolled/i })
      ).toHaveAttribute('aria-selected', 'true');
    });

    it('switches to RHF form when tab clicked', async () => {
      renderSearchModal();
      await userEvent.click(screen.getByRole('tab', { name: /react hook form/i }));
      expect(screen.getByText('React Hook Form + Zod')).toBeInTheDocument();
    });
  });

  describe('uncontrolled form', () => {
    it('submits search and closes modal', async () => {
      renderSearchModal();
      const input = screen.getByLabelText(/character name/i);
      await userEvent.clear(input);
      await userEvent.type(input, 'Rick');
      await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
      expect(onSearch).toHaveBeenCalledWith('Rick');
      expect(onClose).toHaveBeenCalled();
    });

    it('shows error for 1-character query', async () => {
      renderSearchModal();
      const input = screen.getByLabelText(/character name/i);
      await userEvent.type(input, 'R');
      await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
      expect(await screen.findByRole('alert')).toHaveTextContent(
        /at least 2 characters/i
      );
      expect(onSearch).not.toHaveBeenCalled();
    });

    it('allows empty query (show all)', async () => {
      renderSearchModal();
      await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
      expect(onSearch).toHaveBeenCalledWith('');
    });
  });

  describe('React Hook Form', () => {
    const switchToRHF = async () => {
      renderSearchModal();
      await userEvent.click(screen.getByRole('tab', { name: /react hook form/i }));
    };

    it('submits valid query', async () => {
      await switchToRHF();
      const input = screen.getByLabelText(/character name/i);
      await userEvent.type(input, 'Morty');
      await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
      expect(onSearch).toHaveBeenCalledWith('Morty');
    });

    it('shows Zod error for 1-character query', async () => {
      await switchToRHF();
      const input = screen.getByLabelText(/character name/i);
      await userEvent.type(input, 'M');
      await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          /at least 2 characters/i
        );
      });
      expect(onSearch).not.toHaveBeenCalled();
    });

    it('marks input as invalid on error', async () => {
      await switchToRHF();
      const input = screen.getByLabelText(/character name/i);
      await userEvent.type(input, 'M');
      await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });
});
