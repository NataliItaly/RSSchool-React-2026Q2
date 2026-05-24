import { render, screen } from '@testing-library/react';
import Card from './Card';
import { Provider } from 'react-redux';
import { store } from '../../store';

describe('Card component', () => {
  const mockItem = {
    id: 1,
    name: 'Rick Sanchez',
    image: 'https://example.com/rick.png',
    gender: 'Male',
    species: 'Human',
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
});
