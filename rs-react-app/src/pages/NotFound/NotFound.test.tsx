import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';
import { MemoryRouter } from 'react-router-dom';

describe('NotFound page', () => {
  test('renders not found info', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/404/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Main/i)).toBeInTheDocument();
  });

  test('renders back to main page link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });
});
