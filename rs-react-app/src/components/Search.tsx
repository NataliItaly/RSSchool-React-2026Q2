import React from 'react';

type Props = {
  onSearch: (value: string) => void;
};

type State = {
  value: string;
  lastSearch: string;
};

class Search extends React.Component<Props, State> {
  state: State = {
    value: '',
    lastSearch: '',
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.value.trim();

    if (trimmed === this.state.lastSearch) return;

    localStorage.setItem('search', trimmed);

    this.setState({ lastSearch: trimmed });

    this.props.onSearch(trimmed);
  };

  render() {
    return (
      <div>
        <input value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}

export default Search;