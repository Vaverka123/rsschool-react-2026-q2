import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ErrorBoundary from './ErrorBoundary';
import ErrorTrigger from './ErrorTrigger';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorTrigger', () => {
  describe('rendering', () => {
    it('renders simulate error button', () => {
      renderWithProviders(<ErrorTrigger />);
      expect(
        screen.getByRole('button', { name: /simulate error/i })
      ).toBeInTheDocument();
    });
  });

  describe('behaviour', () => {
    it('throws error when button is clicked', async () => {
      renderWithProviders(
        <ErrorBoundary>
          <ErrorTrigger />
        </ErrorBoundary>
      );

      await userEvent.click(
        screen.getByRole('button', { name: /simulate error/i })
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText('Test error triggered by user')
      ).toBeInTheDocument();
    });

    it('logs error to console when triggered', async () => {
      renderWithProviders(
        <ErrorBoundary>
          <ErrorTrigger />
        </ErrorBoundary>
      );

      await userEvent.click(
        screen.getByRole('button', { name: /simulate error/i })
      );

      expect(console.error).toHaveBeenCalled();
    });
  });
});
