import Card from '../Card/Card';
import type { CardItem } from '../../types';

type CardListProps = {
  items: CardItem[];
};

export default function CardList ({items}: CardListProps) {
  return (
    <div className='w-full flex flex-wrap justify-center gap-5 mb-8'
    >
      {items.map((item: CardItem) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}


