import { render, screen } from '@testing-library/react';
import BuggyButton from '../BuggyButton';

describe('BuggyButton component', () => {
  test('renders Crash App text', () => {
    render(<BuggyButton />);

    expect(screen.getByText(/Crash App/i)).toBeInTheDocument();
  });
  test('renders button element', () => {
    render(<BuggyButton />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
