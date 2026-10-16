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

export interface ExperienceItineraryItem {
  time: string;
  title: string;
  description: string;
}

export interface ExperienceReview {
  id: string;
  author: string;
  avatar?: string;
  country?: string;
  rating: number;
  date: string;
  comment: string;
  photos?: string[];
}

export interface Experience {
  id: string;
  title: string;
  category: string;
  location: string;
  city: string;
  country: string;
  duration: string;
  groupSize: string;
  languages: string[];
  meetingPoint: string;
  meetingPointInstructions?: string;
  meetingCoordinates?: { lat: number; lng: number };
  difficulty?: "Easy" | "Moderate" | "Challenging" | string;
  minAge: number;
  instantConfirmation?: boolean;
  price: number;
  pricePerPerson: number;
  rating: number;
  reviewCount: number;
  reviewsCount?: number;
  cancellationPolicy: string;
  availableSlots: string[];
  hostName: string;
  hostBio: string;
  hostAvatar: string;
  hostResponseTime?: string;
  description: string;
  tagline?: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  whatToBring?: string[];
  itinerary: ExperienceItineraryItem[];
  faqs?: { question: string; answer: string }[];
  reviews?: ExperienceReview[];
  topic: string;
  badge?: string;
  image: string;
  images?: string[];
}

export type Activity = Experience;

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

