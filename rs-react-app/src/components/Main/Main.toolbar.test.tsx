import Main from './Main';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../../store/selectedItemsSlice';
import { api } from '../../api/api';
import { createTestStore } from './testStore';
import { page1Characters } from '../../types';

vi.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

import { useLocalStorage } from '../../hooks/useLocalStorage';

const mockUseLocalStorage = vi.mocked(useLocalStorage);

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

import { useGetCharactersQuery } from '../../api/api';
import { createQueryResult } from './apiMocks';


const mockUseGetCharactersQuery = vi.mocked(useGetCharactersQuery);

function createStoreWithSelectedItems() {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (gDM) => gDM().concat(api.middleware),
    preloadedState: {
      selectedItems: {
        items: [
          {
            id: '1',
            name: 'Rick',
            description: 'hero',
            detailsUrl: '/1',
          },
        ],
      },
    },
  });
}

describe('Main toolbar actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    URL.createObjectURL = vi.fn(() => 'blob:test');
    URL.revokeObjectURL = vi.fn();

    mockUseLocalStorage.mockImplementation((key) => {
      if (key === 'selectedItems') {
        return [
          [
            {
              id: '1',
              name: 'Rick',
              description: 'hero',
              detailsUrl: '/1',
            },
          ],
          vi.fn(),
        ];
      }

      return ['', vi.fn()];
    });
  });

  test('clears selected items from toolbar', async () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: null },
        },
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <Provider store={createStoreWithSelectedItems()}>
      <MemoryRouter>
        <Main />
      </MemoryRouter>
      </Provider>
    );

    const clearButton = screen.getByRole('button', {
      name: /unselect all/i,
    });

    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /unselect all/i })
      ).not.toBeInTheDocument();
    });
  });

  test('downloads selected items as csv', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: null },
        },
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    const clickSpy = vi.fn();

    vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
      const element = document.createElementNS(
        'http://www.w3.org/1999/xhtml',
        tag
      );

      if (tag === 'a') {
        element.click = clickSpy;
      }

      return element;
    }) as typeof document.createElement);

    render(
      <Provider store={createStoreWithSelectedItems()}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /download all/i,
      })
    );

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  test('closes details panel', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: null },
        },
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/?details=1&page=1']}>
          <Routes>
            <Route path="/" element={<Main />}>
              <Route path="/" element={<div>Details</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const closeBtn = screen.getByRole('button', {
      name: /✕/i,
    });

    fireEvent.click(closeBtn);

    expect(screen.queryByRole('button', { name: /✕/i })).not.toBeInTheDocument();
  });

  test('does not go to previous page while fetching', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: null },
        },
        isLoading: false,
        isFetching: true,
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/?page=2']}>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /prev/i }));

    // page should remain 2
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('clicking overlay closes details', () => {
    mockUseGetCharactersQuery.mockReturnValue(
      createQueryResult({
        data: {
          results: page1Characters,
          info: { next: null },
        },
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter initialEntries={['/?details=1&page=1']}>
          <Routes>
            <Route path="/" element={<Main />}>
              <Route path="/" element={<div>Details</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole('main').firstElementChild as HTMLElement);

    expect(screen.queryByRole('button', { name: /✕/i })).not.toBeInTheDocument();
  });
});