export interface AIListingHelperInput {
  category?: string;
  location?: string;
  amenities?: string[];
  photoNotes?: string;
}

export interface AIListingHelperResult {
  title?: string;
  description?: string;
  suggestedPriceMin?: number;
  suggestedPriceMax?: number;
}

export interface AISmartSearchInput {
  query: string;
}

export interface AISmartSearchResult {
  listingIds?: string[];
  category?: string | null;
  maxPrice?: number | null;
  minBedrooms?: number | null;
  amenities?: string[];
  error?: string;
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface AITripConciergeInput {
  prompt: string;
}

export interface AITripConciergeResult {
  intro?: string;
  listingIds?: string[];
  itinerary?: ItineraryItem[];
  error?: string;
}

export interface ConciergeMessage {
  role: 'user' | 'ai';
  text?: string;
  intro?: string;
  itinerary?: ItineraryItem[];
  listings?: any[];
  error?: string;
}

