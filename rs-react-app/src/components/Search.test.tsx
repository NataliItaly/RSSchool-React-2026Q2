import { render, screen, fireEvent } from '@testing-library/react';
import Search from './Search';

describe('Search component', () => {
  test('renders Search button', () => {
    const mockOnSearch = vi.fn();
    render(<Search onSearch={mockOnSearch}/>);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Search');
  });
  test('renders Search input', () => {
    const mockOnSearch = vi.fn();
    render(<Search onSearch={mockOnSearch}/>);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  test('updates input value on change', () => {
    render(<Search onSearch={() => {}} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, {
      target: { value: 'Rick' },
    });

    expect(input).toHaveValue('Rick');
  });
  test('calls onSearch when button clicked', () => {
    const mockOnSearch = vi.fn();

    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    fireEvent.change(input, {
      target: { value: 'Rick' },
    });

    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('Rick');
  });
  test('trims input before search', () => {
    const mockOnSearch = vi.fn();

    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    fireEvent.change(input, {
      target: { value: '  Rick  ' },
    });

    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('Rick');
  });
  test('stores search value in localStorage', () => {
    const mockOnSearch = vi.fn();

    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    fireEvent.change(input, {
      target: { value: 'Rick' },
    });

    fireEvent.click(button);

    expect(localStorage.getItem('search')).toBe('Rick');
  });
  test('does not call onSearch if same value repeated', () => {
    const mockOnSearch = vi.fn();

    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Rick' } });
    fireEvent.click(button);

    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
});
