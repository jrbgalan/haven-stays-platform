import type { Listing } from "./listing";
import type { Activity, Transfer, Flight, HotelFlightBundle, ProductType, ProductBooking } from "./products";

export interface Place {
  id: string;
  listingId?: string;
  name: string;
  category: "Eat & Drink" | "Attractions" | "Nature" | "Nightlife" | "Hidden Gems" | string;
  description?: string;
  image?: string;
  distance?: string;
  rating?: number;
}

export interface Review {
  id: string;
  listingId: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  country?: string;
}

export interface CreateReviewDTO {
  listingId: string;
  author: string;
  rating: number;
  comment: string;
  avatar?: string;
  country?: string;
}

export interface Booking {
  id: string;
  listingId: string;
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  reference: string;
  createdAt: string;
  listingTitle?: string;
  listingImage?: string;
  stayType?: "overnight" | "day_use";
  timeSlot?: string;
  nights?: number;
}

export interface CreateBookingDTO {
  listingId: string;
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  stayType?: "overnight" | "day_use";
  timeSlot?: string;
  nights?: number;
}

export interface Appointment {
  id: string;
  listingId: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  timeSlot: string;
  note?: string;
  status: "confirmed" | "pending" | "cancelled";
  reference: string;
  createdAt: string;
  listingTitle?: string;
}

export interface CreateAppointmentDTO {
  listingId: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  timeSlot: string;
  note?: string;
}

export interface Conversation {
  id: string;
  listingId?: string;
  listingTitle?: string;
  listingImage?: string;
  guestId?: string;
  guestName?: string;
  hostId?: string;
  hostName?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadByGuest?: number;
  createdAt: string;
}

export interface CreateConversationDTO {
  listingId?: string;
  listingTitle?: string;
  listingImage?: string;
  guestId?: string;
  guestName?: string;
  hostId?: string;
  hostName?: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  guestId?: string;
  hostId?: string;
  text: string;
  createdAt: string;
}

export interface CreateMessageDTO {
  conversationId: string;
  senderId: string;
  senderName?: string;
  guestId?: string;
  hostId?: string;
  text: string;
}

export interface Favorite {
  id: string;
  listingId: string;
  userId?: string;
  createdAt: string;
}

export interface CreateFavoriteDTO {
  listingId: string;
  userId?: string;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  name: string;
  email: string;
  subject?: string;
  category?: string;
  message: string;
  createdAt: string;
}

export interface CreateSupportTicketDTO {
  userId?: string;
  name: string;
  email: string;
  subject?: string;
  category?: string;
  message: string;
}

export interface ConciergeRequest {
  id: string;
  userId?: string;
  bookingId?: string;
  requestType?: string;
  destination?: string;
  partySize?: number;
  dates?: string;
  notes?: string;
  status?: string;
  createdAt: string;
}

export interface CreateConciergeRequestDTO {
  userId?: string;
  bookingId?: string;
  requestType?: string;
  destination?: string;
  partySize?: number;
  dates?: string;
  notes?: string;
}

export interface Report {
  id: string;
  userId?: string;
  type?: string;
  targetId?: string | null;
  category?: string;
  description?: string;
  reason?: string;
  details?: string;
  evidence?: string[];
  isAnonymous?: boolean;
  reference?: string;
  listingId?: string;
  bookingId?: string;
  createdAt?: string;
}

export interface CreateReportDTO {
  userId?: string;
  type?: string;
  targetId?: string | null;
  category?: string;
  description?: string;
  reason?: string;
  details?: string;
  evidence?: string[];
  isAnonymous?: boolean;
  reference?: string;
  listingId?: string;
  bookingId?: string;
}

export interface AvailabilitySlot {
  id: string;
  listingId: string;
  date: string;
  timeSlot: string;
  createdAt: string;
}

export interface CreateAvailabilitySlotDTO {
  listingId: string;
  date: string;
  timeSlot: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source?: string;
}

export interface CreateSubscriberDTO {
  email: string;
  source?: string;
}

export interface CreateProductBookingDTO {
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
  details?: Record<string, unknown>;
}

export interface AvailabilityResponse {
  bookedRanges: { checkIn: string; checkOut: string }[];
  bookedSlots: string[];
}

export interface ListingFilterOptions {
  city?: string;
  country?: string;
  location?: string;
  category?: string;
  propertyType?: string;
  stayType?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  amenities?: string[];
  featured?: boolean;
  isVerified?: boolean;
  freeCancellation?: boolean;
  instantBookable?: boolean;
  sort?: string;
}

export type { Listing, Activity, Transfer, Flight, HotelFlightBundle, ProductType, ProductBooking };
