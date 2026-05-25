import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Main from './Main';
import { MemoryRouter } from 'react-router-dom';
import * as api from '../../services/api';
import { Provider } from 'react-redux';
import { store } from '../../store';

const mockUseSearchParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );

  return {
    ...actual,
    useSearchParams: () => mockUseSearchParams(),
  };
});

describe('Main closeDetails', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    mockUseSearchParams.mockReset();
  });

  test('removes details param when close button clicked', async () => {
    const user = userEvent.setup();
    const mockSetSearchParams = vi.fn();

    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('page=1&details=5'),
      mockSetSearchParams,
    ]);

    vi.spyOn(api, 'fetchCharacters').mockResolvedValue({
      results: [],
      info: { next: null },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    const closeButton = screen.getByRole('button', { name: '✕' });

    await user.click(closeButton);

    const params = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;

    expect(params.get('details')).toBeNull();
  });
});
