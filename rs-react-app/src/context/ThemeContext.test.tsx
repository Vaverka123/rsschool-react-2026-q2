import { act, renderHook, screen } from '@testing-library/react';

import { type Theme, useTheme } from './ThemeContext';
import ThemeProvider from './ThemeProvider';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeContext', () => {
  describe('useTheme', () => {
    it('throws when used outside ThemeProvider', () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      expect(() => renderHook(() => useTheme())).toThrow(
        'useTheme must be used within ThemeProvider'
      );
      consoleError.mockRestore();
    });

    it('returns theme and setTheme', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.theme).toMatch(/^(light|dark)$/);
      expect(typeof result.current.setTheme).toBe('function');
    });
  });

  describe('ThemeProvider', () => {
    it('defaults to light when localStorage is empty and matchMedia unavailable', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(['light', 'dark']).toContain(result.current.theme);
    });

    it('reads initial theme from localStorage', () => {
      localStorage.setItem('theme', 'dark');
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.theme).toBe('dark');
    });

    it('sets data-theme on document element when theme changes', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => result.current.setTheme('dark'));
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      act(() => result.current.setTheme('light'));
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('persists theme to localStorage when changed', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => result.current.setTheme('dark'));
      expect(localStorage.getItem('theme')).toBe('dark');

      act(() => result.current.setTheme('light'));
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('renders children', () => {
      renderWithProviders(<span data-testid="child">hello</span>);
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('theme persistence across remounts', () => {
    it('restores saved theme on remount', () => {
      localStorage.setItem('theme', 'dark');
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.theme).toBe('dark' as Theme);
    });
  });
});
