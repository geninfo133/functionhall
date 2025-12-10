export interface Hall {
  id: number;
  name: string;
  location: string;
  capacity: number;
  price_per_day: number;
  image_url?: string;
  photos?: string[];
  description?: string;
  owner_name?: string;
  contact_number?: string;
}
