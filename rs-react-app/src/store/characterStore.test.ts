import { act, renderHook } from '@testing-library/react';

import useCharacterStore, {
  useSelectedId,
  useSetSelectedId,
} from './characterStore';

beforeEach(() => {
  act(() => useCharacterStore.setState({ selectedId: null }));
});

describe('characterStore', () => {
  describe('initial state', () => {
    it('selectedId is null by default', () => {
      const { result } = renderHook(() => useSelectedId());
      expect(result.current).toBeNull();
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
});
