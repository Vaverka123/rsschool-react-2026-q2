import React from 'react';

import { screen } from '@testing-library/react';

import CharacterCard from './CharacterCard';

import { mockCharacter } from '@/test-utils/mocks';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

describe('CharacterCard', () => {
  describe('rendering', () => {
    it('renders character name', () => {
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    it('renders character status and species', () => {
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );
      expect(screen.getByText('Alive · Human')).toBeInTheDocument();
    });

    it('renders character location', () => {
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );
      expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
    });

    it('renders image with correct alt text', () => {
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );
      const img = screen.getByAltText('Rick Sanchez') as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toBe(mockCharacter.image);
    });
  });

  describe('status colors', () => {
    it('renders green dot for Alive status', () => {
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );
      const dot = document.querySelector('.rounded-full') as HTMLElement;
      expect(dot.style.background).toBe('rgb(34, 197, 94)');
    });

    it('renders red dot for Dead status', () => {
      renderWithProviders(
        React.createElement(CharacterCard, {
          character: { ...mockCharacter, status: 'Dead' },
        })
      );
      const dot = document.querySelector('.rounded-full') as HTMLElement;
      expect(dot.style.background).toBe('rgb(239, 68, 68)');
    });

    it('renders gray dot for unknown status', () => {
      renderWithProviders(
        React.createElement(CharacterCard, {
          character: { ...mockCharacter, status: 'unknown' },
        })
      );
      const dot = document.querySelector('.rounded-full') as HTMLElement;
      expect(dot.style.background).toBe('rgb(156, 163, 175)');
    });
  });

  describe('different characters', () => {
    it('renders Dead character correctly', () => {
      renderWithProviders(
        React.createElement(CharacterCard, {
          character: { ...mockCharacter, status: 'Dead', name: 'Evil Rick' },
        })
      );
      expect(screen.getByText('Evil Rick')).toBeInTheDocument();
      expect(screen.getByText('Dead · Human')).toBeInTheDocument();
    });

    it('renders unknown status character correctly', () => {
      renderWithProviders(
        React.createElement(CharacterCard, {
          character: { ...mockCharacter, status: 'unknown', species: 'Alien' },
        })
      );
      expect(screen.getByText('unknown · Alien')).toBeInTheDocument();
    });

    it('renders different location', () => {
      renderWithProviders(
        React.createElement(CharacterCard, {
          character: { ...mockCharacter, location: { name: 'Earth (C-137)' } },
        })
      );
      expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    });
  });
});
