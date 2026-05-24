import { render, screen } from '@testing-library/react';
import Header from './Header';
import { ThemeProvider } from '../../context/ThemeProvider';

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
});
