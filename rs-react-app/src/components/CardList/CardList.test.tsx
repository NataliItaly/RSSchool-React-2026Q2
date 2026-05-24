import { render, screen } from '@testing-library/react';
import CardList from './CardList';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../store';

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
      <Provider store={store}>
        <MemoryRouter>
          <CardList items={mockItems} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
  });
  test('renders empty list without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CardList items={[]} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Rick Sanchez/i)).not.toBeInTheDocument();
  });
  test('renders multiple cards', () => {
    const items = [
      { id: 1, name: 'Rick', image: '', gender: 'Male', species: 'Human' },
      { id: 2, name: 'Morty', image: '', gender: 'Male', species: 'Human' },
    ];

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CardList items={items} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Rick/i)).toBeInTheDocument();
    expect(screen.getByText(/Morty/i)).toBeInTheDocument();
  });
  test('navigates with details search param when card is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CardList items={mockItems} />
        </MemoryRouter>
      </Provider>
    );

    await user.click(screen.getByText(/Rick Sanchez/i));

    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/',
      search: 'details=1',
    });
  });
});
