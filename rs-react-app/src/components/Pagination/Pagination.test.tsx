import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders current page', () => {
    render(
      <Pagination
        prevPage={vi.fn()}
        nextPage={vi.fn()}
        page={3}
        hasNext={true}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('disables Prev button on first page', () => {
    render(
      <Pagination
        prevPage={vi.fn()}
        nextPage={vi.fn()}
        page={1}
        hasNext={true}
      />
    );

    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('enables Prev button when page is greater than 1', () => {
    render(
      <Pagination
        prevPage={vi.fn()}
        nextPage={vi.fn()}
        page={2}
        hasNext={true}
      />
    );

    expect(screen.getByRole('button', { name: /prev/i })).toBeEnabled();
  });

  it('disables Next button when hasNext is false', () => {
    render(
      <Pagination
        prevPage={vi.fn()}
        nextPage={vi.fn()}
        page={2}
        hasNext={false}
      />
    );

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('calls prevPage when Prev is clicked', async () => {
    const user = userEvent.setup();
    const prevPage = vi.fn();

    render(
      <Pagination
        prevPage={prevPage}
        nextPage={vi.fn()}
        page={2}
        hasNext={true}
      />
    );

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(prevPage).toHaveBeenCalledTimes(1);
  });

  it('calls nextPage when Next is clicked', async () => {
    const user = userEvent.setup();
    const nextPage = vi.fn();

    render(
      <Pagination
        prevPage={vi.fn()}
        nextPage={nextPage}
        page={2}
        hasNext={true}
      />
    );

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(nextPage).toHaveBeenCalledTimes(1);
  });
});
