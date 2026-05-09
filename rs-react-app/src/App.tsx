import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import ErrorBoundary from './components/ErrorBoundary';


class App extends React.Component {
  state = {
    search: '',
  };

  handleSearch = (value: string) => {
    this.setState({ search: value });
  };

  render() {
    return (
      <ErrorBoundary>
        <div>
          <Header />
          <Main />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
