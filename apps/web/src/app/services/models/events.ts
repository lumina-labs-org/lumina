import { Organization } from "./organization";

export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  price: number;
  imageUrl: string;
}
