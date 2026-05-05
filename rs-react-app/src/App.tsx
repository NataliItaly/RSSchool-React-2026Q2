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
    alert(
      `Уважаемый проверяющий, если вам не трудно, проверьте пожалуйста мою работу в четверг. Спасибо за понимание!Dear college, if you don't mind, please check my work on Thursday. Thank you for understanding!`
    );

    return (
        <div>
          <Header />
          <Main />
        </div>
    );
  }
}

export default App;
