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

export interface CharactersResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };

  results: CardItem[];
}