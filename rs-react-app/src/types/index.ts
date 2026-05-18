export interface CardItem {
  id: string | number;
  name: string;
  description?: string;
  gender?: string;
  image?: string;
  species?: string;
  status?: string;
  location?: {name: string};
}
