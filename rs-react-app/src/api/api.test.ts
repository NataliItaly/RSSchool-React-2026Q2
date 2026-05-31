import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';

describe('RTK Query api', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    globalThis.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });



  test('getCharacters sends correct query params', async () => {
    mockFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          info: {
            count: 1,
            pages: 1,
            next: null,
            prev: null,
          },
          results: [],
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    );

    const store = configureStore({
      reducer: {
        [api.reducerPath]: api.reducer,
      },
      middleware: (gDM) => gDM().concat(api.middleware),
    });

    await store.dispatch(
      api.endpoints.getCharacters.initiate({
        search: 'Rick',
        page: 2,
      })
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [request] = mockFetch.mock.calls[0];

    expect(request).toBeInstanceOf(Request);
    expect(request.url).toContain('character');
    expect(request.url).toContain('name=Rick');
    expect(request.url).toContain('page=2');
  });

  test('getCharacters uses default params', async () => {
    mockFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          info: {
            count: 0,
            pages: 0,
            next: null,
            prev: null,
          },
          results: [],
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    );

    const store = configureStore({
      reducer: {
        [api.reducerPath]: api.reducer,
      },
      middleware: (gDM) => gDM().concat(api.middleware),
    });

    await store.dispatch(api.endpoints.getCharacters.initiate({}));

    const [request] = mockFetch.mock.calls[0];

    expect(request.url).toContain('name=');
    expect(request.url).toContain('page=1');
  });

  test('getCharacterById requests correct endpoint', async () => {
    mockFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'Rick',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    );

    const store = configureStore({
      reducer: {
        [api.reducerPath]: api.reducer,
      },
      middleware: (gDM) => gDM().concat(api.middleware),
    });

    await store.dispatch(api.endpoints.getCharacterById.initiate(1));

    const [request] = mockFetch.mock.calls[0];

    expect(request.url).toContain('character/1');
  });
});