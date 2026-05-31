import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { useGetCharactersQuery } from '../../api/api';
import Main from './Main';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import type { CardItem } from '../../types';
import selectedItemsReducer from '../../store/selectedItemsSlice';
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../../api/api';

const createTestStore = () =>
  configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

vi.mock('../../api/api', () => ({
  useGetCharactersQuery: vi.fn(),
  api: {
    reducerPath: 'api',
    reducer: (state = {}) => state,
    middleware:
      () => (next: (action: unknown) => unknown) => (action: unknown) =>
        next(action),
    util: {
      invalidateTags: vi.fn(() => ({
        type: 'invalidateTags',
      })),
    },
  },
}));

const mockUseGetCharactersQuery = vi.mocked(useGetCharactersQuery);

type QueryResult = ReturnType<typeof useGetCharactersQuery>;

function createQueryResult(overrides: Partial<QueryResult>): QueryResult {
  return {
    data: undefined,
    error: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    isUninitialized: false,
    refetch: vi.fn(),
    fulfilledTimeStamp: 0,
    requestId: 'test-request',
    startedTimeStamp: 0,
    status: 'uninitialized',
    ...overrides,
  } as QueryResult;
}

// Mock character data
const page1Characters: CardItem[] = [
  {
    id: 1,
    name: 'Rick',
    gender: 'Male',
    species: 'Human',
    status: 'Alive',
    image: '',
    description: '',
    location: { name: 'Earth' },
    url: '',
  },
  {
    id: 2,
    name: 'Morty',
    gender: 'Male',
    species: 'Human',
    status: 'Alive',
    image: '',
    description: '',
    location: { name: 'Earth' },
    url: '',
  },
];

const page2Characters: CardItem[] = [
  {
    id: 3,
    name: 'Summer',
    gender: 'Female',
    species: 'Human',
    status: 'Alive',
    image: '',
    description: '',
    location: { name: 'Earth' },
    url: '',
  },
];

const errorMessage = 'Failed to load characters';

let consoleSpy: ReturnType<typeof vi.spyOn>;

describe('Main component', () => {
  beforeEach(() => {
    // silence expected React/API errors
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // localStorage mocks
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'selectedItems') {
        return JSON.stringify([]);
      }
      return null;
    });

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    vi.restoreAllMocks();
  });

  test('renders search input and search button', async () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: 2 },
        },
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <Provider store={createTestStore()}>
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
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: 2 },
        },
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <Provider store={createTestStore()}>
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
    mockUseGetCharactersQuery.mockImplementation(({ page }) =>
      createQueryResult({
        data:
          page === 2
            ? {
                results: page2Characters,
                info: { next: null },
              }
            : {
                results: page1Characters,
                info: { next: 2 },
              },
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/?page=1']}>
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
    expect(mockUseGetCharactersQuery).toHaveBeenCalledWith({
      search: '',
      page: 1,
    });
    expect(mockUseGetCharactersQuery).toHaveBeenCalledWith({
      search: '',
      page: 2,
    });
  });

  test('search triggers loadData', async () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: null },
        },
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Rick' } });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText(/Rick/i)).toBeInTheDocument();
    expect(mockUseGetCharactersQuery).toHaveBeenCalledWith({
      search: 'Rick',
      page: 1,
    });
  });

  test('displays error message when fetch fails', async () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        error: { status: 500 },
        isError: true,
        status: 'rejected',
      })
    );

    render(
      <Provider store={createTestStore()}>
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

  test('does not query again if search value is unchanged', async () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: 2 },
        },
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    // initial fetch
    await screen.findByText(/Rick/i);

    const callsBefore = mockUseGetCharactersQuery.mock.calls.length;

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // should still only be called once
    expect(mockUseGetCharactersQuery.mock.calls.length).toBe(callsBefore);
  });

  test('loads initial search value from URL params', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: null },
        },
      })
    );

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/?search=Morty&page=1']}>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    expect(mockUseGetCharactersQuery).toHaveBeenCalledWith({
      search: 'Morty',
      page: 1,
    });
  });

  test('stores search value in localStorage', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: null },
        },
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <Provider store={createTestStore()}>
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

  /* test('uses empty string when localStorage search is null', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const fetchSpy = vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: { next: null },
    });

    render(
      <Provider  store={createTestStore()}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText(/Rick/i);

    expect(fetchSpy).toHaveBeenCalledWith('', 1);
  }); */
  /*
  test('handles pagination back and forth', async () => {
    const fetchSpy = vi
      .spyOn(api, 'fetchCharacters')
      .mockResolvedValueOnce({ results: page1Characters, info: { next: 2 } })
      .mockResolvedValueOnce({ results: page2Characters, info: { next: null } })
      .mockResolvedValueOnce({ results: page1Characters, info: { next: 2 } }); // going back

    render(
      <Provider  store={createTestStore()}>
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
  }); */

  /* test('does not go below page 1', async () => {
    const fetchSpy = vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: { next: 2 },
    });

    render(
      <Provider  store={createTestStore()}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText(/Rick/i);

    fireEvent.click(screen.getByRole('button', { name: /prev/i }));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  }); */

  test('handles missing info object', async () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: undefined,
        },
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText(/Rick/i);

    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(nextButton).toBeEnabled();
  });

  /*  test('handles non-Error rejection', async () => {
    vi.spyOn(api, 'fetchCharacters').mockRejectedValue('oops');

    render(
      <Provider  store={createTestStore()}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText(/Failed to load data/i)).toBeInTheDocument();
  }); */

  test('shows loading state while fetching', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        isLoading: true,
      })
    );

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
