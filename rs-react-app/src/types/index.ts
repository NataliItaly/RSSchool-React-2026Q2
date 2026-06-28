export interface CardItem {
  id: string | number;
  name: string;
  description?: string;
  gender: string;
  image: string;
  species: string;
  status: string;
  location: { name: string };
  url: string;
}

export const page1Characters: CardItem[] = [
  {
    id: 1,
    name: 'Rick',
    gender: 'Male',
    species: 'Human',
    status: 'Alive',
    image: '',
    description: '',
    location: { name: 'Earth' },
    url: '',
  },
  {
    id: 2,
    name: 'Morty',
    gender: 'Male',
    species: 'Human',
    status: 'Alive',
    image: '',
    description: '',
    location: { name: 'Earth' },
    url: '',
  },
];

export const page2Characters: CardItem[] = [
  {
    id: 3,
    name: 'Summer',
    gender: 'Female',
    species: 'Human',
    status: 'Alive',
    image: '',
    description: '',
    location: { name: 'Earth' },
    url: '',
  },
];
