import { create } from 'zustand';

interface CharacterStore {
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
}

const useCharacterStore = create<CharacterStore>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));

export const useSelectedId = () => useCharacterStore((s) => s.selectedId);
export const useSetSelectedId = () => useCharacterStore((s) => s.setSelectedId);

export default useCharacterStore;
