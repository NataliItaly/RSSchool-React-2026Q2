import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import * as api from '../../services/api';
import Main from './Main';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store';

// Mock character data
const page1Characters: api.Character[] = [
  {
    id: 1,
    name: 'Rick',
    gender: 'Male',
    species: 'Human',
    status: 'Alive',
    image: '',
  },
  {
    id: 2,
    name: 'Morty',
    gender: 'Male',
    species: 'Human',
    status: 'Alive',
    image: '',
  },
];

const page2Characters: api.Character[] = [
  {
    id: 3,
    name: 'Summer',
    gender: 'Female',
    species: 'Human',
    status: 'Alive',
    image: '',
  },
];

const errorMessage = 'Failed to load data';

describe('Main component', () => {
  beforeEach(() => {
    // Reset localStorage mocks
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders search input and search button', async () => {
    vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: { next: 2 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    // Wait for async data to load
    await screen.findByText(/Rick/i);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('renders multiple character cards', async () => {
    vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: { next: 2 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText(/Rick/i);
    await screen.findByText(/Morty/i);

    expect(screen.getByText(/Rick/i)).toBeInTheDocument();
    expect(screen.getByText(/Morty/i)).toBeInTheDocument();
  });

  test('loads next page when Next button is clicked', async () => {
    const fetchSpy = vi
      .spyOn(api, 'fetchCharacters')
      .mockResolvedValueOnce({ results: page1Characters, info: { next: 2 } }) // page 1
      .mockResolvedValueOnce({
        results: page2Characters,
        info: { next: null },
      }); // page 2

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    // Wait for first page
    expect(await screen.findByText(/Rick/i)).toBeInTheDocument();
    expect(await screen.findByText(/Morty/i)).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Wait for second page
    expect(await screen.findByText(/Summer/i)).toBeInTheDocument();

    // Previous page should be gone
    expect(screen.queryByText(/Rick/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Morty/i)).not.toBeInTheDocument();

    // API called correctly
    expect(fetchSpy).toHaveBeenCalledWith('', 1);
    expect(fetchSpy).toHaveBeenCalledWith('', 2);
  });

  test('search triggers loadData', async () => {
    const searchSpy = vi.spyOn(api, 'fetchCharacters').mockResolvedValueOnce({
      results: page1Characters,
      info: { next: null },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Rick' } });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText(/Rick/i)).toBeInTheDocument();
    expect(searchSpy).toHaveBeenCalledWith('Rick', 1);
  });

  test('displays error message when fetch fails', async () => {
    vi.spyOn(api, 'fetchCharacters').mockRejectedValue(new Error(errorMessage));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(
      await screen.findByText(new RegExp(errorMessage, 'i'))
    ).toBeInTheDocument();
  });

  test('does not fetch again if search value is unchanged', async () => {
    const fetchSpy = vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: { next: null },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    // initial fetch
    await screen.findByText(/Rick/i);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // should still only be called once
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  test('loads initial search value from URL params', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('Morty');

    const fetchSpy = vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: { next: null },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/?search=Morty&page=1']}>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText(/Rick/i);

    expect(fetchSpy).toHaveBeenCalledWith('Morty', 1);
  });

  test('stores search value in localStorage', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: { next: null },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Rick' } });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(setItemSpy).toHaveBeenCalledWith('search', JSON.stringify('Rick'));
  });

  test('uses empty string when localStorage search is null', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const fetchSpy = vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: { next: null },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText(/Rick/i);

    expect(fetchSpy).toHaveBeenCalledWith('', 1);
  });

  test('handles pagination back and forth', async () => {
    const fetchSpy = vi
      .spyOn(api, 'fetchCharacters')
      .mockResolvedValueOnce({ results: page1Characters, info: { next: 2 } })
      .mockResolvedValueOnce({ results: page2Characters, info: { next: null } })
      .mockResolvedValueOnce({ results: page1Characters, info: { next: 2 } }); // going back

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    // First page
    expect(await screen.findByText(/Rick/i)).toBeInTheDocument();

    // Next page
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(await screen.findByText(/Summer/i)).toBeInTheDocument();

    // Prev page
    fireEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(await screen.findByText(/Rick/i)).toBeInTheDocument();

    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  test('does not go below page 1', async () => {
    const fetchSpy = vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: { next: 2 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText(/Rick/i);

    fireEvent.click(screen.getByRole('button', { name: /prev/i }));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  test('handles missing info object', async () => {
    vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: undefined,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText(/Rick/i);

    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(nextButton).toBeEnabled();
  });

  test('handles non-Error rejection', async () => {
    vi.spyOn(api, 'fetchCharacters').mockRejectedValue('oops');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText(/Failed to load data/i)).toBeInTheDocument();
  });

  test('shows loading state while fetching', async () => {
    vi.spyOn(api, 'fetchCharacters').mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                results: page1Characters,
                info: { next: null },
              }),
            100
          )
        )
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    expect(await screen.findByText(/Rick/i)).toBeInTheDocument();
  });
});
