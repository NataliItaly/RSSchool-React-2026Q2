const BASE_URL = 'https://rickandmortyapi.com/api';

export type Character = {
  id: number;
  name: string;
  status: string;
  image: string;
  species: string;
  gender: string;
};

export async function fetchCharacters(search: string, page: number) {
  const query = new URLSearchParams();

  if (search) {
    query.append('name', search);
  }

  query.append('page', String(page));

  const res = await fetch(`${BASE_URL}/character?${query.toString()}`);

  if (!res.ok) {
    throw new Error('API error');
  }

  const data = await res.json();

  return {
    results: data.results as Character[],
    info: data.info,
  };
}
