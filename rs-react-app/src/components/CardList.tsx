import React from 'react';
import Card from './Card';
import type { CardItem } from '../types';

class CardList extends React.Component<{ items: CardItem[] }> {
  render() {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {this.props.items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    );
  }
}

export default CardList;
