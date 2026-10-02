export interface Listing {
  id: string;
  title: string;
  description?: string;
  location?: string;
  city: string;
  country: string;
  pricePerNight: number;
  images?: string[];
  amenities?: string[];
  category: 'Beachfront' | 'Cabins' | 'Villas' | 'City' | 'Countryside' | string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  rating?: number;
  hostName?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

