import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Pagination from './Pagination';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

const onPageChange = vi.fn();

beforeEach(() => vi.clearAllMocks());

describe('Pagination', () => {
  describe('rendering', () => {
    it('renders nothing when totalPages is 1', () => {
      renderWithProviders(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={onPageChange}
        />
      );
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('renders nothing when totalPages is 0', () => {
      renderWithProviders(
        <Pagination
          currentPage={1}
          totalPages={0}
          onPageChange={onPageChange}
        />
      );
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('renders navigation when totalPages > 1', () => {
      renderWithProviders(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders prev and next buttons', () => {
      renderWithProviders(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      expect(screen.getByText('←')).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
    });

    it('renders all page buttons for small page count', () => {
      renderWithProviders(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      [1, 2, 3, 4, 5].forEach((p) => {
        expect(
          screen.getByRole('button', { name: String(p) })
        ).toBeInTheDocument();
      });
    });

    it('renders ellipsis for large page count', () => {
      renderWithProviders(
        <Pagination
          currentPage={1}
          totalPages={20}
          onPageChange={onPageChange}
        />
      );
      expect(screen.getByText('…')).toBeInTheDocument();
    });
  });

  describe('disabled states', () => {
    it('disables prev button on first page', () => {
      renderWithProviders(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      expect(screen.getByText('←')).toBeDisabled();
    });

    it('disables next button on last page', () => {
      renderWithProviders(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      expect(screen.getByText('→')).toBeDisabled();
    });

    it('enables prev button when not on first page', () => {
      renderWithProviders(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      expect(screen.getByText('←')).not.toBeDisabled();
    });

    it('enables next button when not on last page', () => {
      renderWithProviders(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      expect(screen.getByText('→')).not.toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('calls onPageChange with next page on next click', async () => {
      renderWithProviders(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      await userEvent.click(screen.getByText('→'));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange with prev page on prev click', async () => {
      renderWithProviders(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      await userEvent.click(screen.getByText('←'));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('calls onPageChange with correct page on page button click', async () => {
      renderWithProviders(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      await userEvent.click(screen.getByRole('button', { name: '3' }));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('does not call onPageChange when clicking current page', async () => {
      renderWithProviders(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      await userEvent.click(screen.getByRole('button', { name: '3' }));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe('active page styling', () => {
    it('highlights current page button', () => {
      renderWithProviders(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      const activeBtn = screen.getByRole('button', {
        name: '3',
      }) as HTMLElement;
      expect(activeBtn.style.background).toBe('var(--accent)');
    });

    it('does not highlight non-current page buttons', () => {
      renderWithProviders(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={onPageChange}
        />
      );
      const inactiveBtn = screen.getByRole('button', {
        name: '1',
      }) as HTMLElement;
      expect(inactiveBtn.style.background).toBe('transparent');
    });
  });
});
