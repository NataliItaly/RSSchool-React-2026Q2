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
  const search = searchParams.get('search') || '';

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

    localStorage.setItem('search', trimmed);

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
    <main className="p-5">
      <Search onSearch={handleSearch} />

      {loading && <p>Loading...</p>}

      <BuggyButton />

      {error && <p className="text-red-700">{error}</p>}

      <CardList items={items} />

      <Pagination prevPage={prevPage} page={page} nextPage={nextPage} hasNext={hasNext}/>

      <div className="w-1/2">
        <Outlet />
      </div>


    </main>
  );
}
