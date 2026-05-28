import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AboutPage from './AboutPage';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

describe('AboutPage', () => {
  describe('rendering', () => {
    it('renders heading', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText('About This App')).toBeInTheDocument();
    });

    it('renders description text', () => {
      renderWithProviders(<AboutPage />);
      expect(
        screen.getByText(/simple React application built with Vite/i)
      ).toBeInTheDocument();
    });

    it('renders github link', () => {
      renderWithProviders(<AboutPage />);
      const link = screen.getByRole('link', { name: /github/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/your-username/react-vite-app'
      );
    });

    it('renders home navigation link', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('home link points to /', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
        'href',
        '/'
      );
    });

    it('navigates to home on link click', async () => {
      renderWithProviders(<AboutPage />);
      await userEvent.click(screen.getByRole('link', { name: /home/i }));
      expect(window.location.pathname).toBe('/');
    });
  });
});
