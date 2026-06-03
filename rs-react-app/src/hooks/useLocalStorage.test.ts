import { act, renderHook } from '@testing-library/react';

import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('returns stored value when exists', () => {
    localStorage.setItem('key', JSON.stringify('saved'));
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('saved');
  });

  it('updates value and persists to storage', () => {
    const { result } = renderHook(() => useLocalStorage('key', ''));
    act(() => result.current[1]('new value'));
    expect(result.current[0]).toBe('new value');
    expect(localStorage.getItem('key')).toBe('"new value"');
  });
});
