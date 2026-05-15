import React from 'react';
import Search from '../Search/Search';
import CardList from '../CardList/CardList';
import BuggyButton from '../BuggyButton/BuggyButton';
import { fetchCharacters } from '../../services/api';
import type { Character } from '../../services/api';

type PageState = {
  items: Character[];
  search: string;
  page: number;
  loading: boolean;
  error: string | null;
  hasNext: boolean;
};

export default function Main() {
  const [pageState, setPageState] = React.useState<PageState>({
    items: [],
    search: localStorage.getItem('search') || '',
    page: 1,
    loading: false,
    error: null,
    hasNext: true,
  });

  const { items, search, loading, error, page, hasNext } = pageState;

  React.useEffect(() => {
    async function loadData() {
      setPageState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await fetchCharacters(search, page);

        setPageState((prev) => ({
          ...prev,
          items: data.results,
          hasNext: data.info?.next !== null,
          loading: false,
        }));
      } catch (e: unknown) {
        console.error(e);

        setPageState((prev) => ({
          ...prev,
          error: 'Failed to load data',
          loading: false,
        }));
      }
    }

    loadData();
  }, [search, page]);

  function handleSearch(value: string) {
    const trimmed = value.trim();

    if (trimmed === pageState.search) return;

    localStorage.setItem('search', trimmed);

    setPageState((prev) => ({
      ...prev,
      search: trimmed,
      page: 1,
    }));
  }

  function nextPage() {
    if (!pageState.hasNext || pageState.loading) return;

    setPageState((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  }

  function prevPage() {
    if (pageState.page <= 1) return;

    setPageState((prev) => ({
      ...prev,
      page: prev.page - 1,
    }));
  }
  
  return (
    <main className="p-5">
      <Search onSearch={handleSearch} />

      {loading && <p>Loading...</p>}

      <BuggyButton />

      {error && <p className="text-red-700">{error}</p>}

      <CardList items={items} />

      <div className="mt-5 flex justify-center items-center gap-4">
        <button
          className="cursor-pointer bg-indigo-700 text-white px-4 py-1.5 hover:bg-indigo-600 disabled:opacity-70 disabled:hover:bg-indigo-700 transition-all duration-500 rounded-md"
          onClick={prevPage}
          disabled={page === 1}
        >
          Prev
        </button>

        <span className="mx-2.5 my-0 text-xl">{page}</span>

        <button
          className="cursor-pointer bg-indigo-700 text-white px-4 py-1.5 hover:bg-indigo-600 disabled:opacity-70 disabled:hover:bg-indigo-700 transition-all duration-500 rounded-md"
          onClick={nextPage}
          disabled={!hasNext}
        >
          Next
        </button>
      </div>
    </main>
  );
}
