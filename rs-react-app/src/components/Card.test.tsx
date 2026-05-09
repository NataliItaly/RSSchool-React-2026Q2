import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card component', () => {
  const mockItem = {
    id: 1,
    name: 'Rick Sanchez',
    image: 'https://example.com/rick.png',
    gender: 'Male',
    species: 'Human',
  };

  test('renders character name', () => {
    render(<Card item={mockItem} />);

    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
  });

  test('renders character image', () => {
    render(<Card item={mockItem} />);

    const image = screen.getByRole('img');

    expect(image).toHaveAttribute('src', 'https://example.com/rick.png');

    expect(image).toHaveAttribute('alt', 'Rick Sanchez');
  });

  test('renders gender', () => {
    render(<Card item={mockItem} />);

    expect(screen.getByText(/Male/i)).toBeInTheDocument();
  });

  test('renders species', () => {
    render(<Card item={mockItem} />);

    expect(screen.getByText(/Human/i)).toBeInTheDocument();
  });

  test('renders male gender in blue color', () => {
    render(<Card item={mockItem} />);

    const gender = screen.getByText('Male');

    expect(gender).toHaveStyle({
      color: 'rgb(0, 0, 255)',
    });
  });

  test('renders female gender with correct color', () => {
    const femaleItem = {
      ...mockItem,
      gender: 'Female',
    };

    render(<Card item={femaleItem} />);

    const gender = screen.getByText('Female');

    expect(gender).toHaveStyle({
      color: 'rgb(248, 30, 68)',
    });
  });
});
