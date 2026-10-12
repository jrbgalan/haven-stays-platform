import { getStayProvider } from "./provider";
import { memoryCache } from "./cache";
import { withRetry, handleServiceError } from "./errors";
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

// Cache Keys
const CACHE_KEY_LISTINGS = "listings_all";
const CACHE_KEY_ACTIVITIES = "activities_all";
const CACHE_KEY_TRANSFERS = "transfers_all";
const CACHE_KEY_FLIGHTS = "flights_all";
const CACHE_KEY_PACKAGES = "packages_all";

// --- LISTINGS SERVICE ---
export async function getListings(filter?: ListingFilterOptions): Promise<Listing[]> {
  try {
    const cacheKey = filter ? `listings_${JSON.stringify(filter)}` : CACHE_KEY_LISTINGS;
    const cached = memoryCache.get<Listing[]>(cacheKey);
    if (cached) return cached;

    const data = await withRetry(() => getStayProvider().getListings(filter));
    memoryCache.set(cacheKey, data, 25000);
    return data;
  } catch (err) {
    handleServiceError(err, "getListings");
  }
}

export async function getListingById(id: string): Promise<Listing> {
  try {
    const cacheKey = `listing_${id}`;
    const cached = memoryCache.get<Listing>(cacheKey);
    if (cached) return cached;

    const data = await withRetry(() => getStayProvider().getListingById(id));
    memoryCache.set(cacheKey, data, 30000);
    return data;
  } catch (err) {
    handleServiceError(err, `getListingById(${id})`);
  }
}

export async function searchListings(query: string, filter?: ListingFilterOptions): Promise<Listing[]> {
  try {
    return await withRetry(() => getStayProvider().searchListings(query, filter));
  } catch (err) {
    handleServiceError(err, `searchListings("${query}")`);
  }
}

export async function createListing(data: Partial<Listing>): Promise<Listing> {
  try {
    const created = await getStayProvider().createListing(data);
    memoryCache.invalidate("listings");
    return created;
  } catch (err) {
    handleServiceError(err, "createListing");
  }
}

export async function updateListing(id: string, patch: Partial<Listing>): Promise<Listing | undefined> {
  try {
    const updated = await getStayProvider().updateListing(id, patch);
    memoryCache.invalidate("listings");
    memoryCache.invalidate(`listing_${id}`);
    return updated;
  } catch (err) {
    handleServiceError(err, `updateListing(${id})`);
  }
}

export async function deleteListing(id: string): Promise<{ success: boolean }> {
  try {
    const res = await getStayProvider().deleteListing(id);
    memoryCache.invalidate("listings");
    memoryCache.invalidate(`listing_${id}`);
    return res;
  } catch (err) {
    handleServiceError(err, `deleteListing(${id})`);
  }
}

// --- MULTI-PRODUCT CATALOG ---
export async function getActivities(filter?: Record<string, unknown>): Promise<Activity[]> {
  try {
    const cacheKey = filter ? `activities_${JSON.stringify(filter)}` : CACHE_KEY_ACTIVITIES;
    const cached = memoryCache.get<Activity[]>(cacheKey);
    if (cached) return cached;

    const data = await withRetry(() => getStayProvider().getActivities(filter));
    memoryCache.set(cacheKey, data, 60000);
    return data;
  } catch (err) {
    handleServiceError(err, "getActivities");
  }
}

export async function getActivityById(id: string): Promise<Activity | undefined> {
  try {
    return await withRetry(() => getStayProvider().getActivityById(id));
  } catch (err) {
    handleServiceError(err, `getActivityById(${id})`);
  }
}

export async function getTransfers(filter?: Record<string, unknown>): Promise<Transfer[]> {
  try {
    const cacheKey = filter ? `transfers_${JSON.stringify(filter)}` : CACHE_KEY_TRANSFERS;
    const cached = memoryCache.get<Transfer[]>(cacheKey);
    if (cached) return cached;

    const data = await withRetry(() => getStayProvider().getTransfers(filter));
    memoryCache.set(cacheKey, data, 60000);
    return data;
  } catch (err) {
    handleServiceError(err, "getTransfers");
  }
}

export async function getTransferById(id: string): Promise<Transfer | undefined> {
  try {
    return await withRetry(() => getStayProvider().getTransferById(id));
  } catch (err) {
    handleServiceError(err, `getTransferById(${id})`);
  }
}

export async function getFlights(filter?: Record<string, unknown>): Promise<Flight[]> {
  try {
    const cacheKey = filter ? `flights_${JSON.stringify(filter)}` : CACHE_KEY_FLIGHTS;
    const cached = memoryCache.get<Flight[]>(cacheKey);
    if (cached) return cached;

    const data = await withRetry(() => getStayProvider().getFlights(filter));
    memoryCache.set(cacheKey, data, 60000);
    return data;
  } catch (err) {
    handleServiceError(err, "getFlights");
  }
}

export async function getFlightById(id: string): Promise<Flight | undefined> {
  try {
    return await withRetry(() => getStayProvider().getFlightById(id));
  } catch (err) {
    handleServiceError(err, `getFlightById(${id})`);
  }
}

export async function getPackages(filter?: Record<string, unknown>): Promise<HotelFlightBundle[]> {
  try {
    const cached = memoryCache.get<HotelFlightBundle[]>(CACHE_KEY_PACKAGES);
    if (cached) return cached;

    const data = await withRetry(() => getStayProvider().getPackages(filter));
    memoryCache.set(CACHE_KEY_PACKAGES, data, 60000);
    return data;
  } catch (err) {
    handleServiceError(err, "getPackages");
  }
}

export async function getPackageById(id: string): Promise<HotelFlightBundle | undefined> {
  try {
    return await withRetry(() => getStayProvider().getPackageById(id));
  } catch (err) {
    handleServiceError(err, `getPackageById(${id})`);
  }
}

// --- PLACES & REVIEWS ---
export async function getPlaces(listingId?: string): Promise<Place[]> {
  try {
    const cacheKey = listingId ? `places_${listingId}` : "places_all";
    const cached = memoryCache.get<Place[]>(cacheKey);
    if (cached) return cached;

    const data = await withRetry(() => getStayProvider().getPlaces(listingId));
    memoryCache.set(cacheKey, data, 60000);
    return data;
  } catch (err) {
    handleServiceError(err, `getPlaces(${listingId})`);
  }
}

export async function getReviews(listingId?: string): Promise<Review[]> {
  try {
    const cacheKey = listingId ? `reviews_${listingId}` : "reviews_all";
    const cached = memoryCache.get<Review[]>(cacheKey);
    if (cached) return cached;

    const data = await withRetry(() => getStayProvider().getReviews(listingId));
    memoryCache.set(cacheKey, data, 30000);
    return data;
  } catch (err) {
    handleServiceError(err, `getReviews(${listingId})`);
  }
}

export async function createReview(data: CreateReviewDTO): Promise<Review> {
  try {
    const created = await getStayProvider().createReview(data);
    memoryCache.invalidate(`reviews_${data.listingId}`);
    return created;
  } catch (err) {
    handleServiceError(err, "createReview");
  }
}

// --- BOOKINGS & AVAILABILITY ---
export async function getBookings(filter?: Record<string, unknown>): Promise<Booking[]> {
  try {
    return await withRetry(() => getStayProvider().getBookings(filter));
  } catch (err) {
    handleServiceError(err, "getBookings");
  }
}

export async function createBooking(data: CreateBookingDTO): Promise<Booking> {
  try {
    const booking = await getStayProvider().createBooking(data);
    memoryCache.invalidate(`availability_${data.listingId}`);
    return booking;
  } catch (err) {
    handleServiceError(err, "createBooking");
  }
}

export async function updateBooking(id: string, patch: Partial<Booking>): Promise<Booking | undefined> {
  try {
    return await getStayProvider().updateBooking(id, patch);
  } catch (err) {
    handleServiceError(err, `updateBooking(${id})`);
  }
}

export async function getProductBookings(filter?: Record<string, unknown>): Promise<ProductBooking[]> {
  try {
    return await withRetry(() => getStayProvider().getProductBookings(filter));
  } catch (err) {
    handleServiceError(err, "getProductBookings");
  }
}

export async function createProductBooking(data: CreateProductBookingDTO): Promise<ProductBooking> {
  try {
    return await getStayProvider().createProductBooking(data);
  } catch (err) {
    handleServiceError(err, "createProductBooking");
  }
}

export async function updateProductBooking(id: string, patch: Partial<ProductBooking>): Promise<ProductBooking | undefined> {
  try {
    return await getStayProvider().updateProductBooking(id, patch);
  } catch (err) {
    handleServiceError(err, `updateProductBooking(${id})`);
  }
}

export async function getAvailability(listingId: string): Promise<AvailabilityResponse> {
  try {
    const cacheKey = `availability_${listingId}`;
    const cached = memoryCache.get<AvailabilityResponse>(cacheKey);
    if (cached) return cached;

    const data = await withRetry(() => getStayProvider().getAvailability(listingId));
    memoryCache.set(cacheKey, data, 15000);
    return data;
  } catch (err) {
    handleServiceError(err, `getAvailability(${listingId})`);
  }
}

// --- APPOINTMENTS ---
export async function getAppointments(filter?: Record<string, unknown>): Promise<Appointment[]> {
  try {
    return await withRetry(() => getStayProvider().getAppointments(filter));
  } catch (err) {
    handleServiceError(err, "getAppointments");
  }
}

export async function createAppointment(data: CreateAppointmentDTO): Promise<Appointment> {
  try {
    return await getStayProvider().createAppointment(data);
  } catch (err) {
    handleServiceError(err, "createAppointment");
  }
}

export async function updateAppointment(id: string, patch: Partial<Appointment>): Promise<Appointment | undefined> {
  try {
    return await getStayProvider().updateAppointment(id, patch);
  } catch (err) {
    handleServiceError(err, `updateAppointment(${id})`);
  }
}

// --- CONVERSATIONS & CHAT ---
export async function getConversations(): Promise<Conversation[]> {
  try {
    return await withRetry(() => getStayProvider().getConversations());
  } catch (err) {
    handleServiceError(err, "getConversations");
  }
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  try {
    return await withRetry(() => getStayProvider().getConversationById(id));
  } catch (err) {
    handleServiceError(err, `getConversationById(${id})`);
  }
}

export async function createConversation(data: CreateConversationDTO): Promise<Conversation> {
  try {
    return await getStayProvider().createConversation(data);
  } catch (err) {
    handleServiceError(err, "createConversation");
  }
}

export async function updateConversation(id: string, patch: Partial<Conversation>): Promise<Conversation | undefined> {
  try {
    return await getStayProvider().updateConversation(id, patch);
  } catch (err) {
    handleServiceError(err, `updateConversation(${id})`);
  }
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    return await withRetry(() => getStayProvider().getMessages(conversationId));
  } catch (err) {
    handleServiceError(err, `getMessages(${conversationId})`);
  }
}

export async function createMessage(data: CreateMessageDTO): Promise<Message> {
  try {
    return await getStayProvider().createMessage(data);
  } catch (err) {
    handleServiceError(err, "createMessage");
  }
}

export async function sendChatMessage(
  listingId: string | undefined,
  conversationId: string | undefined,
  text: string
): Promise<{ conversationId: string; userMessage: Message; hostMessage: Message }> {
  try {
    return await getStayProvider().sendChatMessage(listingId, conversationId, text);
  } catch (err) {
    handleServiceError(err, "sendChatMessage");
  }
}

// --- FAVORITES ---
export async function getFavorites(): Promise<Favorite[]> {
  try {
    return await withRetry(() => getStayProvider().getFavorites());
  } catch (err) {
    handleServiceError(err, "getFavorites");
  }
}

export async function createFavorite(listingId: string): Promise<Favorite> {
  try {
    return await getStayProvider().createFavorite(listingId);
  } catch (err) {
    handleServiceError(err, `createFavorite(${listingId})`);
  }
}

export async function deleteFavorite(id: string): Promise<{ success: boolean }> {
  try {
    return await getStayProvider().deleteFavorite(id);
  } catch (err) {
    handleServiceError(err, `deleteFavorite(${id})`);
  }
}

// --- SUPPORT, INQUIRIES, REPORTS ---
export async function createSupportTicket(data: CreateSupportTicketDTO): Promise<SupportTicket> {
  try {
    return await getStayProvider().createSupportTicket(data);
  } catch (err) {
    handleServiceError(err, "createSupportTicket");
  }
}

export async function createConciergeRequest(data: CreateConciergeRequestDTO): Promise<ConciergeRequest> {
  try {
    return await getStayProvider().createConciergeRequest(data);
  } catch (err) {
    handleServiceError(err, "createConciergeRequest");
  }
}

export async function createReport(data: CreateReportDTO): Promise<Report> {
  try {
    return await getStayProvider().createReport(data);
  } catch (err) {
    handleServiceError(err, "createReport");
  }
}

// --- AVAILABILITY SLOTS ---
export async function getAvailabilitySlots(listingId: string): Promise<AvailabilitySlot[]> {
  try {
    return await withRetry(() => getStayProvider().getAvailabilitySlots(listingId));
  } catch (err) {
    handleServiceError(err, `getAvailabilitySlots(${listingId})`);
  }
}

export async function createAvailabilitySlot(data: CreateAvailabilitySlotDTO): Promise<AvailabilitySlot> {
  try {
    return await getStayProvider().createAvailabilitySlot(data);
  } catch (err) {
    handleServiceError(err, "createAvailabilitySlot");
  }
}

export async function deleteAvailabilitySlot(id: string): Promise<{ success: boolean }> {
  try {
    return await getStayProvider().deleteAvailabilitySlot(id);
  } catch (err) {
    handleServiceError(err, `deleteAvailabilitySlot(${id})`);
  }
}

// --- NEWSLETTER ---
export async function subscribeNewsletter(email: string, source = "website_footer"): Promise<Subscriber> {
  try {
    return await getStayProvider().subscribeNewsletter(email, source);
  } catch (err) {
    handleServiceError(err, `subscribeNewsletter(${email})`);
  }
}
