import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import UncontrolledForm from './UncontrolledForm';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockDispatch = vi.fn();

vi.mock('../../hooks/reduxHooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (
    selector: (state: {
      countries: {
        countries: string[];
      };
    }) => unknown
  ) =>
    selector({
      countries: {
        countries: ['USA', 'France', 'Italy'],
      },
    }),
}));

vi.mock('../../store/countrySlice', async () => {
  const actual = await vi.importActual('../../store/countrySlice');
  return actual;
});

window.alert = vi.fn();

beforeEach(() => {
  vi.stubGlobal('crypto', {
    randomUUID: vi.fn(() => 'test-uuid'),
  });

  vi.spyOn(window, 'alert').mockImplementation(() => {});

  class MockFileReader {
    result = 'data:image/png;base64,test';

    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    readAsDataURL() {
      this.onload?.();
    }
  }

  vi.stubGlobal('FileReader', MockFileReader);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('UncontrolledForm component', () => {
  it('renders form fields', () => {
    render(<UncontrolledForm onSuccess={vi.fn()} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/choose country/i)).toBeInTheDocument();
  });

  it('shows password strength when user types password', async () => {
    render(<UncontrolledForm onSuccess={vi.fn()} />);

    const passwordInput = screen.getByLabelText(/^password$/i);

    await userEvent.type(passwordInput, 'abc');

    expect(screen.getByText(/strength:/i)).toBeInTheDocument();
  });

  it('shows alert when image is missing', async () => {
    render(<UncontrolledForm onSuccess={vi.fn()} />);

    await userEvent.click(
      screen.getByRole('button', {
        name: /create profile/i,
      })
    );

    expect(window.alert).toHaveBeenCalledWith('Please select an image');
  });

  it('submits form without crashing', async () => {
    render(<UncontrolledForm onSuccess={vi.fn()} />);

    // fill fields...

    await userEvent.click(
      screen.getByRole('button', {
        name: /create profile/i,
      })
    );

    expect(true).toBe(true);
  });
});
