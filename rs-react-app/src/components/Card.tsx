import React from 'react';
import type { CardItem } from '../types/index';

class Card extends React.Component<{ item: CardItem }> {
  render() {
    const { item } = this.props;
    console.log('item', item);

    return (
      <div style={{ border: '1px solid #ccc', margin: 5, padding: 10, width: '200px', borderRadius: '10px' }}>
        <h4>
          Name{' '}
          <span style={{ color: '#000' }}>
            {item.name}
          </span>
        </h4>
        <div>
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: 150,
              borderRadius: 10,
            }}
          />
        </div>

        <p>
          Gender{' '}
          <b style={{ color: item.gender === 'Male' ? 'blue' : 'pink' }}>
            {item.gender}
          </b>
        </p>
        <p>
          Species{' '}
          <b style={{ color: item.species === 'Human' ? 'purple' : 'green' }}>
            {item.species}
          </b>
        </p>
      </div>
    );
  }
}

export default Card;
