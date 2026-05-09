import React from 'react';
import type { CardItem } from '../types/index';

class Card extends React.Component<{ item: CardItem }> {
  render() {
    const { item } = this.props;

    return (
      <div
        style={{
          border: '1px solid #ccc',
          margin: 5,
          padding: 10,
          width: '200px',
          borderRadius: '10px',
        }}
      >
        <h4 style={{ height: '55px' }}>
          Name <span style={{ color: '#000' }}>{item.name}</span>
        </h4>
        <div>
          {item.image ? (
            <img
            src={item.image}
            alt={item.name}
            style={{
              width: 150,
              borderRadius: 10,
            }}
            />
          ) : null}
        </div>

        <p>
          Gender{' '}
          <b
            style={{
              color:
                item.gender === 'Male'
                  ? 'rgb(0, 0, 255)'
                  : item.gender === 'Female'
                    ? 'rgb(248, 30, 68)'
                    : 'orangered',
            }}
          >
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
