import { render, screen } from '@testing-library/react';
import CardList from './CardList';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
    render(
      <MemoryRouter>
        <CardList items={mockItems} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
  });
  test('renders empty list without crashing', () => {
    render(
      <MemoryRouter>
        <CardList items={[]} />
      </MemoryRouter>
    );

    expect(screen.queryByText(/Rick Sanchez/i)).not.toBeInTheDocument();
  });
  test('renders multiple cards', () => {
    const items = [
      { id: 1, name: 'Rick', image: '', gender: 'Male', species: 'Human' },
      { id: 2, name: 'Morty', image: '', gender: 'Male', species: 'Human' },
    ];

    render(
      <MemoryRouter>
        <CardList items={items} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Rick/i)).toBeInTheDocument();
    expect(screen.getByText(/Morty/i)).toBeInTheDocument();
  });
  test('navigates with details search param when card is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CardList items={mockItems} />
      </MemoryRouter>
    );

    await user.click(screen.getByText(/Rick Sanchez/i));

    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/',
      search: 'details=1',
    });
  });
});
