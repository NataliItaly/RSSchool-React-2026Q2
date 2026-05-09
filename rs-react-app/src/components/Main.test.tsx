import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import * as api from '../services/api';
import Main from './Main';

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

  test('renders search input and buttons', async () => {
    vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: { next: 2 },
    });

    render(<Main />);

    // Wait for async data to load
    await screen.findByText(/Rick/i);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByText(/Prev/i)).toBeDisabled();
    expect(screen.getByText(/Next/i)).toBeEnabled();
  });

  test('renders multiple character cards', async () => {
    vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: page1Characters,
      info: { next: 2 },
    });

    render(<Main />);

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

    render(<Main />);

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
    const searchSpy = vi
      .spyOn(api, 'fetchCharacters')
      .mockResolvedValueOnce({
        results: page1Characters,
        info: { next: null },
      });

    render(<Main />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Rick' } });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText(/Rick/i)).toBeInTheDocument();
    expect(searchSpy).toHaveBeenCalledWith('Rick', 1);
  });

  test('displays error message when fetch fails', async () => {
    vi.spyOn(api, 'fetchCharacters').mockRejectedValue(new Error(errorMessage));

    render(<Main />);

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(
      await screen.findByText(new RegExp(errorMessage, 'i'))
    ).toBeInTheDocument();
  });

  test('handles pagination back and forth', async () => {
    const fetchSpy = vi
      .spyOn(api, 'fetchCharacters')
      .mockResolvedValueOnce({ results: page1Characters, info: { next: 2 } })
      .mockResolvedValueOnce({ results: page2Characters, info: { next: null } })
      .mockResolvedValueOnce({ results: page1Characters, info: { next: 2 } }); // going back

    render(<Main />);

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
});
