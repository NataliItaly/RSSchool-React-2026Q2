import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SubmissionCard from './SubmissionCard';

describe('SubmissionCard component', () => {
  const mockUser = {
    id: '123',
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    gender: 'Male',
    country: 'Italy',
    imageBase64: 'https://example.com/avatar.jpg',
    termsAccepted: true,
    password: '',
    confirmPassword: '',
    createdAt: 123,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders user information', () => {
    render(<SubmissionCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Age: 30')).toBeInTheDocument();
    expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Gender: Male')).toBeInTheDocument();
    expect(screen.getByText('Country: Italy')).toBeInTheDocument();

    const image = screen.getByAltText('John Doe');

    expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('shows green styling initially', () => {
    const { container } = render(<SubmissionCard user={mockUser} />);

    const card = container.firstChild as HTMLElement;

    expect(card.className).toContain('border-green-500');
    expect(card.className).toContain('bg-green-50');
  });

  it('removes green styling after 5 seconds', () => {
    const { container } = render(<SubmissionCard user={mockUser} />);

    const card = container.firstChild as HTMLElement;

    expect(card.className).toContain('border-green-500');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(card.className).toContain('border-gray-300');
    expect(card.className).not.toContain('border-green-500');
    expect(card.className).not.toContain('bg-green-50');
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { unmount } = render(<SubmissionCard user={mockUser} />);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
