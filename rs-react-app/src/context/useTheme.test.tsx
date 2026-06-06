import { renderHook } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useTheme } from './useTheme';
import { ThemeContext } from './theme-context';

describe('useTheme', () => {
  test('returns context value when used inside provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider
        value={{
          theme: 'dark',
          setTheme: () => {},
        }}
      >
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), {
      wrapper,
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.setTheme).toBeTypeOf('function');
  });

  test('throws error when used outside ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used inside ThemeProvider'
    );
  });
});
