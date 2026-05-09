import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import BuggyButton from './BuggyButton';

describe('ErrorBoundary component', () => {
  test('renders children with no error', () => {
    render(
      <ErrorBoundary>
        <div>Test text</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test text')).toBeInTheDocument();
  });
  test('catches error from children component', () => {
    render(
      <ErrorBoundary>
        <BuggyButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText(/Something is wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/^Error$/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });
  test('resets error state when clicking Try again', () => {
    render(
      <ErrorBoundary>
        <BuggyButton />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button'));

    fireEvent.click(screen.getByText(/Try again/i));

    expect(screen.getByText(/Crash App/i)).toBeInTheDocument();
  });
});
