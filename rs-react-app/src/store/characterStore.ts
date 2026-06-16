import { create } from 'zustand';

import type { Character } from '@/types/character';

interface CharacterStore {
  checkedItems: Character[];
  toggleCheckedItem: (character: Character) => void;
  clearCheckedItems: () => void;
}

const useCharacterStore = create<CharacterStore>((set) => ({
  checkedItems: [],
  toggleCheckedItem: (character) =>
    set((state) => ({
      checkedItems: state.checkedItems.some((c) => c.id === character.id)
        ? state.checkedItems.filter((c) => c.id !== character.id)
        : [...state.checkedItems, character],
    })),
  clearCheckedItems: () => set({ checkedItems: [] }),
}));

export const useCheckedItems = () => useCharacterStore((s) => s.checkedItems);
export const useToggleCheckedItem = () =>
  useCharacterStore((s) => s.toggleCheckedItem);
export const useClearCheckedItems = () =>
  useCharacterStore((s) => s.clearCheckedItems);

export default useCharacterStore;
