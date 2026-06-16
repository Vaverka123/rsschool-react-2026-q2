import SkeletonCard from './SkeletonCard';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

describe('SkeletonCard', () => {
  describe('rendering', () => {
    it('renders a list item', () => {
      renderWithProviders(<SkeletonCard />);
      expect(document.querySelector('li')).toBeInTheDocument();
    });

    it('has animate-pulse class', () => {
      renderWithProviders(<SkeletonCard />);
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders image placeholder', () => {
      renderWithProviders(<SkeletonCard />);
      expect(document.querySelector('.aspect-square')).toBeInTheDocument();
    });

    it('renders name placeholder', () => {
      renderWithProviders(<SkeletonCard />);
      expect(document.querySelector('.h-4')).toBeInTheDocument();
    });

    it('renders status dot placeholder', () => {
      renderWithProviders(<SkeletonCard />);
      expect(document.querySelector('.rounded-full')).toBeInTheDocument();
    });

    it('renders all skeleton blocks', () => {
      renderWithProviders(<SkeletonCard />);
      const blocks = document.querySelectorAll('[style*="var(--border)"]');
      expect(blocks.length).toBe(6);
    });
  });
});
