import { create } from 'zustand';

interface CharacterStore {
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  checkedIds: number[];
  toggleCheckedId: (id: number) => void;
  clearCheckedIds: () => void;
}

const useCharacterStore = create<CharacterStore>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
  checkedIds: [],
  toggleCheckedId: (id) =>
    set((state) => ({
      checkedIds: state.checkedIds.includes(id)
        ? state.checkedIds.filter((i) => i !== id)
        : [...state.checkedIds, id],
    })),
  clearCheckedIds: () => set({ checkedIds: [] }),
}));

export const useSelectedId = () => useCharacterStore((s) => s.selectedId);
export const useSetSelectedId = () => useCharacterStore((s) => s.setSelectedId);
export const useCheckedIds = () => useCharacterStore((s) => s.checkedIds);
export const useToggleCheckedId = () =>
  useCharacterStore((s) => s.toggleCheckedId);
export const useClearCheckedIds = () =>
  useCharacterStore((s) => s.clearCheckedIds);

export default useCharacterStore;
