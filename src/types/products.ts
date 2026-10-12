import type { Listing } from "./listing";

export type ProductType =
  | "hotels"
  | "homes"
  | "overnight"
  | "day_use"
  | "activities"
  | "transfers"
  | "flights"
  | "packages";

export interface Activity {
  id: string;
  title: string;
  category: "Tours" | "Food" | "Adventure" | "Wellness" | "Culture";
  location: string;
  city: string;
  country: string;
  duration: string;
  pricePerPerson: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  highlights: string[];
  included: string[];
}

export interface Transfer {
  id: string;
  airportName: string;
  airportCode: string;
  city: string;
  country: string;
  vehicleType: "Sedan" | "SUV" | "Van" | "Luxury Limousine";
  vehicleModel: string;
  capacityPassengers: number;
  capacityLuggage: number;
  basePrice: number;
  image: string;
  features: string[];
}

export interface Flight {
  id: string;
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  cabinClass: "Economy" | "Premium Economy" | "Business" | "First";
  price: number;
  aircraft?: string;
}

export interface HotelFlightBundle {
  id: string;
  listing: Listing;
  flight: Flight;
  originalPrice: number;
  bundlePrice: number;
  savingsPercent: number;
  nights: number;
  badge?: string;
}

export interface ProductBooking {
  id: string;
  userId?: string;
  productType: ProductType;
  itemId: string;
  itemTitle: string;
  itemSubtitle?: string;
  itemImage?: string;
  dateOrTime: string;
  timeSlot?: string;
  passengersOrGuests: number;
  rooms?: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  referenceCode: string;
  createdAt: string;
  details?: Record<string, any>;
}

