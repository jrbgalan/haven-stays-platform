import { client } from "@/api/client";
import type {
  Listing,
  Place,
  Review,
  CreateReviewDTO,
  Booking,
  CreateBookingDTO,
  Appointment,
  CreateAppointmentDTO,
  Conversation,
  CreateConversationDTO,
  Message,
  CreateMessageDTO,
  Favorite,
  SupportTicket,
  CreateSupportTicketDTO,
  ConciergeRequest,
  CreateConciergeRequestDTO,
  Report,
  CreateReportDTO,
  AvailabilitySlot,
  CreateAvailabilitySlotDTO,
  Subscriber,
  ProductBooking,
  CreateProductBookingDTO,
  Activity,
  Transfer,
  Flight,
  HotelFlightBundle,
  AvailabilityResponse,
  ListingFilterOptions,
} from "@/types/entities";

/**
 * Universal Data Provider interface for Haven.
 * Any external API (Base44, REST API, GraphQL, Supabase, etc.) can implement this contract.
 */
export interface StayProvider {
  // Listings
  getListings(filter?: ListingFilterOptions): Promise<Listing[]>;
  getListingById(id: string): Promise<Listing>;
  searchListings(query: string, filter?: ListingFilterOptions): Promise<Listing[]>;
  createListing(data: Partial<Listing>): Promise<Listing>;
  updateListing(id: string, patch: Partial<Listing>): Promise<Listing | undefined>;
  deleteListing(id: string): Promise<{ success: boolean }>;

  // Multi-Product Catalog
  getActivities(filter?: Record<string, unknown>): Promise<Activity[]>;
  getActivityById(id: string): Promise<Activity | undefined>;
  getTransfers(filter?: Record<string, unknown>): Promise<Transfer[]>;
  getTransferById(id: string): Promise<Transfer | undefined>;
  getFlights(filter?: Record<string, unknown>): Promise<Flight[]>;
  getFlightById(id: string): Promise<Flight | undefined>;
  getPackages(filter?: Record<string, unknown>): Promise<HotelFlightBundle[]>;
  getPackageById(id: string): Promise<HotelFlightBundle | undefined>;

  // Places & Reviews
  getPlaces(listingId?: string): Promise<Place[]>;
  getReviews(listingId?: string): Promise<Review[]>;
  createReview(data: CreateReviewDTO): Promise<Review>;

  // Bookings & Availability
  getBookings(filter?: Record<string, unknown>): Promise<Booking[]>;
  createBooking(data: CreateBookingDTO): Promise<Booking>;
  updateBooking(id: string, patch: Partial<Booking>): Promise<Booking | undefined>;
  getProductBookings(filter?: Record<string, unknown>): Promise<ProductBooking[]>;
  createProductBooking(data: CreateProductBookingDTO): Promise<ProductBooking>;
  updateProductBooking(id: string, patch: Partial<ProductBooking>): Promise<ProductBooking | undefined>;
  getAvailability(listingId: string): Promise<AvailabilityResponse>;

  // Appointments
  getAppointments(filter?: Record<string, unknown>): Promise<Appointment[]>;
  createAppointment(data: CreateAppointmentDTO): Promise<Appointment>;
  updateAppointment(id: string, patch: Partial<Appointment>): Promise<Appointment | undefined>;

  // Conversations & Host Chat
  getConversations(): Promise<Conversation[]>;
  getConversationById(id: string): Promise<Conversation | null>;
  createConversation(data: CreateConversationDTO): Promise<Conversation>;
  updateConversation(id: string, patch: Partial<Conversation>): Promise<Conversation | undefined>;
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(data: CreateMessageDTO): Promise<Message>;
  sendChatMessage(
    listingId: string | undefined,
    conversationId: string | undefined,
    text: string
  ): Promise<{ conversationId: string; userMessage: Message; hostMessage: Message }>;

  // Favorites
  getFavorites(): Promise<Favorite[]>;
  createFavorite(listingId: string): Promise<Favorite>;
  deleteFavorite(id: string): Promise<{ success: boolean }>;

  // Support & Inquiries
  createSupportTicket(data: CreateSupportTicketDTO): Promise<SupportTicket>;
  createConciergeRequest(data: CreateConciergeRequestDTO): Promise<ConciergeRequest>;
  createReport(data: CreateReportDTO): Promise<Report>;

  // Host Availability Slots
  getAvailabilitySlots(listingId: string): Promise<AvailabilitySlot[]>;
  createAvailabilitySlot(data: CreateAvailabilitySlotDTO): Promise<AvailabilitySlot>;
  deleteAvailabilitySlot(id: string): Promise<{ success: boolean }>;

  // Newsletter Subscribers
  subscribeNewsletter(email: string, source?: string): Promise<Subscriber>;
}

/**
 * Default StayProvider implementation using Base44/localStorage client entities.
 */
export class Base44StayProvider implements StayProvider {
  // LISTINGS
  async getListings(filter?: ListingFilterOptions): Promise<Listing[]> {
    const list = await client.entities.Listing.list();
    if (!filter) return list;

    return list.filter((l) => {
      if (filter.category && filter.category !== "All" && l.category !== filter.category) return false;
      if (filter.propertyType && filter.propertyType !== "all" && l.propertyType !== filter.propertyType) return false;
      if (filter.stayType && filter.stayType !== "all" && l.stayType !== filter.stayType && l.stayType !== "both") return false;
      if (filter.city && !l.city.toLowerCase().includes(filter.city.toLowerCase())) return false;
      if (filter.location && !l.location?.toLowerCase().includes(filter.location.toLowerCase()) && !l.city.toLowerCase().includes(filter.location.toLowerCase())) return false;
      if (filter.minPrice && l.pricePerNight < filter.minPrice) return false;
      if (filter.maxPrice && l.pricePerNight > filter.maxPrice) return false;
      if (filter.guests && (l.maxGuests || 2) < filter.guests) return false;
      if (filter.isVerified && !l.isVerified) return false;
      if (filter.freeCancellation && !l.freeCancellation) return false;
      if (filter.instantBookable && !l.instantBookable) return false;
      if (filter.amenities && filter.amenities.length > 0) {
        const itemAmenities = l.amenities || [];
        const hasAll = filter.amenities.every((a) => itemAmenities.includes(a));
        if (!hasAll) return false;
      }
      return true;
    });
  }

  async getListingById(id: string): Promise<Listing> {
    const listing = await client.entities.Listing.get(id);
    if (!listing) {
      throw new Error(`Stay not found with id: ${id}`);
    }
    return listing;
  }

  async searchListings(query: string, filter?: ListingFilterOptions): Promise<Listing[]> {
    const all = await this.getListings(filter);
    if (!query || !query.trim()) return all;
    const q = query.toLowerCase().trim();
    return all.filter((l) =>
      l.title.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      (l.description && l.description.toLowerCase().includes(q))
    );
  }

  async createListing(data: Partial<Listing>): Promise<Listing> {
    return client.entities.Listing.create(data);
  }

  async updateListing(id: string, patch: Partial<Listing>): Promise<Listing | undefined> {
    return client.entities.Listing.update(id, patch);
  }

  async deleteListing(id: string): Promise<{ success: boolean }> {
    return client.entities.Listing.delete(id);
  }

  // MULTI-PRODUCT CATALOG
  async getActivities(filter?: Record<string, unknown>): Promise<Activity[]> {
    if (!filter || Object.keys(filter).length === 0) {
      return client.entities.Activity.list();
    }
    return client.entities.Activity.filter(filter);
  }

  async getActivityById(id: string): Promise<Activity | undefined> {
    return client.entities.Activity.get(id);
  }

  async getTransfers(filter?: Record<string, unknown>): Promise<Transfer[]> {
    if (!filter || Object.keys(filter).length === 0) {
      return client.entities.Transfer.list();
    }
    return client.entities.Transfer.filter(filter);
  }

  async getTransferById(id: string): Promise<Transfer | undefined> {
    return client.entities.Transfer.get(id);
  }

  async getFlights(filter?: Record<string, unknown>): Promise<Flight[]> {
    if (!filter || Object.keys(filter).length === 0) {
      return client.entities.Flight.list();
    }
    return client.entities.Flight.filter(filter);
  }

  async getFlightById(id: string): Promise<Flight | undefined> {
    return client.entities.Flight.get(id);
  }

  async getPackages(_filter?: Record<string, unknown>): Promise<HotelFlightBundle[]> {
    return client.entities.Package.list();
  }

  async getPackageById(id: string): Promise<HotelFlightBundle | undefined> {
    return client.entities.Package.get(id);
  }

  // PLACES & REVIEWS
  async getPlaces(listingId?: string): Promise<Place[]> {
    if (listingId) {
      return client.entities.Place.filter({ listingId }) as Promise<Place[]>;
    }
    return client.entities.Place.list() as Promise<Place[]>;
  }

  async getReviews(listingId?: string): Promise<Review[]> {
    if (listingId) {
      return client.entities.Review.filter({ listingId }) as Promise<Review[]>;
    }
    return client.entities.Review.filter({}) as Promise<Review[]>;
  }

  async createReview(data: CreateReviewDTO): Promise<Review> {
    return client.entities.Review.create(data);
  }

  // BOOKINGS & AVAILABILITY
  async getBookings(filter?: Record<string, unknown>): Promise<Booking[]> {
    return client.entities.Booking.filter(filter || {});
  }

  async createBooking(data: CreateBookingDTO): Promise<Booking> {
    const res = await client.functions.invoke("createBooking", data);
    return res.data?.booking || res.data;
  }

  async updateBooking(id: string, patch: Partial<Booking>): Promise<Booking | undefined> {
    return client.entities.Booking.update(id, patch);
  }

  async getProductBookings(filter?: Record<string, unknown>): Promise<ProductBooking[]> {
    return client.entities.ProductBooking.filter(filter || {});
  }

  async createProductBooking(data: CreateProductBookingDTO): Promise<ProductBooking> {
    return client.entities.ProductBooking.create(data);
  }

  async updateProductBooking(id: string, patch: Partial<ProductBooking>): Promise<ProductBooking | undefined> {
    return client.entities.ProductBooking.update(id, patch);
  }

  async getAvailability(listingId: string): Promise<AvailabilityResponse> {
    const res = await client.functions.invoke("getAvailability", { listingId });
    return (res.data as AvailabilityResponse) || { bookedRanges: [], bookedSlots: [] };
  }

  // APPOINTMENTS
  async getAppointments(filter?: Record<string, unknown>): Promise<Appointment[]> {
    return client.entities.Appointment.filter(filter || {});
  }

  async createAppointment(data: CreateAppointmentDTO): Promise<Appointment> {
    const res = await client.functions.invoke("bookAppointment", data);
    return res.data?.appointment || res.data;
  }

  async updateAppointment(id: string, patch: Partial<Appointment>): Promise<Appointment | undefined> {
    return client.entities.Appointment.update(id, patch);
  }

  // CONVERSATIONS & CHAT
  async getConversations(): Promise<Conversation[]> {
    return client.entities.Conversation.filter({});
  }

  async getConversationById(id: string): Promise<Conversation | null> {
    return client.entities.Conversation.get(id);
  }

  async createConversation(data: CreateConversationDTO): Promise<Conversation> {
    return client.entities.Conversation.create(data);
  }

  async updateConversation(id: string, patch: Partial<Conversation>): Promise<Conversation | undefined> {
    return client.entities.Conversation.update(id, patch);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return client.entities.Message.filter({ conversationId });
  }

  async createMessage(data: CreateMessageDTO): Promise<Message> {
    return client.entities.Message.create(data);
  }

  async sendChatMessage(
    listingId: string | undefined,
    conversationId: string | undefined,
    text: string
  ): Promise<{ conversationId: string; userMessage: Message; hostMessage: Message }> {
    const res = await client.functions.invoke("sendChatMessage", {
      listingId,
      conversationId,
      text,
    });
    return res.data;
  }

  // FAVORITES
  async getFavorites(): Promise<Favorite[]> {
    return client.entities.Favorite.filter({});
  }

  async createFavorite(listingId: string): Promise<Favorite> {
    return client.entities.Favorite.create({ listingId });
  }

  async deleteFavorite(id: string): Promise<{ success: boolean }> {
    return client.entities.Favorite.delete(id);
  }

  // SUPPORT & INQUIRIES
  async createSupportTicket(data: CreateSupportTicketDTO): Promise<SupportTicket> {
    return client.entities.SupportTicket.create(data);
  }

  async createConciergeRequest(data: CreateConciergeRequestDTO): Promise<ConciergeRequest> {
    return client.entities.ConciergeRequest.create(data);
  }

  async createReport(data: CreateReportDTO): Promise<Report> {
    return client.entities.Report.create(data);
  }

  // HOST AVAILABILITY SLOTS
  async getAvailabilitySlots(listingId: string): Promise<AvailabilitySlot[]> {
    return client.entities.AvailabilitySlot.filter({ listingId });
  }

  async createAvailabilitySlot(data: CreateAvailabilitySlotDTO): Promise<AvailabilitySlot> {
    return client.entities.AvailabilitySlot.create(data);
  }

  async deleteAvailabilitySlot(id: string): Promise<{ success: boolean }> {
    return client.entities.AvailabilitySlot.delete(id);
  }

  // NEWSLETTER
  async subscribeNewsletter(email: string, source = "website_footer"): Promise<Subscriber> {
    return client.entities.Subscriber.create({ email, source });
  }
}

// Global active provider instance (can be swapped at runtime or for testing)
let activeProvider: StayProvider = new Base44StayProvider();

export function getStayProvider(): StayProvider {
  return activeProvider;
}

export function setStayProvider(provider: StayProvider): void {
  activeProvider = provider;
}

