import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ErrorBoundary from './ErrorBoundary';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Test error message');
  return <div>Children rendered</div>;
};

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  describe('normal render', () => {
    it('renders children when no error', () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );
      expect(screen.getByText('Children rendered')).toBeInTheDocument();
    });

    it('does not show fallback UI when no error', () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );
      expect(
        screen.queryByText('Something went wrong')
      ).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders fallback UI when error is thrown', () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('displays the error message', () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('hides children when error is thrown', () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.queryByText('Children rendered')).not.toBeInTheDocument();
    });

    it('renders try again button', () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });

    it('logs error to console', () => {
      renderWithProviders(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(console.error).toHaveBeenCalledWith(
        '[ErrorBoundary]',
        expect.any(Error),
        expect.any(String)
      );
    });
  });

  describe('custom fallback', () => {
    it('renders custom fallback when provided', () => {
      renderWithProviders(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });

    it('does not render default fallback when custom one is provided', () => {
      renderWithProviders(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(
        screen.queryByText('Something went wrong')
      ).not.toBeInTheDocument();
    });
  });

  describe('reset', () => {
    it('resets error state after try again is clicked', async () => {
      let shouldThrow = true;

      const Thrower = () => {
        if (shouldThrow) throw new Error('Test error message');
        return <div>Recovered</div>;
      };

      renderWithProviders(
        <ErrorBoundary>
          <Thrower />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      shouldThrow = false;
      await userEvent.click(screen.getByRole('button', { name: /try again/i }));

      expect(
        screen.queryByText('Something went wrong')
      ).not.toBeInTheDocument();
      expect(screen.getByText('Recovered')).toBeInTheDocument();
    });
  });
});
