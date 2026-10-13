import { CURATED_LISTINGS } from "./curatedStays";
import { INITIAL_PRODUCT_BOOKINGS } from "./mockProductData";

export const DEMO_GUEST_USER = {
  id: "user-demo-guest",
  email: "eleanor.vance@haven.luxury",
  full_name: "Eleanor Vance",
  role: "guest",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const DEMO_HOST_USER = {
  id: "user-demo-host",
  email: "marcus.reed@haven.luxury",
  full_name: "Marcus Reed",
  role: "host",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
  created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
};

export const SEED_BOOKINGS = [
  {
    id: "bk-seeded-1",
    userId: "user-demo-guest",
    listingId: "stay-maldives-overwater",
    listingTitle: "Maldives Overwater Retreat",
    listingImage: CURATED_LISTINGS[0]?.images?.[0] || "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
    checkIn: "2026-11-14",
    checkOut: "2026-11-18",
    guests: 2,
    nights: 4,
    totalPrice: 8800,
    status: "confirmed",
    reference: "HV-MAL9421",
    stayType: "overnight",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "bk-seeded-2",
    userId: "user-demo-guest",
    listingId: "stay-kyoto-machiya",
    listingTitle: "Kyoto Heritage Cedar Machiya",
    listingImage: CURATED_LISTINGS[3]?.images?.[0] || "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    checkIn: "2026-12-01",
    checkOut: "2026-12-05",
    guests: 2,
    nights: 4,
    totalPrice: 3800,
    status: "confirmed",
    reference: "HV-KYO8104",
    stayType: "overnight",
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "bk-seeded-3",
    userId: "user-demo-guest",
    listingId: "stay-bali-bamboo",
    listingTitle: "Ubud Bamboo Sanctuary",
    listingImage: CURATED_LISTINGS[2]?.images?.[0] || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    checkIn: "2026-11-25",
    checkOut: "2026-11-25",
    guests: 2,
    nights: 1,
    totalPrice: 380,
    status: "confirmed",
    reference: "HV-DU5902",
    stayType: "day_use",
    timeSlot: "12:00 - 20:00",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const SEED_APPOINTMENTS = [
  {
    id: "apt-seeded-1",
    userId: "user-demo-guest",
    listingId: "stay-zermatt-chalet",
    listingTitle: "Matterhorn Peak Chalet",
    date: "2026-11-10",
    timeSlot: "14:00",
    type: "virtual",
    notes: "Private 4K virtual walkthrough with host Marcus Reed ahead of winter ski season booking.",
    status: "confirmed",
    reference: "AP-ZER720",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export const SEED_CONVERSATIONS = [
  {
    id: "conv-seeded-1",
    listingId: "stay-maldives-overwater",
    listingTitle: "Maldives Overwater Retreat",
    listingImage: CURATED_LISTINGS[0]?.images?.[0] || "",
    guestId: "user-demo-guest",
    guestName: "Eleanor Vance",
    hostId: "user-demo-host",
    hostName: "Marcus Reed",
    lastMessage: "Consider it arranged. Your private boat captain will be waiting at the dock. Safe travels!",
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "conv-seeded-2",
    listingId: "stay-kyoto-machiya",
    listingTitle: "Kyoto Heritage Cedar Machiya",
    listingImage: CURATED_LISTINGS[3]?.images?.[0] || "",
    guestId: "user-demo-guest",
    guestName: "Eleanor Vance",
    hostId: "host-kenji-sato",
    hostName: "Kenji Sato",
    lastMessage: "Konbanwa Eleanor-san! The cedar bath has been seasoned with fresh yuzu for your afternoon arrival.",
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const SEED_MESSAGES = [
  {
    id: "msg-1-1",
    conversationId: "conv-seeded-1",
    senderId: "user-demo-host",
    senderName: "Marcus Reed",
    text: "Good morning Eleanor! We're thrilled to welcome you to the Overwater Retreat next week. Would you like our private sommelier to prepare a sunset wine flight for your arrival?",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "msg-1-2",
    conversationId: "conv-seeded-1",
    senderId: "user-demo-guest",
    senderName: "Eleanor Vance",
    text: "That sounds divine, Marcus. A vintage Champagne pairing with light seaside canapés would be wonderful around 6:30 PM.",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "msg-1-3",
    conversationId: "conv-seeded-1",
    senderId: "user-demo-host",
    senderName: "Marcus Reed",
    text: "Consider it arranged. Your private boat captain will be waiting at the dock. Safe travels!",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "msg-2-1",
    conversationId: "conv-seeded-2",
    senderId: "host-kenji-sato",
    senderName: "Kenji Sato",
    text: "Konbanwa Eleanor-san! The cedar bath has been seasoned with fresh yuzu for your afternoon arrival.",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

/**
 * Initializes seed demo data if localStorage is empty or if forced.
 */
export function initDemoData(force = false) {
  const KEY_BOOKINGS = "haven_bookings";
  const KEY_APPTS = "haven_appointments";
  const KEY_CONVS = "haven_conversations";
  const KEY_MSGS = "haven_messages";
  const KEY_PRODUCT_BOOKINGS = "haven_product_bookings";
  const KEY_USER = "haven_current_user";
  const KEY_TOKEN = "haven_access_token";

  if (force || !localStorage.getItem(KEY_BOOKINGS) || JSON.parse(localStorage.getItem(KEY_BOOKINGS) || "[]").length === 0) {
    localStorage.setItem(KEY_BOOKINGS, JSON.stringify(SEED_BOOKINGS));
  }
  if (force || !localStorage.getItem(KEY_APPTS) || JSON.parse(localStorage.getItem(KEY_APPTS) || "[]").length === 0) {
    localStorage.setItem(KEY_APPTS, JSON.stringify(SEED_APPOINTMENTS));
  }
  if (force || !localStorage.getItem(KEY_CONVS) || JSON.parse(localStorage.getItem(KEY_CONVS) || "[]").length === 0) {
    localStorage.setItem(KEY_CONVS, JSON.stringify(SEED_CONVERSATIONS));
  }
  if (force || !localStorage.getItem(KEY_MSGS) || JSON.parse(localStorage.getItem(KEY_MSGS) || "[]").length === 0) {
    localStorage.setItem(KEY_MSGS, JSON.stringify(SEED_MESSAGES));
  }
  if (force || !localStorage.getItem(KEY_PRODUCT_BOOKINGS) || JSON.parse(localStorage.getItem(KEY_PRODUCT_BOOKINGS) || "[]").length === 0) {
    localStorage.setItem(KEY_PRODUCT_BOOKINGS, JSON.stringify(INITIAL_PRODUCT_BOOKINGS));
  }
  if (force || !localStorage.getItem(KEY_USER)) {
    localStorage.setItem(KEY_USER, JSON.stringify(DEMO_GUEST_USER));
    localStorage.setItem(KEY_TOKEN, "haven_demo_guest_token");
  }
}

/**
 * Completely resets demo state to the initial luxury presentation dataset.
 */
export function resetDemoData() {
  initDemoData(true);
}

