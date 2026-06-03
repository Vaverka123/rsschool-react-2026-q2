import { MemoryRouter } from 'react-router-dom';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NotFoundPage from './NotFoundPage';

import { renderWithMemoryRouter } from '@/test-utils/renderWithProviders';

describe('NotFoundPage', () => {
  describe('rendering', () => {
    it('renders 404 heading', () => {
      renderWithMemoryRouter(
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      );
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('renders page not found message', () => {
      renderWithMemoryRouter(
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      );
      expect(screen.getByText('Page not found')).toBeInTheDocument();
    });

    it('renders description text', () => {
      renderWithMemoryRouter(
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      );
      expect(
        screen.getByText(/does not exist or has been moved/i)
      ).toBeInTheDocument();
    });

    it('renders back to home link', () => {
      renderWithMemoryRouter(
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      );
      expect(
        screen.getByRole('link', { name: /back to home/i })
      ).toBeInTheDocument();
    });

    it('back to home link points to /', () => {
      renderWithMemoryRouter(
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      );
      expect(
        screen.getByRole('link', { name: /back to home/i })
      ).toHaveAttribute('href', '/');
    });
  });

  describe('navigation', () => {
    it('navigates to home on link click', async () => {
      renderWithMemoryRouter(
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      );
      await userEvent.click(
        screen.getByRole('link', { name: /back to home/i })
      );
      expect(window.location.pathname).toBe('/');
    });
  });
});
