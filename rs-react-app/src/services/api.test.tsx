import { describe, test, expect, vi, afterEach } from 'vitest';
import { fetchCharacters } from './api';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchCharacters', () => {
  test('fetches characters with search and page', async () => {
    const mockData = {
      results: [
        {
          id: 1,
          name: 'Rick',
          status: 'Alive',
          image: '',
          species: '',
          gender: '',
        },
      ],
      info: { next: null },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    } as unknown as Response);

    const result = await fetchCharacters('Rick', 1);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('name=Rick')
    );

    expect(result.results[0].name).toBe('Rick');
  });

  test('fetches characters without search', async () => {
    const mockData = {
      results: [],
      info: { next: null },
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    } as unknown as Response);

    await fetchCharacters('', 2);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=2')
    );
  });

  test('throws error when response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: vi.fn(),
    } as unknown as Response);

    await expect(fetchCharacters('Rick', 1)).rejects.toThrow('API error');
  });

  test('throws error when fetch rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchCharacters('Rick', 1)).rejects.toThrow('Network error');
  });
});
