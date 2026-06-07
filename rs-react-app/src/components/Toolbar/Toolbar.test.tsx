import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Toolbar from './Toolbar';

describe('Toolbar component', () => {
  const mockSelectedItems = [
    {
      id: '1',
      name: 'Rick',
      description: 'Human',
      detailsUrl: '/1',
    },
    {
      id: '2',
      name: 'Morty',
      description: 'Human',
      detailsUrl: '/2',
    },
  ];

  test('renders selected items count', () => {
    render(
      <Toolbar
        selectedItems={mockSelectedItems}
        clearSelectedItems={vi.fn()}
        handleDownload={vi.fn()}
      />
    );

    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  test('renders buttons', () => {
    render(
      <Toolbar
        selectedItems={[]}
        clearSelectedItems={vi.fn()}
        handleDownload={vi.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: /unselect all/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /download all/i })
    ).toBeInTheDocument();
  });

  test('calls clearSelectedItems when Unselect All clicked', () => {
    const clearMock = vi.fn();

    render(
      <Toolbar
        selectedItems={mockSelectedItems}
        clearSelectedItems={clearMock}
        handleDownload={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /unselect all/i }));

    expect(clearMock).toHaveBeenCalledTimes(1);
  });

  test('calls handleDownload when Download All clicked', () => {
    const downloadMock = vi.fn();

    render(
      <Toolbar
        selectedItems={mockSelectedItems}
        clearSelectedItems={vi.fn()}
        handleDownload={downloadMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /download all/i }));

    expect(downloadMock).toHaveBeenCalledTimes(1);
  });

  test('renders zero selected items', () => {
    render(
      <Toolbar
        selectedItems={[]}
        clearSelectedItems={vi.fn()}
        handleDownload={vi.fn()}
      />
    );

    expect(screen.getByText('0 items selected')).toBeInTheDocument();
  });
});
