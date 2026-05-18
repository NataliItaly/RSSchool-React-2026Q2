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

  console.log(character)

  return (
    <div>
      <h2>{character.name}</h2>
      <img src={character.image} alt={character.name} />
      <p>{character.gender}</p>
      <p>{character.species}</p>
    </div>
  );
}