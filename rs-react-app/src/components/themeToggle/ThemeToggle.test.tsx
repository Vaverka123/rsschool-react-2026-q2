import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ThemeToggle from './ThemeToggle';

import ThemeProvider from '@/context/ThemeProvider';
import { useTheme } from '@/context/ThemeContext';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { renderHook } from '@testing-library/react';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeToggle', () => {
  it('renders a button', () => {
    renderWithProviders(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has accessible aria-label describing the action', () => {
    localStorage.setItem('theme', 'light');
    renderWithProviders(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: /switch to dark theme/i })
    ).toBeInTheDocument();
  });

  it('switches aria-label when theme is dark', () => {
    localStorage.setItem('theme', 'dark');
    renderWithProviders(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: /switch to light theme/i })
    ).toBeInTheDocument();
  });

  it('toggles from light to dark on click', async () => {
    localStorage.setItem('theme', 'light');
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });
    renderWithProviders(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button'));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggles from dark to light on click', async () => {
    localStorage.setItem('theme', 'dark');
    renderWithProviders(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button'));

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('updates aria-label after toggling', async () => {
    localStorage.setItem('theme', 'light');
    renderWithProviders(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button'));

    expect(
      screen.getByRole('button', { name: /switch to light theme/i })
    ).toBeInTheDocument();
  });
});
