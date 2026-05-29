export interface CardItem {
  id: string | number;
  name: string;
  description?: string;
  gender?: string;
  image?: string;
  species?: string;
  status?: string;
  location?: { name: string };
  url?: string;
}

export type Character = {
  id: number;
  name: string;
  status: string;
  image: string;
  species: string;
  gender: string;
  location?: {name: string};
};