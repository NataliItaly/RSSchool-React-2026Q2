import { vi } from 'vitest';
import { useGetCharactersQuery } from '../../api/api';


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

export const mockUseGetCharactersQuery = vi.mocked(useGetCharactersQuery);

type QueryResult = ReturnType<typeof useGetCharactersQuery>;

export function createQueryResult(
  overrides: Partial<QueryResult>
): QueryResult {
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
