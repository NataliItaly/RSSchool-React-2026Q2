import { render, screen } from '@testing-library/react';
import CardList from '../CardList';

describe('CardList component', () => {
  const mockItems = [
    {
      id: 1,
      name: 'Rick Sanchez',
      image: 'https://example.com/rick.png',
      gender: 'Male',
      species: 'Human',
    },
  ];
  test('renders list of cards', () => {
    render(<CardList items={mockItems} />);

    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
  });
  test('renders empty list without crashing', () => {
    render(<CardList items={[]} />);

    expect(screen.queryByText(/Rick Sanchez/i)).not.toBeInTheDocument();
  });
  test('renders multiple cards', () => {
    const items = [
      { id: 1, name: 'Rick', image: '', gender: 'Male', species: 'Human' },
      { id: 2, name: 'Morty', image: '', gender: 'Male', species: 'Human' },
    ];

    render(<CardList items={items} />);

    expect(screen.getByText(/Rick/i)).toBeInTheDocument();
    expect(screen.getByText(/Morty/i)).toBeInTheDocument();
  });
});
