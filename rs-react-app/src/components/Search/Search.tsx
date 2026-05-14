import React from 'react';

type Props = {
  onSearch: (value: string) => void;
};

type SearchState = {
  value: string;
  lastSearch: string;
};

export default function Search({ onSearch }: Props) {
  const [searchState, setSearchState] = React.useState<SearchState>({
    value: '',
    lastSearch: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchState((prev) => ({ ...prev, value: e.target.value }));
  }

  function handleSearch(): void {
    const trimmed = searchState.value.trim();

    if (trimmed === searchState.lastSearch) return;

    localStorage.setItem('search', trimmed);

    setSearchState((prev) => ({ ...prev, lastSearch: trimmed }));

    onSearch(trimmed);
  }

  return (
    <div className="flex justify-center items-center gap-4">
      <input
        className="border border-gray-300 rounded-md px-4 py-2 my-4"
        value={searchState.value}
        onChange={handleChange}
      />
      <button
        className="py-2 px-8 rounded-md text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer transition-all duration-600"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}

