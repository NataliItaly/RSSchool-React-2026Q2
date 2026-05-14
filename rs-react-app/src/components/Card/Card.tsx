import type { CardItem } from '../../types/index'

type CardProps = {
  item: CardItem;
};

export default function Card({item}: CardProps) {
  console.log(item)
  return (
    <div className="border rounded-xl border-gray-300 p-3 pt-2 w-52">
      <h4 className="min-h-14 flex gap-1.5 justify-between items-center">
        Name <b className="text-indigo-700 text-lg text-right">{item.name}</b>
      </h4>
      <div>
        {item.image ? (
          <img className="w-full rounded-md" src={item.image} alt={item.name} />
        ) : null}
      </div>

      <p>
        Gender{' '}
        <b
          className={
            item.gender === 'Male'
              ? 'text-indigo-700'
              : item.gender === 'Female'
                ? 'text-pink-700'
                : 'text-orange-700'
          }
        >
          {item.gender}
        </b>
      </p>
      <p>
        Species{' '}
        <b className={item.species === 'Human' ? 'text-violet-600' : 'text-green-700'}>
          {item.species}
        </b>
      </p>
    </div>
  );
}


