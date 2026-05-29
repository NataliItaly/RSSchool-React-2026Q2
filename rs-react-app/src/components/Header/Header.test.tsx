import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
//import { ThemeProvider } from '../../context/ThemeProvider';
import { useTheme } from '../../context/useTheme';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../context/useTheme');
const mockSetTheme = vi.fn();
const mockUseTheme = vi.mocked(useTheme);

beforeEach(() => {
  vi.clearAllMocks();

  mockUseTheme.mockReturnValue({
    theme: 'light',
    setTheme: mockSetTheme,
  });
});

describe('Header component', () => {
  test('renders Header title', () => {
    render(
      <MemoryRouter>
        <Header  />
      </MemoryRouter>
    );

    expect(screen.getByText(/Rick and Morty App/i)).toBeInTheDocument();
  });

  test('renders Header component', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('renders Header component', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Rick and Morty App');
  });

  test('renders theme select with current theme', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox');

    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('light');
  });
  test('calls setTheme when theme changes', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const select = screen.getByRole('combobox');

    fireEvent.change(select, {
      target: { value: 'dark' },
    });

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });
});
