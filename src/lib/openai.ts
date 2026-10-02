import OpenAI from 'openai';
import { CURATED_LISTINGS } from '@/lib/curatedStays';
import type { AIListingHelperInput, AIListingHelperResult, AISmartSearchResult, AITripConciergeResult } from '@/types/ai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY || (typeof process !== 'undefined' ? process.env?.OPENAI_API_KEY : '');

export const openai = apiKey
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

function getCompactListingsContext() {
  return CURATED_LISTINGS.map((l) => ({
    id: l.id,
    title: l.title,
    city: l.city,
    country: l.country,
    location: l.location,
    category: l.category,
    amenities: l.amenities || [],
    pricePerNight: l.pricePerNight,
    bedrooms: l.bedrooms,
    maxGuests: l.maxGuests,
    description: (l.description || '').slice(0, 280),
  }));
}

/**
 * AI Trip Concierge using OpenAI (or smart fallback if key is pending)
 */
export async function runAITripConcierge(prompt: string): Promise<AITripConciergeResult> {
  const listings = getCompactListingsContext();

  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              "You are Haven's AI trip concierge for curated luxury stays. A guest describes a trip they desire. " +
              'Using ONLY the real listings provided below (never invent IDs or stays), suggest the top matching stays and a tailored, evocative 3-5 day itinerary. ' +
              'Return JSON strictly with: "intro" (string: warm 1-2 sentence luxury greeting), "listingIds" (array of strings from provided IDs, best first, max 6), ' +
              'and "itinerary" (array of objects: { day: number, title: string, description: string }).\n\n' +
              `Available listings:\n${JSON.stringify(listings)}`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content) as AITripConciergeResult;
      }
    } catch (err: any) {
      console.warn('[OpenAI] Failed to execute API call, using smart concierge fallback:', err.message);
    }
  }

  // Smart fallback when OpenAI key is not configured or offline
  const lower = prompt.toLowerCase();
  let matched = CURATED_LISTINGS.filter((l) => {
    return (
      lower.includes(l.category.toLowerCase()) ||
      lower.includes(l.city.toLowerCase()) ||
      lower.includes(l.country.toLowerCase()) ||
      (l.amenities || []).some((a) => lower.includes(a.toLowerCase()))
    );
  });
  if (matched.length === 0) {
    matched = CURATED_LISTINGS.filter((l) => l.featured).slice(0, 3);
  }

  return {
    intro: `I've tailored a bespoke itinerary and handpicked ${matched.length} extraordinary sanctuaries matching your vision.`,
    listingIds: matched.slice(0, 4).map((l) => l.id),
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Welcome Sunset',
        description: 'Private transfer to your haven, followed by chilled vintage champagne and ocean sunset vistas.',
      },
      {
        day: 2,
        title: 'Immersive Local Discovery',
        description: 'Guided morning exploration of secret coves and historical trails, concluded with private chef dining.',
      },
      {
        day: 3,
        title: 'Wellness & Starlit Dinner',
        description: 'A dedicated afternoon spa retreat followed by an open-air candlelight dinner under the stars.',
      },
    ],
  };
}

/**
 * AI Smart Search using OpenAI
 */
export async function runAISmartSearch(query: string): Promise<AISmartSearchResult> {
  const listings = getCompactListingsContext();

  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a search intelligence assistant for luxury stays platform Haven. ' +
              'Given a natural-language search query, match the best listing IDs from the available listings and extract structured filter parameters. ' +
              'Only pick IDs from the provided listings. ' +
              'Return JSON strictly with: "listingIds" (array of string IDs, best first), "category" (string or null), "maxPrice" (number or null), "minBedrooms" (number or null), "amenities" (array of strings).\n\n' +
              `Available listings:\n${JSON.stringify(listings)}`,
          },
          {
            role: 'user',
            content: query,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content) as AISmartSearchResult;
      }
    } catch (err: any) {
      console.warn('[OpenAI] Failed to execute search call, using smart search fallback:', err.message);
    }
  }

  // Smart heuristic search
  const q = query.toLowerCase();
  const matched = CURATED_LISTINGS.filter((l) => {
    return (
      l.title.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      (l.description || '').toLowerCase().includes(q) ||
      (l.amenities || []).some((a) => a.toLowerCase().includes(q))
    );
  });

  return {
    listingIds: (matched.length > 0 ? matched : CURATED_LISTINGS).map((l) => l.id),
    category: ['beachfront', 'cabins', 'villas', 'city', 'countryside'].find((c) => q.includes(c)) || null,
  };
}

/**
 * AI Listing Helper using OpenAI
 */
export async function runAIListingHelper(input: AIListingHelperInput): Promise<AIListingHelperResult> {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are an award-winning luxury real estate copywriter for Haven. ' +
              'Craft an enticing, elegant listing title, a 2-paragraph evocative description, and suggest a fair nightly price range in USD. ' +
              'Return JSON strictly with: "title" (string), "description" (string), "suggestedPriceMin" (number), "suggestedPriceMax" (number).',
          },
          {
            role: 'user',
            content: `Category: ${input.category || 'Luxury Villa'}\nLocation: ${input.location || 'Coastal Retreat'}\nAmenities: ${(input.amenities || []).join(', ')}\nPhoto notes: ${input.photoNotes || 'Sweeping panoramic views, private pool, modern architecture.'}`,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content) as AIListingHelperResult;
      }
    } catch (err: any) {
      console.warn('[OpenAI] Failed to execute listing helper call, using fallback:', err.message);
    }
  }

  // Fallback copywriting
  const loc = input.location || 'Private Sanctuary';
  const cat = input.category || 'Villa';
  return {
    title: `The Grand ${cat} at ${loc}`,
    description: `Immerse yourself in extraordinary luxury at this bespoke ${cat.toLowerCase()} in ${loc}. Crafted with immaculate architectural precision, this residence features open-concept living, sunset panoramic views, and premium amenities curated for the discerning traveler.\n\nEnjoy pure tranquility, private indoor-outdoor lounges, and world-class service throughout your unforgettable stay.`,
    suggestedPriceMin: 850,
    suggestedPriceMax: 1600,
  };
}

/**
 * Host Auto-Reply using OpenAI
 */
export async function runHostChatReply(listing: any, history: string, guestMessage: string): Promise<string> {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              `You are ${listing?.hostName || 'the host'} of "${listing?.title || 'Haven Stay'}", a luxury ${listing?.category || 'estate'} in ${listing?.city || 'the area'}. ` +
              'Reply warmly and concisely (max two short sentences) to the guest.',
          },
          {
            role: 'user',
            content: `Conversation history:\n${history}\n\nGuest's message: ${guestMessage}`,
          },
        ],
      });
      return response.choices[0]?.message?.content?.trim() || 'Thank you for reaching out! I would be delighted to host you.';
    } catch {}
  }
  return `Thank you for reaching out about ${listing?.title || 'our stay'}! We would be delighted to welcome you.`;
}
