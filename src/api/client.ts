import { CURATED_LISTINGS, CURATED_PLACES, CURATED_REVIEWS } from '@/lib/curatedStays';
import { runAITripConcierge, runAISmartSearch, runAIListingHelper, runHostChatReply } from '@/lib/openai';
import type { Listing } from '@/types/listing';

// Storage keys
const KEY_USER = 'haven_current_user';
const KEY_LISTINGS = 'haven_listings';
const KEY_BOOKINGS = 'haven_bookings';
const KEY_APPTS = 'haven_appointments';
const KEY_CONVS = 'haven_conversations';
const KEY_MSGS = 'haven_messages';
const KEY_FAVS = 'haven_favorites';
const KEY_REVIEWS = 'haven_reviews';

function load<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function save<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

// Default initial state
if (!localStorage.getItem(KEY_LISTINGS)) {
  save(KEY_LISTINGS, CURATED_LISTINGS);
}
if (!localStorage.getItem(KEY_REVIEWS)) {
  save(KEY_REVIEWS, CURATED_REVIEWS);
}
if (!localStorage.getItem(KEY_USER)) {
  save(KEY_USER, {
    id: 'user-demo-1',
    email: 'guest@haven.luxury',
    full_name: 'Julian Vance',
    role: 'admin',
    created_at: new Date().toISOString(),
  });
}

function generateRef(prefix: string) {
  return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export const client = {
  auth: {
    me: async () => {
      const u = load(KEY_USER, null);
      return u;
    },
    login: async ({ email }: { email: string; password?: string }) => {
      const user = {
        id: 'user-' + Math.random().toString(36).substring(2, 7),
        email,
        full_name: email.split('@')[0],
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      save(KEY_USER, user);
      return user;
    },
    register: async ({ email, full_name, role }: { email: string; full_name?: string; password?: string; role?: string }) => {
      const user = {
        id: 'user-' + Math.random().toString(36).substring(2, 7),
        email,
        full_name: full_name || email.split('@')[0],
        role: role || 'guest',
        created_at: new Date().toISOString(),
      };
      save(KEY_USER, user);
      return user;
    },
    logout: async (_redirectUrl?: string) => {
      localStorage.removeItem(KEY_USER);
    },
    updateMe: async (patch: any) => {
      const current = load(KEY_USER, {}) || {};
      const updated = { ...current, ...patch };
      save(KEY_USER, updated);
      return updated;
    },
    redirectToLogin: (_redirectUrl?: string) => {
      window.location.href = '/login';
    },
    resetPassword: async (_params: { email?: string; resetToken?: string; newPassword?: string; [key: string]: any }) => {
      return { success: true };
    },
    resetPasswordRequest: async (_email: string) => {
      return { success: true };
    },
    verifyOtp: async ({ email }: { email: string; otpCode?: string; [key: string]: any }) => {
      return { access_token: 'mock-token', user: { id: 'u-1', email } };
    },
    setToken: (_token: string) => {},
    loginViaEmailPassword: async (email: string, password?: string) => {
      return client.auth.login({ email, password });
    },
    resendOtp: async (_email: string) => {
      return { success: true };
    },
    loginWithProvider: (_provider: string, returnTo?: string) => {
      window.location.href = returnTo || '/';
    },
  },

  entities: {
    Listing: {
      list: async (..._args: any[]): Promise<Listing[]> => {
        const stored = load<Listing[]>(KEY_LISTINGS, CURATED_LISTINGS);
        return stored.length > 0 ? stored : CURATED_LISTINGS;
      },
      get: async (id: string) => {
        const stored = load<Listing[]>(KEY_LISTINGS, CURATED_LISTINGS);
        const match = stored.find((l) => l.id === id) || CURATED_LISTINGS.find((l) => l.id === id);
        if (match) return match;
        throw new Error(`Listing not found: ${id}`);
      },
      filter: async (query: any) => {
        const stored = load<Listing[]>(KEY_LISTINGS, CURATED_LISTINGS);
        return stored.filter((l: any) => {
          for (const [k, v] of Object.entries(query || {})) {
            if (l[k] !== v) return false;
          }
          return true;
        });
      },
      create: async (data: any) => {
        const stored = load<Listing[]>(KEY_LISTINGS, CURATED_LISTINGS);
        const item: Listing = {
          ...data,
          id: data.id || 'stay-' + Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
        };
        save(KEY_LISTINGS, [item, ...stored]);
        return item;
      },
      update: async (id: string, data: any) => {
        const stored = load<Listing[]>(KEY_LISTINGS, CURATED_LISTINGS);
        const updated = stored.map((l) => (l.id === id ? { ...l, ...data } : l));
        save(KEY_LISTINGS, updated);
        return updated.find((l) => l.id === id);
      },
      delete: async (id: string) => {
        const stored = load<Listing[]>(KEY_LISTINGS, CURATED_LISTINGS);
        const updated = stored.filter((l) => l.id !== id);
        save(KEY_LISTINGS, updated);
        return { success: true };
      },
    },

    Place: {
      filter: async (query: { listingId?: string }) => {
        if (query?.listingId) {
          return CURATED_PLACES.filter((p) => p.listingId === query.listingId);
        }
        return CURATED_PLACES;
      },
      list: async () => CURATED_PLACES,
    },

    Review: {
      filter: async (query: { listingId?: string }) => {
        const stored = load(KEY_REVIEWS, CURATED_REVIEWS);
        if (query?.listingId) {
          return stored.filter((r: any) => r.listingId === query.listingId);
        }
        return stored;
      },
      create: async (data: any) => {
        const stored = load(KEY_REVIEWS, CURATED_REVIEWS);
        const item = { ...data, id: 'rev-' + Date.now() };
        save(KEY_REVIEWS, [item, ...stored]);
        return item;
      },
    },

    Booking: {
      list: async () => load(KEY_BOOKINGS, []),
      filter: async (query: any) => {
        const stored = load<any[]>(KEY_BOOKINGS, []);
        return stored.filter((b) => {
          for (const [k, v] of Object.entries(query || {})) {
            if (b[k] !== v) return false;
          }
          return true;
        });
      },
      create: async (data: any) => {
        const stored = load<any[]>(KEY_BOOKINGS, []);
        const item = {
          ...data,
          id: 'bk-' + Math.random().toString(36).substring(2, 9),
          reference: generateRef('HV'),
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
        save(KEY_BOOKINGS, [item, ...stored]);
        return item;
      },
      update: async (id: string, patch: any) => {
        const stored = load<any[]>(KEY_BOOKINGS, []);
        const updated = stored.map((b) => (b.id === id ? { ...b, ...patch } : b));
        save(KEY_BOOKINGS, updated);
        return updated.find((b) => b.id === id);
      },
    },

    Appointment: {
      list: async () => load(KEY_APPTS, []),
      filter: async (query: any) => {
        const stored = load<any[]>(KEY_APPTS, []);
        return stored.filter((a) => {
          for (const [k, v] of Object.entries(query || {})) {
            if (a[k] !== v) return false;
          }
          return true;
        });
      },
      create: async (data: any) => {
        const stored = load<any[]>(KEY_APPTS, []);
        const item = {
          ...data,
          id: 'apt-' + Math.random().toString(36).substring(2, 9),
          reference: generateRef('AP'),
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
        save(KEY_APPTS, [item, ...stored]);
        return item;
      },
      update: async (id: string, patch: any) => {
        const stored = load<any[]>(KEY_APPTS, []);
        const updated = stored.map((a) => (a.id === id ? { ...a, ...patch } : a));
        save(KEY_APPTS, updated);
        return updated.find((a) => a.id === id);
      },
    },

    Conversation: {
      list: async () => load(KEY_CONVS, []),
      filter: async (query: any) => {
        const stored = load<any[]>(KEY_CONVS, []);
        return stored.filter((c) => {
          for (const [k, v] of Object.entries(query || {})) {
            if (c[k] !== v) return false;
          }
          return true;
        });
      },
      get: async (id: string) => {
        const stored = load<any[]>(KEY_CONVS, []);
        return stored.find((c) => c.id === id) || null;
      },
      create: async (data: any) => {
        const stored = load<any[]>(KEY_CONVS, []);
        const item = {
          ...data,
          id: 'conv-' + Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
        };
        save(KEY_CONVS, [item, ...stored]);
        return item;
      },
      update: async (id: string, patch: any) => {
        const stored = load<any[]>(KEY_CONVS, []);
        const updated = stored.map((c) => (c.id === id ? { ...c, ...patch } : c));
        save(KEY_CONVS, updated);
        return updated.find((c) => c.id === id);
      },
    },

    Message: {
      filter: async (query: any) => {
        const stored = load<any[]>(KEY_MSGS, []);
        return stored.filter((m) => {
          for (const [k, v] of Object.entries(query || {})) {
            if (m[k] !== v) return false;
          }
          return true;
        });
      },
      create: async (data: any) => {
        const stored = load<any[]>(KEY_MSGS, []);
        const item = {
          ...data,
          id: 'msg-' + Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
        };
        save(KEY_MSGS, [...stored, item]);
        return item;
      },
    },

    Favorite: {
      list: async () => load(KEY_FAVS, []),
      filter: async (query?: any) => {
        const stored = load<any[]>(KEY_FAVS, []);
        if (!query || Object.keys(query).length === 0) return stored;
        return stored.filter((f) => {
          for (const [k, v] of Object.entries(query)) {
            if (f[k] !== v) return false;
          }
          return true;
        });
      },
      create: async (data: any) => {
        const stored = load<any[]>(KEY_FAVS, []);
        const item = { ...data, id: 'fav-' + Date.now() };
        save(KEY_FAVS, [...stored, item]);
        return item;
      },
      delete: async (id: string) => {
        const stored = load<any[]>(KEY_FAVS, []);
        save(KEY_FAVS, stored.filter((f) => f.id !== id));
        return { success: true };
      },
    },

    Report: {
      create: async (data: any) => {
        const stored = load<any[]>('haven_reports', []);
        const item = { ...data, id: 'rep-' + Date.now() };
        save('haven_reports', [item, ...stored]);
        return item;
      },
    },

    ConciergeRequest: {
      create: async (data: any) => {
        const stored = load<any[]>('haven_concierge_requests', []);
        const item = { ...data, id: 'crq-' + Date.now() };
        save('haven_concierge_requests', [item, ...stored]);
        return item;
      },
    },

    SupportTicket: {
      create: async (data: any) => {
        const stored = load<any[]>('haven_support_tickets', []);
        const item = { ...data, id: 'tkt-' + Date.now() };
        save('haven_support_tickets', [item, ...stored]);
        return item;
      },
    },

    AvailabilitySlot: {
      filter: async (_query?: any) => load<any[]>('haven_availability_slots', []),
      create: async (data: any) => {
        const stored = load<any[]>('haven_availability_slots', []);
        const item = { ...data, id: 'slot-' + Date.now() };
        save('haven_availability_slots', [item, ...stored]);
        return item;
      },
      delete: async (id: string) => {
        const stored = load<any[]>('haven_availability_slots', []);
        save('haven_availability_slots', stored.filter((s) => s.id !== id));
        return { success: true };
      },
    },
  },

  functions: {
    invoke: async (name: string, payload: any): Promise<{ data: any }> => {
      if (name === 'aiTripConcierge') {
        const result = await runAITripConcierge(payload?.prompt || '');
        return { data: { result } };
      }

      if (name === 'aiSmartSearch') {
        const result = await runAISmartSearch(payload?.query || '');
        return { data: { result } };
      }

      if (name === 'aiListingHelper') {
        const result = await runAIListingHelper(payload || {});
        return { data: { result } };
      }

      if (name === 'getAvailability') {
        const listingId = payload?.listingId;
        const bookings = load<any[]>(KEY_BOOKINGS, []).filter((b) => b.listingId === listingId && b.status !== 'cancelled');
        const bookedRanges = bookings.map((b) => ({ checkIn: b.checkIn, checkOut: b.checkOut }));
        return { data: { bookedRanges, bookedSlots: [] } };
      }

      if (name === 'createBooking') {
        const booking = await client.entities.Booking.create(payload);
        return { data: { booking } };
      }

      if (name === 'bookAppointment') {
        const appointment = await client.entities.Appointment.create(payload);
        return { data: { appointment } };
      }

      if (name === 'sendChatMessage') {
        const { conversationId, listingId, text } = payload;
        const user = await client.auth.me();
        let conv = conversationId ? await client.entities.Conversation.get(conversationId) : null;
        let listing = null;

        if (conv) {
          listing = await client.entities.Listing.get(conv.listingId).catch(() => null);
        } else {
          listing = await client.entities.Listing.get(listingId).catch(() => null);
          conv = await client.entities.Conversation.create({
            listingId: listing?.id,
            listingTitle: listing?.title || 'Haven Stay',
            listingImage: (listing?.images || [])[0] || '',
            guestId: user?.id || 'guest',
            guestName: user?.full_name || 'Guest',
            hostId: 'host-' + listing?.id,
            hostName: listing?.hostName || 'Host',
            lastMessage: text,
            lastMessageAt: new Date().toISOString(),
          });
        }

        const userMessage = await client.entities.Message.create({
          conversationId: conv.id,
          senderId: user?.id || 'guest',
          senderName: user?.full_name || 'Guest',
          guestId: conv.guestId,
          hostId: conv.hostId,
          text: text.trim(),
        });

        const reply = await runHostChatReply(listing, `Guest: ${text}`, text);
        const hostMessage = await client.entities.Message.create({
          conversationId: conv.id,
          senderId: conv.hostId,
          senderName: conv.hostName,
          guestId: conv.guestId,
          hostId: conv.hostId,
          text: reply,
        });

        await client.entities.Conversation.update(conv.id, {
          lastMessage: reply,
          lastMessageAt: new Date().toISOString(),
        });

        return { data: { conversationId: conv.id, userMessage, hostMessage } };
      }

      return { data: {} };
    },
  },

  integrations: {
    Core: {
      UploadPrivateFile: async ({ file }: { file: any }) => {
        return { file_uri: typeof file === 'string' ? file : (file && typeof file === 'object' && 'name' in file ? URL.createObjectURL(file) : '') };
      },
    },
  },

  app: {
    getPublicSettings: async () => ({
      id: 'haven',
      public_settings: {},
    }),
  },
};

export default client;
