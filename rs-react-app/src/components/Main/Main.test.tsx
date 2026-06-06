import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { mockUseGetCharactersQuery, createQueryResult } from './apiMocks';
import Main from './Main';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createTestStore } from './testStore';
import { page1Characters, page2Characters } from '../../types';

const errorMessage = 'Failed to load characters';

let consoleSpy: ReturnType<typeof vi.spyOn>;

describe('Main component', () => {
  beforeEach(() => {
    // silence expected React/API errors
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

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
    mockUseGetCharactersQuery.mockImplementation((args) => {
      const page =
        typeof args === 'object' && args !== null && 'page' in args
          ? args.page
          : 1;

      return createQueryResult({
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
      });
    });

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

  test('handles pagination back and forth', async () => {
    mockUseGetCharactersQuery.mockImplementation((args) => {
      const page =
        typeof args === 'object' && args !== null && 'page' in args
          ? args.page
          : 1;

      return createQueryResult({
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
      });
    });

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/?page=1']}>
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
  });

  test('does not go below page 1', async () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: 2 },
        },
        isSuccess: true,
      })
    );

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    await screen.findByText(/Rick/i);

    fireEvent.click(screen.getByRole('button', { name: /prev/i }));

    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();

    expect(mockUseGetCharactersQuery).toHaveBeenCalledWith({
      search: '',
      page: 1,
    });
  });

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
