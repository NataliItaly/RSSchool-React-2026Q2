import React from 'react';
import Card from './Card';
import type { CardItem } from '../types';

class MapList extends React.Component<{ items: CardItem[] }> {
  render() {
    return (
      <div>
        {this.props.items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    );
  }
}

export default MapList;
