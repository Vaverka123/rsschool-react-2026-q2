import { act, renderHook } from '@testing-library/react';

import { mockCharacter, mockCharacters } from '@/test-utils/mocks';

import useCharacterStore, {
  useCheckedItems,
  useClearCheckedItems,
  useToggleCheckedItem,
} from './characterStore';

beforeEach(() => {
  act(() => useCharacterStore.setState({ checkedItems: [] }));
});

describe('characterStore', () => {
  describe('initial state', () => {
    it('checkedItems is empty by default', () => {
      const { result } = renderHook(() => useCheckedItems());
      expect(result.current).toEqual([]);
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
});
