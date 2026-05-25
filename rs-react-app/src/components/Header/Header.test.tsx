import { render, screen } from '@testing-library/react';
import Header from './Header';
import { ThemeProvider } from '../../context/ThemeProvider';
import { useTheme } from '../../context/useTheme';
import { fireEvent } from '@testing-library/react';

vi.mock('../../context/useTheme');
const mockSetTheme = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(useTheme).mockReturnValue({
    theme: 'light',
    setTheme: mockSetTheme,
  });
});

describe('Header component', () => {
  test('renders Header title', () => {
    render(
      <ThemeProvider>
        <Header  />
      </ThemeProvider>
    );

    expect(screen.getByText(/Rick and Morty App/i)).toBeInTheDocument();
  });
  test('renders Header component', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
  test('renders Header component', () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Rick and Morty App');
  });
  test('renders theme select with current theme', () => {
    render(<Header />);

    const select = screen.getByRole('combobox');

    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('light');
  });
  test('calls setTheme when theme changes', () => {
    render(<Header />);

    const select = screen.getByRole('combobox');

    fireEvent.change(select, {
      target: { value: 'dark' },
    });

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });
});
