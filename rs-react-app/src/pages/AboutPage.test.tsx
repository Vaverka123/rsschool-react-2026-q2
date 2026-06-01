import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AboutPage from './AboutPage';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

describe('AboutPage', () => {
  describe('rendering', () => {
    it('renders page heading', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText('About This App')).toBeInTheDocument();
    });

    it('renders author name', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/vera maslava/i)).toBeInTheDocument();
    });

    it('renders RS School course link', () => {
      renderWithProviders(<AboutPage />);
      const link = screen.getByRole('link', {
        name: /rs school react course/i,
      });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    });

    it('renders RS School link opening in new tab', () => {
      renderWithProviders(<AboutPage />);
      const link = screen.getByRole('link', {
        name: /rs school react course/i,
      });
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('renders home navigation link', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    });

    it('renders app description', () => {
      renderWithProviders(<AboutPage />);
      expect(screen.getByText(/rick and morty api/i)).toBeInTheDocument();
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
