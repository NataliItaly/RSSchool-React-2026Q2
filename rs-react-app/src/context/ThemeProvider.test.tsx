import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useContext } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { ThemeContext } from './theme-context';
import { useLocalStorage } from '../hooks/useLocalStorage';

vi.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

const mockUseLocalStorage = vi.mocked(useLocalStorage);

function TestConsumer() {
  const context = useContext(ThemeContext);
  if (!context) {
    return null;
  }

  return (
    <>
      <span>{context.theme}</span>
      <button onClick={() => context.setTheme('dark')}>change</button>
    </>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    vi.clearAllMocks();
  });

  test('initializes theme from localStorage hook', () => {
    mockUseLocalStorage.mockReturnValue(['light', vi.fn()]);

    render(
      <ThemeProvider>
        <div>content</div>
      </ThemeProvider>
    );

    expect(mockUseLocalStorage).toHaveBeenCalledWith('theme', 'light');
  });

  test('adds dark class when theme is dark', () => {
    mockUseLocalStorage.mockReturnValue(['dark', vi.fn()]);

    render(
      <ThemeProvider>
        <div>content</div>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('removes dark class when theme is light', () => {
    document.documentElement.classList.add('dark');

    mockUseLocalStorage.mockReturnValue(['light', vi.fn()]);

    render(
      <ThemeProvider>
        <div>content</div>
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('provides theme context value', () => {
    const setTheme = vi.fn();

    mockUseLocalStorage.mockReturnValue(['dark', setTheme]);

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByText('dark')).toBeInTheDocument();
  });

  test('exposes setTheme through context', () => {
    const setTheme = vi.fn();

    mockUseLocalStorage.mockReturnValue(['light', setTheme]);

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /change/i }));

    expect(setTheme).toHaveBeenCalledWith('dark');
  });
});