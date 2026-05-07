import React from 'react';
import { fetchCharacters, type Character } from '../services/api';
import Search from './Search';
import CardList from './CardList';
import BuggyButton from './BuggyButton';

type State = {
  items: Character[];
  search: string;
  page: number;
  loading: boolean;
  error: string | null;
  hasNext: boolean;
};

class Main extends React.Component<Record<string, never>, State> {
  state: State = {
    items: [],
    search: '',
    page: 1,
    loading: false,
    error: null,
    hasNext: true,
  };

  componentDidMount() {
    const saved = localStorage.getItem('search') || '';

    this.setState(
      {
        search: saved,
      },
      () => {
        this.loadData();
      }
    );
  }

  componentDidUpdate(
    _prevProps: Readonly<Record<string, never>>,
    prevState: Readonly<State>
  ) {
    if (
      prevState.search !== this.state.search ||
      prevState.page !== this.state.page
    ) {
      this.loadData();
    }
  }

  loadData = async () => {
    const { search, page } = this.state;

    this.setState({ loading: true, error: null });

    try {
      const data = await fetchCharacters(search, page);

      this.setState({
        items: data.results,
        hasNext: data.info?.next !== null,
        loading: false,
      });
    } catch (e: unknown) {
      console.error(e);
      this.setState({
        error: 'Failed to load data',
        loading: false,
      });
    }
  };

  handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === this.state.search) return;

    localStorage.setItem('search', trimmed);

    this.setState({
      search: trimmed,
      page: 1,
    });
  };

  nextPage = () => {
    if (!this.state.hasNext || this.state.loading) return;

    this.setState((prev) => ({
      page: prev.page + 1,
    }));
  };

  prevPage = () => {
    if (this.state.page <= 1) return;

    this.setState((prev) => ({
      page: prev.page - 1,
    }));
  };

  render() {
    const { items, loading, error, page, hasNext } = this.state;

    return (
      <main style={{ padding: 20 }}>
        {/* SEARCH */}
        <Search onSearch={this.handleSearch} />

        {/* LOADING */}
        {loading && <p>Loading...</p>}

        {/* BUGGY BUTTON */}
        <BuggyButton />

        {/* ERROR */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* LIST */}
        <CardList items={items} />

        {/* PAGINATION */}
        <div style={{ marginTop: 20 }}>
          <button
            style={{ cursor: 'pointer' }}
            onClick={this.prevPage}
            disabled={page === 1}
          >
            Prev
          </button>

          <span style={{ margin: '0 10px' }}>Page {page}</span>

          <button
            style={{ cursor: 'pointer' }}
            onClick={this.nextPage}
            disabled={!hasNext}
          >
            Next
          </button>
        </div>
      </main>
    );
  }
}

export default Main;
