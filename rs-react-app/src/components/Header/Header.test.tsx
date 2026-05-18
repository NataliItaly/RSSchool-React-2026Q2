import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header component', () => {
  test('renders Header title', () => {
    render(<Header  />);

    expect(screen.getByText(/Rick and Morty App/i)).toBeInTheDocument();
  });
  test('renders Header component', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
  test('renders Header component', () => {
    render(<Header />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Rick and Morty App');
  });
});
