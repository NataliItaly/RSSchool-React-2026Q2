import React from 'react';

type State = {
  crash: boolean;
};

class BuggyButton extends React.Component<Record<string, never>, State> {
  state: State = {
    crash: false,
  };

  render() {
    if (this.state.crash) {
      throw new Error('Test error');
    }
    return (
      <button
        style={{
          cursor: 'pointer',
          background: 'red',
          padding: '15px 25px',
          color: '#fff',
          fontSize: '18px',
          border: 'none',
          borderRadius: '10px',
          margin: '20px',
        }}
        onClick={() => this.setState({ crash: true })}
      >
        Crash App
      </button>
    );
  }
}

export default BuggyButton;
