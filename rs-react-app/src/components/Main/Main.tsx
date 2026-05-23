import React from 'react';
import Search from '../Search/Search';
import CardList from '../CardList/CardList';
import BuggyButton from '../BuggyButton/BuggyButton';
import { fetchCharacters } from '../../services/api';
import type { Character } from '../../services/api';
import { useSearchParams, Outlet } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';

type PageState = {
  items: Character[];
  loading: boolean;
  error: string | null;
  hasNext: boolean;
};

export default function Main() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') ?? localStorage.getItem('search') ?? '';

  React.useEffect(() => {
    // Ensure page always exists in URL
    if (!searchParams.get('page')) {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');

      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const [pageState, setPageState] = React.useState<PageState>({
    items: [],
    loading: false,
    error: null,
    hasNext: true,
  });

  const detailsId = searchParams.get('details');
  const detailsOpen = !!detailsId;

  function closeDetails() {
    const params = new URLSearchParams(searchParams);
    params.delete('details');
    setSearchParams(params);
  }


  const { items, loading, error, hasNext } = pageState;

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

    if (trimmed === search) return;

    const params = new URLSearchParams(searchParams);

    if (trimmed) {
      params.set('search', trimmed);
    } else {
      params.delete('search');
    }

    params.set('page', '1');

    setSearchParams(params);
  }

  function nextPage() {
    if (!pageState.hasNext || pageState.loading) return;

    const params = new URLSearchParams(searchParams);
    params.set('page', String(page + 1));
    setSearchParams(params);
  }

  function prevPage() {
    if (page === 1 || pageState.loading) return;

    const params = new URLSearchParams(searchParams);
    params.set('page', String(page - 1));
    setSearchParams(params);
  }

  return (
    <main className="flex gap-4 dark:bg-gray-900 dark:text-white">
      <div
        className={`transition-all p-5 ${detailsOpen ? 'w-1/2' : 'w-full'}`}
        onClick={() => detailsOpen && closeDetails()}
      >
        <Search onSearch={handleSearch} />

        {loading && <p>Loading...</p>}

        <BuggyButton />

        {error && <p className="text-red-700">{error}</p>}

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

            <Outlet />
          </div>
        </div>
      )}
    </main>
  );
}
