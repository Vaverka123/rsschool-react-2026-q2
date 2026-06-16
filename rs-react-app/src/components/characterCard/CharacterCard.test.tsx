import React from 'react';

import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CharacterCard from './CharacterCard';

import useCharacterStore from '@/store/characterStore';
import { mockCharacter } from '@/test-utils/mocks';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

beforeEach(() => {
  act(() => useCharacterStore.setState({ checkedItems: [] }));
});

afterEach(() => {
  window.history.replaceState({}, '', '/');
});

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

    it('renders a checkbox for selection', () => {
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );
      expect(
        screen.getByRole('checkbox', { name: /select rick sanchez/i })
      ).toBeInTheDocument();
    });

    it('checkbox is unchecked by default', () => {
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );
      const checkbox = screen.getByRole('checkbox', {
        name: /select rick sanchez/i,
      }) as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });

    it('checkbox is checked when character is in checkedItems', () => {
      act(() =>
        useCharacterStore.setState({ checkedItems: [mockCharacter] })
      );
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );
      const checkbox = screen.getByRole('checkbox', {
        name: /select rick sanchez/i,
      }) as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
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

  describe('checkbox interaction', () => {
    it('checking the checkbox adds the character to checkedItems', async () => {
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );
      const checkbox = screen.getByRole('checkbox', {
        name: /select rick sanchez/i,
      });

      await userEvent.click(checkbox);

      const { checkedItems } = useCharacterStore.getState();
      expect(checkedItems.some((c) => c.id === mockCharacter.id)).toBe(true);
    });

    it('unchecking the checkbox removes the character from checkedItems', async () => {
      act(() =>
        useCharacterStore.setState({ checkedItems: [mockCharacter] })
      );
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );
      const checkbox = screen.getByRole('checkbox', {
        name: /select rick sanchez/i,
      });

      await userEvent.click(checkbox);

      const { checkedItems } = useCharacterStore.getState();
      expect(checkedItems.some((c) => c.id === mockCharacter.id)).toBe(false);
    });

    it('checking the checkbox does not add details param to URL', async () => {
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );
      const checkbox = screen.getByRole('checkbox', {
        name: /select rick sanchez/i,
      });

      await userEvent.click(checkbox);

      expect(new URLSearchParams(window.location.search).get('details')).toBeNull();
    });
  });

  describe('card click interaction', () => {
    it('clicking the card body adds details param to URL', async () => {
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );

      await userEvent.click(screen.getByText('Rick Sanchez'));

      expect(new URLSearchParams(window.location.search).get('details')).toBe(
        String(mockCharacter.id)
      );
    });

    it('clicking the card body does not affect checkedItems', async () => {
      renderWithProviders(
        React.createElement(CharacterCard, { character: mockCharacter })
      );

      await userEvent.click(screen.getByText('Rick Sanchez'));

      expect(useCharacterStore.getState().checkedItems).toEqual([]);
    });
  });
});
