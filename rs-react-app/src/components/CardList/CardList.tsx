import Card from '../Card/Card';
import type { CardItem } from '../../types';
import { useNavigate, useSearchParams } from 'react-router-dom';

type CardListProps = {
  items: CardItem[];
};

export default function CardList ({items}: CardListProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function openDetails(id: string | number) {
    const params = new URLSearchParams(searchParams);

    params.set('details', String(id));

    navigate({
      pathname: '/',
      search: params.toString(),
    });
  }

  return (
    <div className='w-full flex flex-wrap justify-center gap-5 mb-8'
    >
      {items.map((item: CardItem) => (
        <Card key={item.id} item={item} onClick={() => openDetails(item.id)}/>
      ))}
    </div>
  );
}


