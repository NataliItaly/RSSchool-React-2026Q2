import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import ItemDetails from './ItemDetails';

describe('ItemDetails component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('renders nothing when no details param exists', () => {
    const { container } = render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('shows loading state', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () => new Promise(() => {}) as Promise<Response>
    );

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading details/i)).toBeInTheDocument();
  });

  test('renders fetched character details', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({
        id: 1,
        name: 'Rick Sanchez',
        image: 'rick.png',
        gender: 'Male',
        species: 'Human',
        status: 'alive',
        location: {
          name: 'Earth C-137',
        },
      }),
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Rick Sanchez/i)).toBeInTheDocument();

    expect(screen.getByText(/Male/i)).toBeInTheDocument();
    expect(screen.getByText(/Human/i)).toBeInTheDocument();
    expect(screen.getByText(/Earth/i)).toBeInTheDocument();
  });

  test('shows "No character" when fetch returns null', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => null,
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(await screen.findByText(/No character/i)).toBeInTheDocument();
  });
  test('renders female gender style', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({
        id: 2,
        name: 'Summer',
        image: 'summer.png',
        gender: 'Female',
        species: 'Human',
        status: 'alive',
        location: {
          name: 'Earth',
        },
      }),
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const gender = await screen.findByText('Female');

    expect(gender).toHaveClass('text-pink-700');
  });
  test('renders unknown gender style', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({
        id: 2,
        name: 'Summer',
        image: 'summer.png',
        gender: 'some',
        species: 'Human',
        status: 'alive',
        location: {
          name: 'Earth',
        },
      }),
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const gender = await screen.findByText('some');

    expect(gender).toHaveClass('text-orange-700');
  });
  test('renders human species style', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({
        id: 2,
        name: 'Summer',
        image: 'summer.png',
        gender: 'male',
        species: 'Human',
        status: 'alive',
        location: {
          name: 'Earth',
        },
      }),
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const species = await screen.findByText('Human');

    expect(species).toHaveClass('text-violet-600');
  });
  test('renders alien species style', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({
        id: 2,
        name: 'Summer',
        image: 'summer.png',
        gender: 'male',
        species: 'Alien',
        status: 'alive',
        location: {
          name: 'Earth',
        },
      }),
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const species = await screen.findByText('Alien');

    expect(species).toHaveClass('text-green-700');
  });
  test('renders status style', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({
        id: 2,
        name: 'Summer',
        image: 'summer.png',
        gender: 'male',
        species: 'Human',
        status: 'alive',
        location: {
          name: 'Earth',
        },
      }),
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const status = await screen.findByText('alive');

    expect(status).toHaveClass('text-green-700');
  });
  test('renders death status style', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({
        id: 2,
        name: 'Summer',
        image: 'summer.png',
        gender: 'male',
        species: 'Human',
        status: 'death',
        location: {
          name: 'Earth',
        },
      }),
    } as Response);

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const status = await screen.findByText('death');

    expect(status).toHaveClass('text-red-700');
  });
});
