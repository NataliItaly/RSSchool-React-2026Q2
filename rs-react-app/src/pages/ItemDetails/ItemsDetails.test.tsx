import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import ItemDetails from './ItemDetails';
import { useGetCharacterByIdQuery } from '../../api/api';

vi.mock('../../api/api', () => ({
  useGetCharacterByIdQuery: vi.fn(),
}));

const mockUseGetCharacterByIdQuery = vi.mocked(useGetCharacterByIdQuery);

type QueryResult = ReturnType<typeof useGetCharacterByIdQuery>;

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

describe('ItemDetails component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders nothing when no details param exists', () => {
      mockUseGetCharacterByIdQuery.mockReturnValue(
      createQueryResult({})
    );

    const { container } = render(
      <MemoryRouter>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('shows loading state', () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createQueryResult({
        isLoading: true,
      })
    );

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading details/i)).toBeInTheDocument();
  });

  test('shows error state', () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createQueryResult({
        error: { status: 500, data: null },
        isError: true,
        status: 'rejected',
      })
    );

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Failed to load character details/i)
    ).toBeInTheDocument();
  });

  test('renders fetched character details', () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createQueryResult({
        data: {
          id: 1,
          name: 'Rick Sanchez',
          image: 'rick.png',
          gender: 'Male',
          species: 'Human',
          status: 'alive',
          location: {
            name: 'Earth C-137',
          },
        },
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();

    expect(screen.getByText(/Male/i)).toBeInTheDocument();
    expect(screen.getByText(/Human/i)).toBeInTheDocument();
    expect(screen.getByText(/Earth/i)).toBeInTheDocument();
  });

  test('shows "No character" when fetch returns null', async () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createQueryResult({
        data: undefined,
      })
    );

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <ItemDetails />
      </MemoryRouter>
    );

    expect(await screen.findByText(/No character/i)).toBeInTheDocument();
  });

  test('renders female gender style', async () => {
     mockUseGetCharacterByIdQuery.mockReturnValue(
       createQueryResult({
         data: {
           id: 2,
           name: 'Summer',
           image: 'summer.png',
           gender: 'Female',
           species: 'Human',
           status: 'alive',
           location: {
             name: 'Earth',
           },
         },
         isSuccess: true,
         status: 'fulfilled',
       })
     );

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const gender = await screen.findByText('Female');

    expect(gender).toHaveClass('text-pink-700');
  });

  test('renders unknown gender style', async () => {
     mockUseGetCharacterByIdQuery.mockReturnValue(
       createQueryResult({
         data: {
           id: 2,
           name: 'Summer',
           image: 'summer.png',
           gender: 'some',
           species: 'Human',
           status: 'alive',
           location: {
             name: 'Earth',
           },
         },
         isSuccess: true,
         status: 'fulfilled',
       })
     );

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const gender = await screen.findByText('some');

    expect(gender).toHaveClass('text-orange-700');
  });

  test('renders human species style', async () => {
     mockUseGetCharacterByIdQuery.mockReturnValue(
       createQueryResult({
         data: {
           id: 2,
           name: 'Summer',
           image: 'summer.png',
           gender: 'Female',
           species: 'Human',
           status: 'alive',
           location: {
             name: 'Earth',
           },
         },
         isSuccess: true,
         status: 'fulfilled',
       })
     );

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const species = await screen.findByText('Human');

    expect(species).toHaveClass('text-violet-600');
  });

  test('renders alien species style', async () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createQueryResult({
        data: {
          id: 2,
          name: 'Summer',
          image: 'summer.png',
          gender: 'Female',
          species: 'Alien',
          status: 'alive',
          location: {
            name: 'Earth',
          },
        },
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const species = await screen.findByText('Alien');

    expect(species).toHaveClass('text-green-700');
  });

  test('renders status style', () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createQueryResult({
        data: {
          id: 2,
          name: 'Summer',
          image: 'summer.png',
          gender: 'male',
          species: 'Human',
          status: 'alive',
          location: {
            name: 'Earth',
          },
        },
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const status = screen.getByText('alive');

    expect(status).toHaveClass('text-green-700');
  });

  test('renders death status style', async () => {
    mockUseGetCharacterByIdQuery.mockReturnValue(
      createQueryResult({
        data: {
          id: 2,
          name: 'Summer',
          image: 'summer.png',
          gender: 'Female',
          species: 'Human',
          status: 'death',
          location: {
            name: 'Earth',
          },
        },
        isSuccess: true,
        status: 'fulfilled',
      })
    );

    render(
      <MemoryRouter initialEntries={['/?details=2']}>
        <ItemDetails />
      </MemoryRouter>
    );

    const status = await screen.findByText('death');

    expect(status).toHaveClass('text-red-700');
  });
});
