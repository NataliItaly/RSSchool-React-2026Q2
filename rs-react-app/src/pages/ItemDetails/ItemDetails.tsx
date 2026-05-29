import { useSearchParams } from "react-router-dom";
import { useGetCharacterByIdQuery } from "../../api/api";

export default function ItemDetails() {
  const [searchParams] = useSearchParams();

  const id = searchParams.get('details');

  const {
    data: character,
    isLoading,
    error,
  } = useGetCharacterByIdQuery(Number(id), {
    skip: !id,
  });

  if (!id) {
    return null;
  }

  if (isLoading) {
    return <p>Loading details...</p>;
  }

  if (error) {
    return <p className="text-red-700">Failed to load character details.</p>;
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
        className="block w-3xs aspect-square mx-auto my-4 rounded-md"
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
