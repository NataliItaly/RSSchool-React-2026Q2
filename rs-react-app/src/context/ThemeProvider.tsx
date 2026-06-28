'use client';

import { useEffect, useMemo } from 'react';
import { ThemeContext, type Theme } from './theme-context';
import { useLocalStorage } from '../hooks/useLocalStorage';

type ThemeProviderProps = Readonly<{ children: React.ReactNode }>;

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
