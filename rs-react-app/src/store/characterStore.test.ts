import { act, renderHook } from '@testing-library/react';

import { mockCharacter, mockCharacters } from '@/test-utils/mocks';

import useCharacterStore, {
  useCheckedItems,
  useClearCheckedItems,
  useSelectedId,
  useSetSelectedId,
  useToggleCheckedItem,
} from './characterStore';

beforeEach(() => {
  act(() =>
    useCharacterStore.setState({ selectedId: null, checkedItems: [] })
  );
});

describe('characterStore', () => {
  describe('initial state', () => {
    it('selectedId is null by default', () => {
      const { result } = renderHook(() => useSelectedId());
      expect(result.current).toBeNull();
    });

    it('checkedItems is empty by default', () => {
      const { result } = renderHook(() => useCheckedItems());
      expect(result.current).toEqual([]);
    });
  });

  describe('setSelectedId', () => {
    it('sets selectedId', () => {
      const { result } = renderHook(() => ({
        selectedId: useSelectedId(),
        setSelectedId: useSetSelectedId(),
      }));

      act(() => result.current.setSelectedId(42));
      expect(result.current.selectedId).toBe(42);
    });

    it('clears selectedId when set to null', () => {
      const { result } = renderHook(() => ({
        selectedId: useSelectedId(),
        setSelectedId: useSetSelectedId(),
      }));

      act(() => result.current.setSelectedId(1));
      act(() => result.current.setSelectedId(null));
      expect(result.current.selectedId).toBeNull();
    });

    it('updates selectedId to new value', () => {
      const { result } = renderHook(() => ({
        selectedId: useSelectedId(),
        setSelectedId: useSetSelectedId(),
      }));

      act(() => result.current.setSelectedId(1));
      act(() => result.current.setSelectedId(2));
      expect(result.current.selectedId).toBe(2);
    });
  });

  describe('toggleCheckedItem', () => {
    it('adds character to checkedItems when not present', () => {
      const { result } = renderHook(() => ({
        checkedItems: useCheckedItems(),
        toggleCheckedItem: useToggleCheckedItem(),
      }));

      act(() => result.current.toggleCheckedItem(mockCharacter));
      expect(result.current.checkedItems).toEqual([mockCharacter]);
    });

    it('removes character from checkedItems when already present', () => {
      const { result } = renderHook(() => ({
        checkedItems: useCheckedItems(),
        toggleCheckedItem: useToggleCheckedItem(),
      }));

      act(() => result.current.toggleCheckedItem(mockCharacter));
      act(() => result.current.toggleCheckedItem(mockCharacter));
      expect(result.current.checkedItems).toEqual([]);
    });

    it('can select multiple characters independently', () => {
      const { result } = renderHook(() => ({
        checkedItems: useCheckedItems(),
        toggleCheckedItem: useToggleCheckedItem(),
      }));

      act(() => result.current.toggleCheckedItem(mockCharacters[0]));
      act(() => result.current.toggleCheckedItem(mockCharacters[1]));
      act(() => result.current.toggleCheckedItem(mockCharacters[2]));
      expect(result.current.checkedItems).toHaveLength(3);
    });

    it('only removes the toggled character, leaving others intact', () => {
      const { result } = renderHook(() => ({
        checkedItems: useCheckedItems(),
        toggleCheckedItem: useToggleCheckedItem(),
      }));

      act(() => result.current.toggleCheckedItem(mockCharacters[0]));
      act(() => result.current.toggleCheckedItem(mockCharacters[1]));
      act(() => result.current.toggleCheckedItem(mockCharacters[0]));
      expect(result.current.checkedItems).toEqual([mockCharacters[1]]);
    });
  });

  describe('clearCheckedItems', () => {
    it('removes all checked items', () => {
      const { result } = renderHook(() => ({
        checkedItems: useCheckedItems(),
        toggleCheckedItem: useToggleCheckedItem(),
        clearCheckedItems: useClearCheckedItems(),
      }));

      act(() => result.current.toggleCheckedItem(mockCharacters[0]));
      act(() => result.current.toggleCheckedItem(mockCharacters[1]));
      act(() => result.current.clearCheckedItems());
      expect(result.current.checkedItems).toEqual([]);
    });

    it('is a no-op when checkedItems is already empty', () => {
      const { result } = renderHook(() => ({
        checkedItems: useCheckedItems(),
        clearCheckedItems: useClearCheckedItems(),
      }));

      act(() => result.current.clearCheckedItems());
      expect(result.current.checkedItems).toEqual([]);
    });
  });

  describe('selectedId and checkedItems are independent', () => {
    it('toggling checkedItem does not affect selectedId', () => {
      const { result } = renderHook(() => ({
        selectedId: useSelectedId(),
        setSelectedId: useSetSelectedId(),
        checkedItems: useCheckedItems(),
        toggleCheckedItem: useToggleCheckedItem(),
      }));

      act(() => result.current.setSelectedId(mockCharacter.id));
      act(() => result.current.toggleCheckedItem(mockCharacter));
      expect(result.current.selectedId).toBe(mockCharacter.id);
      expect(result.current.checkedItems).toEqual([mockCharacter]);
    });
  });
});
