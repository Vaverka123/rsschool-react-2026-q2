import { create } from 'zustand';

import type { Character } from '@/types/character';

interface CharacterStore {
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  checkedItems: Character[];
  toggleCheckedItem: (character: Character) => void;
  clearCheckedItems: () => void;
}

const useCharacterStore = create<CharacterStore>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
  checkedItems: [],
  toggleCheckedItem: (character) =>
    set((state) => ({
      checkedItems: state.checkedItems.some((c) => c.id === character.id)
        ? state.checkedItems.filter((c) => c.id !== character.id)
        : [...state.checkedItems, character],
    })),
  clearCheckedItems: () => set({ checkedItems: [] }),
}));

export const useSelectedId = () => useCharacterStore((s) => s.selectedId);
export const useSetSelectedId = () => useCharacterStore((s) => s.setSelectedId);
export const useCheckedItems = () => useCharacterStore((s) => s.checkedItems);
export const useToggleCheckedItem = () =>
  useCharacterStore((s) => s.toggleCheckedItem);
export const useClearCheckedItems = () =>
  useCharacterStore((s) => s.clearCheckedItems);

export default useCharacterStore;
