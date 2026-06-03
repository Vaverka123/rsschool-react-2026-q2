import { act, renderHook } from '@testing-library/react';

import useCharacterStore, {
  useCheckedIds,
  useClearCheckedIds,
  useSelectedId,
  useSetSelectedId,
  useToggleCheckedId,
} from './characterStore';

beforeEach(() => {
  act(() =>
    useCharacterStore.setState({ selectedId: null, checkedIds: [] })
  );
});

describe('characterStore', () => {
  describe('initial state', () => {
    it('selectedId is null by default', () => {
      const { result } = renderHook(() => useSelectedId());
      expect(result.current).toBeNull();
    });

    it('checkedIds is empty by default', () => {
      const { result } = renderHook(() => useCheckedIds());
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

  describe('toggleCheckedId', () => {
    it('adds id to checkedIds when not present', () => {
      const { result } = renderHook(() => ({
        checkedIds: useCheckedIds(),
        toggleCheckedId: useToggleCheckedId(),
      }));

      act(() => result.current.toggleCheckedId(1));
      expect(result.current.checkedIds).toEqual([1]);
    });

    it('removes id from checkedIds when already present', () => {
      const { result } = renderHook(() => ({
        checkedIds: useCheckedIds(),
        toggleCheckedId: useToggleCheckedId(),
      }));

      act(() => result.current.toggleCheckedId(1));
      act(() => result.current.toggleCheckedId(1));
      expect(result.current.checkedIds).toEqual([]);
    });

    it('can select multiple ids independently', () => {
      const { result } = renderHook(() => ({
        checkedIds: useCheckedIds(),
        toggleCheckedId: useToggleCheckedId(),
      }));

      act(() => result.current.toggleCheckedId(1));
      act(() => result.current.toggleCheckedId(3));
      act(() => result.current.toggleCheckedId(5));
      expect(result.current.checkedIds).toEqual([1, 3, 5]);
    });

    it('only removes the toggled id, leaving others intact', () => {
      const { result } = renderHook(() => ({
        checkedIds: useCheckedIds(),
        toggleCheckedId: useToggleCheckedId(),
      }));

      act(() => result.current.toggleCheckedId(1));
      act(() => result.current.toggleCheckedId(2));
      act(() => result.current.toggleCheckedId(1));
      expect(result.current.checkedIds).toEqual([2]);
    });
  });

  describe('clearCheckedIds', () => {
    it('removes all checked ids', () => {
      const { result } = renderHook(() => ({
        checkedIds: useCheckedIds(),
        toggleCheckedId: useToggleCheckedId(),
        clearCheckedIds: useClearCheckedIds(),
      }));

      act(() => result.current.toggleCheckedId(1));
      act(() => result.current.toggleCheckedId(2));
      act(() => result.current.clearCheckedIds());
      expect(result.current.checkedIds).toEqual([]);
    });

    it('is a no-op when checkedIds is already empty', () => {
      const { result } = renderHook(() => ({
        checkedIds: useCheckedIds(),
        clearCheckedIds: useClearCheckedIds(),
      }));

      act(() => result.current.clearCheckedIds());
      expect(result.current.checkedIds).toEqual([]);
    });
  });

  describe('selectedId and checkedIds are independent', () => {
    it('toggling checkedId does not affect selectedId', () => {
      const { result } = renderHook(() => ({
        selectedId: useSelectedId(),
        setSelectedId: useSetSelectedId(),
        checkedIds: useCheckedIds(),
        toggleCheckedId: useToggleCheckedId(),
      }));

      act(() => result.current.setSelectedId(5));
      act(() => result.current.toggleCheckedId(5));
      expect(result.current.selectedId).toBe(5);
      expect(result.current.checkedIds).toEqual([5]);
    });
  });
});
