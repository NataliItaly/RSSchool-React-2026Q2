import React from "react";
import { useSearchParams } from "react-router-dom";
import type { CardItem } from "../../types";

export default function ItemDetails() {
  const [searchParams] = useSearchParams();

  const id = searchParams.get('details');
  const [character, setCharacter] = React.useState<CardItem | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);

      const res = await fetch(
        `https://rickandmortyapi.com/api/character/${id}`
      );

      const data = await res.json();

      setCharacter(data);
      setLoading(false);
    }

    load();
  }, [id])

  if (!id) {
    return null;
  }

  if (loading) {
    return <p>Loading details...</p>;
  }

  if (!character) {
    return <p>No character</p>;
  }


  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-center text-2xl font-bold text-indigo-700 text-bold">
        {character.name}
      </h2>
      <img
        className="block mx-auto my-4 rounded-md"
        src={character.image}
        alt={character.name}
      />
      <p className="w-fit">
        Gender:{' '}
        <b
          className={`text-lg
            ${character.gender === 'Male'
              ? 'text-indigo-700'
              : character.gender === 'Female'
                ? 'text-pink-700'
                : 'text-orange-700'}`}
        >
          {character.gender}
        </b>
      </p>
      <p>
        Species:{' '}
        <b
          className={` text-lg
            ${character.species === 'Human' ? 'text-violet-600' : 'text-green-700'}`}
        >
          {character.species}
        </b>
      </p>
      <p>
        Status:{' '}
        <b
          className={`text-lg ${character.status === 'alive' ? 'text-green-700' : 'text-red-700'}`}
        >
          {character.status}
        </b>
      </p>
      <p>
        Location:{' '}
        <b className="text-blue-800 text-lg">
          {character?.location?.name
            ? character.location.name.split(' ')[0]
            : 'Unknown location'}
        </b>
      </p>
    </div>
  );
}
