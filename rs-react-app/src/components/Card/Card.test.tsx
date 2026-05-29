import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { selectItem } from '../../store/selectedItemsSlice';

describe('Card component', () => {
  const mockItem = {
    id: 1,
    name: 'Rick Sanchez',
    image: 'https://example.com/rick.png',
    gender: 'Male',
    species: 'Human',
    description: '',
    status: 'alive',
    location: { name: 'Earth' },
    url: ''
  };

  test('renders character name', () => {
    render(
      <Provider store={store}>
        <Card item={mockItem} />
      </Provider>
    );

    expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
  });

  test('renders character image', () => {
    render(
      <Provider store={store}>
        <Card item={mockItem} />
      </Provider>
    );

    const image = screen.getByRole('img');

    expect(image).toHaveAttribute('src', 'https://example.com/rick.png');

    expect(image).toHaveAttribute('alt', 'Rick Sanchez');
  });

  test('does not render image if image is missing', () => {
    const itemWithoutImage = {
      ...mockItem,
      image: '',
    };

    render(
      <Provider store={store}>
        <Card item={itemWithoutImage} />
      </Provider>
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('renders gender', () => {
    render(
      <Provider store={store}>
        <Card item={mockItem} />
      </Provider>
    );

    expect(screen.getByText(/Male/i)).toBeInTheDocument();
  });

  test('renders male gender in blue color', () => {
    render(
      <Provider store={store}>
        <Card item={mockItem} />
      </Provider>
    );

    const gender = screen.getByText('Male');

    expect(gender).toHaveClass('text-indigo-700');
  });

  test('renders female gender with correct color', () => {
    const femaleItem = {
      ...mockItem,
      gender: 'Female',
    };

    render(
      <Provider store={store}>
        <Card item={femaleItem} />
      </Provider>
    );

    const gender = screen.getByText('Female');

    expect(gender).toHaveClass('text-pink-700');
  });

  test('renders unknown gender with orange color', () => {
    const unknownGenderItem = {
      ...mockItem,
      gender: 'unknown',
    };

    render(
      <Provider store={store}>
        <Card item={unknownGenderItem} />
      </Provider>
    );

    const gender = screen.getByText('unknown');

    expect(gender).toHaveClass('text-orange-700');
  });

  test('renders species', () => {
    render(
      <Provider store={store}>
        <Card item={mockItem} />
      </Provider>
    );

    expect(screen.getByText(/Human/i)).toBeInTheDocument();
  });

  test('renders Human species with violet color', () => {
    const humanItem = {
      ...mockItem,
      species: 'Human',
    };

    render(
      <Provider store={store}>
        <Card item={humanItem} />
      </Provider>
    );

    const species = screen.getByText('Human');

    expect(species).toHaveClass('text-violet-600');
  });

  test('renders non-human species with green color', () => {
    const alienItem = {
      ...mockItem,
      species: 'Alien',
    };

    render(
      <Provider store={store}>
        <Card item={alienItem} />
      </Provider>
    );

    const species = screen.getByText('Alien');

    expect(species).toHaveClass('text-green-700');
  });
  test('calls onClick when card is clicked', () => {
    const handleClick = vi.fn();

    render(
      <Provider store={store}>
        <Card item={mockItem} onClick={handleClick} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Rick Sanchez'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  test('selects item when checkbox is checked', () => {
    render(
      <Provider store={store}>
        <Card item={mockItem} />
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();

    const state = store.getState();

    expect(state.selectedItems.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          name: 'Rick Sanchez',
        }),
      ])
    );
  });
  test('unselects item when checkbox is unchecked', () => {
    store.dispatch(
      selectItem({
        id: '1',
        name: 'Rick Sanchez',
        description: '',
        detailsUrl: '',
      })
    );

    render(
      <Provider store={store}>
        <Card item={mockItem} />
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();

    const state = store.getState();

    expect(state.selectedItems.items).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: '1' })])
    );
  });
  test('checkbox click does not trigger card onClick', () => {
    const handleClick = vi.fn();

    render(
      <Provider store={store}>
        <Card item={mockItem} onClick={handleClick} />
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
