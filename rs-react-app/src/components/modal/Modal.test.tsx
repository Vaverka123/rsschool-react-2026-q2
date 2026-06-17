import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Modal from './Modal';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

const onClose = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

const renderModal = (isOpen: boolean) =>
  renderWithProviders(
    <Modal isOpen={isOpen} onClose={onClose} title="Test Modal">
      <button>First</button>
      <button>Last</button>
    </Modal>
  );

describe('Modal', () => {
  describe('visibility', () => {
    it('renders nothing when closed', () => {
      renderModal(false);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders dialog when open', () => {
      renderModal(true);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders the title', () => {
      renderModal(true);
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('renders children', () => {
      renderModal(true);
      expect(screen.getByText('First')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has aria-modal="true"', () => {
      renderModal(true);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-labelledby pointing to the title', () => {
      renderModal(true);
      const dialog = screen.getByRole('dialog');
      const labelId = dialog.getAttribute('aria-labelledby');
      expect(labelId).toBeTruthy();
      expect(document.getElementById(labelId!)).toHaveTextContent('Test Modal');
    });

    it('has a close button with accessible label', () => {
      renderModal(true);
      expect(
        screen.getByRole('button', { name: /close modal/i })
      ).toBeInTheDocument();
    });
  });

  describe('close behaviour', () => {
    it('calls onClose when close button is clicked', async () => {
      renderModal(true);
      await userEvent.click(screen.getByRole('button', { name: /close modal/i }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', async () => {
      renderModal(true);
      await userEvent.click(screen.getByTestId('modal-backdrop'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when ESC key is pressed', async () => {
      renderModal(true);
      await userEvent.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on non-ESC key press', async () => {
      renderModal(true);
      await userEvent.keyboard('{ArrowDown}');
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('focus management', () => {
    it('moves focus into the modal when opened', async () => {
      renderModal(true);
      await waitFor(() => {
        expect(document.activeElement).not.toBe(document.body);
      });
      expect(screen.getByRole('dialog')).toContainElement(
        document.activeElement as HTMLElement
      );
    });
  });
});
