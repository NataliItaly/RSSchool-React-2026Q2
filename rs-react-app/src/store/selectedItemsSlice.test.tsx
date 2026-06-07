import reducer, {
  hydrateSelectedItems,
  selectItem,
  unselectItem,
  unselectAll,
} from './selectedItemsSlice';

describe('selectedItemsSlice', () => {
  const mockItem = {
    id: '1',
    name: 'Rick Sanchez',
    description: 'Human',
    detailsUrl: '/1',
  };

  test('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
    });
  });

  test('hydrates selected items', () => {
    const state = reducer({ items: [] }, hydrateSelectedItems([mockItem]));

    expect(state.items).toEqual([mockItem]);
  });

  test('selects item', () => {
    const state = reducer({ items: [] }, selectItem(mockItem));

    expect(state.items).toEqual([mockItem]);
  });

  test('does not add duplicate item', () => {
    const state = reducer({ items: [mockItem] }, selectItem(mockItem));

    expect(state.items).toHaveLength(1);
  });

  test('unselects item', () => {
    const state = reducer({ items: [mockItem] }, unselectItem('1'));

    expect(state.items).toEqual([]);
  });

  test('unselects all items', () => {
    const state = reducer({ items: [mockItem] }, unselectAll());

    expect(state.items).toEqual([]);
  });
});
