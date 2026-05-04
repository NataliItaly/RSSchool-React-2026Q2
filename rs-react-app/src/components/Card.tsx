import React from 'react';
import type { CardItem } from '../types/index';

class Card extends React.Component<{ item: CardItem }> {
  render() {
    const { item } = this.props;

    return (
      <div style={{ border: '1px solid #ccc', margin: 5, padding: 10 }}>
        <h4>{item.name}</h4>
        <p>{item.description}</p>
      </div>
    );
  }
}

export default Card;
