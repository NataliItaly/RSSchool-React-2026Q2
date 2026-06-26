'use client';

import React from 'react';
import Search from '../Search/Search';
import CardList from '../CardList/CardList';
import BuggyButton from '../BuggyButton/BuggyButton';
import { useSearchParams, useRouter } from 'next/navigation';
import Pagination from '../Pagination/Pagination';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  hydrateSelectedItems,
  unselectAll,
  type SelectedItem,
} from '../../store/selectedItemsSlice';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Toolbar from '../Toolbar/Toolbar';
import { useGetCharactersQuery, api } from '../../api/api';
import Refresh from '../Refresh/Refresh';
import ItemDetails from '../../app/[locale]/item-details/page';

export default function Main() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const [storedSelectedItems, setStoredSelectedItems] = useLocalStorage<
    SelectedItem[]
  >('selectedItems', []);

  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') ?? '';
  //JSON.parse(localStorage.getItem('search') ?? '""');

  React.useEffect(() => {
    dispatch(hydrateSelectedItems(storedSelectedItems));
  }, []);

  React.useEffect(() => {
    setStoredSelectedItems(selectedItems);
  }, [selectedItems]);

  React.useEffect(() => {
    // Ensure page always exists in URL
    if (!searchParams.get('page')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');

      //setSearchParams(params, { replace: true });
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router]);

  function clearSelectedItems() {
    dispatch(unselectAll());
  }

  function handleDownload() {
    if (!selectedItems.length) return;

    const headers = ['id', 'name', 'description', 'detailsUrl'];

    const escapeCSV = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const rows = selectedItems.map((item) => [
      escapeCSV(item.id),
      escapeCSV(item.name),
      escapeCSV(item.description),
      escapeCSV(item.detailsUrl),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedItems.length}_items.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  const detailsId = searchParams.get('details');
  const detailsOpen = !!detailsId;

  const { data, error, isLoading, isFetching } = useGetCharactersQuery({
    search,
    page,
  });

  function closeDetails() {
    const params = new URLSearchParams(searchParams);
    params.delete('details');
    //setSearchParams(params);
    router.push(`?${params.toString()}`);
  }

  const items = data?.results ?? [];
  const hasNext = data?.info?.next !== null;

  function handleSearch(value: string) {
    const trimmed = value.trim();

    if (trimmed === search) return;

    const params = new URLSearchParams(searchParams);

    if (trimmed) {
      params.set('search', trimmed);
    } else {
      params.delete('search');
    }

    params.set('page', '1');

    router.push(`?${params.toString()}`);
    //setSearchParams(params);
  }

  function nextPage() {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page + 1));
    //setSearchParams(params);

    router.push(`?${params.toString()}`);
  }

  function prevPage() {
    if (page === 1 || isFetching) return;

    const params = new URLSearchParams(searchParams);
    params.set('page', String(page - 1));
    //setSearchParams(params);

    router.push(`?${params.toString()}`);
  }

  function handleRefresh() {
    dispatch(api.util.invalidateTags([{ type: 'Character', id: 'LIST' }]));
  }

  return (
    <main className="flex gap-4 pb-24 dark:bg-gray-900 dark:text-white">
      <div
        className={`transition-all p-5 ${detailsOpen ? 'w-1/2' : 'w-full'}`}
        onClick={() => detailsOpen && closeDetails()}
      >
        <div className="flex justify-center items-center gap-5">
          <Search onSearch={handleSearch} />
          <Refresh onRefresh={handleRefresh} disabled={isFetching} />
        </div>
        {isLoading && <p className="text-center text-lg">Loading...</p>}
        {isFetching && !isLoading && (
          <p className="text-center text-sm">Refreshing...</p>
        )}
        <BuggyButton />
        {error && (
          <p className="text-red-700 text-center text-lg">
            Failed to load characters. Please try again.
          </p>
        )}

        <CardList items={items} />
        <Pagination
          prevPage={prevPage}
          page={page}
          nextPage={nextPage}
          hasNext={hasNext}
        />
      </div>

      {detailsOpen && (
        <div
          className="w-1/2 min-h-full pl-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-1/2 h-fit fixed top-[72px] rounded-lg right-0 bg-amber-100 dark:bg-gray-800 p-5">
            <button
              className="absolute right-3 top-3 cursor-pointer font-bold hover:text-indigo-800 transition-all duration-300"
              onClick={closeDetails}
            >
              ✕
            </button>

            <ItemDetails />
          </div>
        </div>
      )}

      {selectedItems.length > 0 && (
        <Toolbar
          selectedItems={selectedItems}
          clearSelectedItems={clearSelectedItems}
          handleDownload={handleDownload}
        />
      )}
    </main>
  );
}
