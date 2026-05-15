import React from 'react';
import Search from '../Search/Search';
import CardList from '../CardList/CardList';
import BuggyButton from '../BuggyButton/BuggyButton';
import { fetchCharacters } from '../../services/api';
import type { Character } from '../../services/api';
import { useSearchParams } from 'react-router-dom';

//search: string;
//page: number;
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

  //search: localStorage.getItem('search') || '',
  //page: 1,
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
    params.set('search', trimmed);
    params.set('page', '1');
  }
  /*
  function handlePageChange (newPage: number) {
    setSearchParams({
      search,
      page: String(newPage),
    });
  };

  function handleURLSearch (value: string) {
    setSearchParams({
      search: value,
      page: '1',
    });
  }; */

  /* function updatePage (page: number) {
    const params = new URLSearchParams(searchParams);

    params.set('page', String(page));

    setSearchParams(params);
  }; */

  function nextPage() {
    if (!pageState.hasNext || pageState.loading) return;

    const params = new URLSearchParams(searchParams);
    params.set('page', String(page + 1));
    setSearchParams(params);
    /*  setPageState((prev) => ({
      ...prev,
      page: prev.page + 1,
    })); */
  }

  function prevPage() {
    if (page === 1 || pageState.loading) return;

    const params = new URLSearchParams(searchParams);
    params.set('page', String(page - 1));
    setSearchParams(params);
    /*  setPageState((prev) => ({
      ...prev,
      page: prev.page - 1,
    })); */
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
