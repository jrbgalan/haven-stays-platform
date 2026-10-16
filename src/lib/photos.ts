import photosData from "@/data/photos.json";

export interface UnsplashPhoto {
  id: string;
  topic: string;
  alt_text: string;
  color: string;
  width: number;
  height: number;
  urls: {
    raw: string;
  };
  photographer_name: string;
  photographer_profile_url: string;
  photo_page_url: string;
  download_location?: string;
}

interface PhotosPayload {
  updated_at?: string;
  topics?: Record<string, UnsplashPhoto[]>;
  photos?: UnsplashPhoto[];
}

const data = (photosData as unknown as PhotosPayload) || { topics: {}, photos: [] };
const topicsMap: Record<string, UnsplashPhoto[]> = data.topics || {};
const allPhotos: UnsplashPhoto[] = data.photos || [];

// Topic matching dictionary to allow flexible lookups (e.g. "villas", "Santorini", "cabins")
const TOPIC_ALIASES: Record<string, string> = {
  // Stays
  beachfront: "beachfront villa",
  "beachfront villa": "beachfront villa",
  beach: "beachfront villa",
  cabin: "mountain cabin",
  cabins: "mountain cabin",
  "mountain cabin": "mountain cabin",
  villa: "luxury villa pool",
  villas: "luxury villa pool",
  "luxury villa pool": "luxury villa pool",
  penthouse: "city penthouse",
  city: "city penthouse",
  "city penthouse": "city penthouse",
  estate: "countryside estate",
  countryside: "countryside estate",
  "countryside estate": "countryside estate",
  hotel: "boutique hotel room",
  "boutique hotel room": "boutique hotel room",
  "infinity pool": "infinity pool",
  pool: "infinity pool",
  glamping: "glamping",
  ryokan: "ryokan",
  treehouse: "treehouse",

  // Experiences
  "private chef dining": "private chef dining",
  chef: "private chef dining",
  dining: "private chef dining",
  "snorkeling and diving": "snorkeling and diving",
  snorkeling: "snorkeling and diving",
  diving: "snorkeling and diving",
  "hot air balloon": "hot air balloon",
  balloon: "hot air balloon",
  "spa and wellness": "spa and wellness",
  spa: "spa and wellness",
  wellness: "spa and wellness",
  "cultural tour": "cultural tour",
  culture: "cultural tour",
  "food market": "food market",
  market: "food market",
  "sunset cruise": "sunset cruise",
  cruise: "sunset cruise",
  sailing: "sunset cruise",
  "hiking adventure": "hiking adventure",
  hiking: "hiking adventure",
  adventure: "hiking adventure",
  "cooking class": "cooking class",
  cooking: "cooking class",
  "wine tasting": "wine tasting",
  wine: "wine tasting",

  // Destinations
  cebu: "Cebu",
  palawan: "Palawan",
  siargao: "Siargao",
  bohol: "Bohol",
  baguio: "Baguio",
  tokyo: "Tokyo",
  bali: "Bali",
  santorini: "Santorini",
  kyoto: "Kyoto",
  amalfi: "Amalfi Coast",
  "amalfi coast": "Amalfi Coast",
  zermatt: "Zermatt",
  tulum: "Tulum",
  "riviera maya": "Tulum",
  maldives: "Maldives",
  tuscany: "Tuscany",
  phuket: "Phuket",
  aspen: "Aspen",
};

/**
 * Normalizes any topic or search string to the exact topic key in photos.json
 */
export function normalizeTopic(topic: string): string {
  if (!topic) return "beachfront villa";
  const lower = topic.toLowerCase().trim();
  if (topicsMap[topic]) return topic;
  if (TOPIC_ALIASES[lower] && topicsMap[TOPIC_ALIASES[lower]]) {
    return TOPIC_ALIASES[lower];
  }
  // Partial substring match
  for (const key of Object.keys(topicsMap)) {
    if (key.toLowerCase().includes(lower) || lower.includes(key.toLowerCase())) {
      return key;
    }
  }
  return topic;
}

/**
 * Retrieve curated photos for a topic, optionally limited to `count`.
 * Falls back to general curated photos if the specific topic is not found.
 */
export function getPhotos(topic: string, count?: number): UnsplashPhoto[] {
  const resolved = normalizeTopic(topic);
  const found = topicsMap[resolved] || [];
  let result: UnsplashPhoto[] = found;

  if (result.length === 0) {
    // Graceful fallback to any available photos so layout never breaks
    result = allPhotos.slice(0, count || 8);
  }

  if (count && count > 0) {
    return result.slice(0, count);
  }
  return result;
}

/**
 * Retrieve a single photo for a topic at a given index
 */
export function getPhotoByTopic(topic: string, index = 0): UnsplashPhoto | null {
  const photos = getPhotos(topic);
  if (photos.length === 0) return null;
  return photos[index % photos.length] || null;
}

/**
 * Helper to construct optimized Unsplash image URLs with query parameters.
 * Appends width, quality, auto=format and fit=crop parameters while preserving raw URL.
 */
export function imageUrl(
  photoOrUrl: UnsplashPhoto | { urls: { raw: string } } | string | null | undefined,
  width = 1200,
  quality = 80
): string {
  if (!photoOrUrl) {
    return `https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=${width}&q=${quality}`;
  }

  const rawUrl = typeof photoOrUrl === "string" ? photoOrUrl : photoOrUrl.urls?.raw;
  if (!rawUrl) {
    return `https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=${width}&q=${quality}`;
  }

  // Base URL without existing search params
  const base = rawUrl.split("?")[0];
  return `${base}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

/**
 * Retrieve all unique photographers across photos.json for the Photo Credits page
 */
export interface PhotographerCredit {
  name: string;
  profile_url: string;
  photoCount: number;
  samplePhotos: UnsplashPhoto[];
}

export function getAllPhotographers(): PhotographerCredit[] {
  const map = new Map<string, { profile_url: string; photos: UnsplashPhoto[] }>();

  for (const photo of allPhotos) {
    const name = photo.photographer_name || "Unsplash Contributor";
    if (!map.has(name)) {
      map.set(name, {
        profile_url: photo.photographer_profile_url,
        photos: [],
      });
    }
    map.get(name)!.photos.push(photo);
  }

  return Array.from(map.entries())
    .map(([name, data]) => ({
      name,
      profile_url: data.profile_url,
      photoCount: data.photos.length,
      samplePhotos: data.photos.slice(0, 4),
    }))
    .sort((a, b) => b.photoCount - a.photoCount);
}

/**
 * Retrieve all photos in photos.json
 */
export function getAllPhotos(): UnsplashPhoto[] {
  return allPhotos;
}

/**
 * Generate photo credit attribution string and URLs
 */
export function getPhotoCredit(photo: UnsplashPhoto | null | undefined) {
  if (!photo) {
    return {
      text: "Photo on Unsplash",
      photographerName: "Unsplash",
      photographerUrl: "https://unsplash.com/?utm_source=haven&utm_medium=referral",
      photoUrl: "https://unsplash.com/?utm_source=haven&utm_medium=referral",
    };
  }

  return {
    text: `Photo by ${photo.photographer_name} on Unsplash`,
    photographerName: photo.photographer_name,
    photographerUrl: photo.photographer_profile_url,
    photoUrl: photo.photo_page_url,
  };
}

