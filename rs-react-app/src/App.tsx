import React from 'react';
import Header from './components/Header';


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
        </div>
    );
  }
}

export default App;
