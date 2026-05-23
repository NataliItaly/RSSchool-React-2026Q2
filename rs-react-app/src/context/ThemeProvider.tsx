import { useEffect, useState, useMemo } from 'react';
import { ThemeContext, type Theme } from './theme-context';

type ThemeProviderProps = Readonly<{ children: React.ReactNode }>

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const value = useMemo(() => ({theme, setTheme}), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
