import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { useAppSelector } from './hooks/reduxHooks';
import type { RootState } from './store/store';
import type { UserFormData } from './components/Forms/form-type';

vi.mock('./hooks/reduxHooks', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('./components/Modal/Modal', () => ({
  default: ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
  }) => <div data-testid="modal">{isOpen ? children : null}</div>,
}));

vi.mock('./components/SubmissionCard/SubmissionCard', () => ({
  default: ({ user }: { user: UserFormData }) => (
    <div data-testid="submission-card">{user.name}</div>
  ),
}));

vi.mock('./components/Forms/UncontrolledForm', () => ({
  default: () => <div>Uncontrolled Form</div>,
}));

vi.mock('./components/Forms/ReactHookForm', () => ({
  default: () => <div>React Hook Form</div>,
}));

describe('App component', () => {
  const mockedUseAppSelector = vi.mocked(useAppSelector);

  beforeEach(() => {
    mockedUseAppSelector.mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({
          users: {
            submissions: [
              {
                id: '1',
                name: 'John',
              },
              {
                id: '2',
                name: 'Jane',
              },
            ],
          },
        } as RootState)
    );
  });

  it('renders all submissions', () => {
    render(<App />);

    const cards = screen.getAllByTestId('submission-card');

    expect(cards).toHaveLength(2);
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('does not show a form initially', () => {
    render(<App />);

    expect(screen.queryByText('Uncontrolled Form')).not.toBeInTheDocument();

    expect(screen.queryByText('React Hook Form')).not.toBeInTheDocument();
  });

  it('opens uncontrolled form when button is clicked', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /open uncontrolled form/i,
      })
    );

    expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();
  });

  it('opens react hook form when button is clicked', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /open react hook form/i,
      })
    );

    expect(screen.getByText('React Hook Form')).toBeInTheDocument();
  });

  it('switches between forms', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /open uncontrolled form/i,
      })
    );

    expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: /open react hook form/i,
      })
    );

    expect(screen.queryByText('Uncontrolled Form')).not.toBeInTheDocument();

    expect(screen.getByText('React Hook Form')).toBeInTheDocument();
  });
});
