import React from 'react';

class BuggyButton extends React.Component {
  render() {
    return (
      <button
        onClick={() => {
          throw new Error('Test error');
        }}
      >
        Crash App
      </button>
    );
  }
}

export default BuggyButton;
