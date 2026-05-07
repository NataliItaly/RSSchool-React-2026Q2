import React from 'react';
import Header from './components/Header';
import Main from './components/Main';


class App extends React.Component {
  state = {
    search: '',
  };

  handleSearch = (value: string) => {
    this.setState({ search: value });
  };

  render() {
    return (
        <div>
          <Header />
          <Main />
        </div>
    );
  }
}

export default App;
