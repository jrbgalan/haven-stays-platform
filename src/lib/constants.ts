export const CATEGORIES = [
  { id: "Beachfront", label: "Beachfront", icon: "Waves" },
  { id: "Cabins", label: "Cabins", icon: "TreePine" },
  { id: "Villas", label: "Villas", icon: "Castle" },
  { id: "City", label: "City", icon: "Building2" },
  { id: "Countryside", label: "Countryside", icon: "Mountain" },
];

export const AMENITIES = [
  "Infinity Pool", "Private Beach", "Hot Tub", "Sauna", "Fireplace", "Ocean View",
  "Mountain View", "Chef's Kitchen", "Wine Cellar", "Home Theater", "Gym", "Spa",
  "Private Chef", "Concierge", "EV Charger", "Heated Pool", "Rooftop Terrace",
  "Garden", "Beach Access", "Ski-in/Ski-out", "Library", "Smart Home", "Air Conditioning", "Wifi",
];

export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

export const COLLECTIONS = [
  {
    id: "escape",
    title: "Coastal Escapes",
    subtitle: "Where the horizon meets luxury",
    category: "Beachfront",
  },
  {
    id: "retreat",
    title: "Mountain Retreats",
    subtitle: "Quietude above the treeline",
    category: "Cabins",
  },
  {
    id: "grand",
    title: "Grand Villas",
    subtitle: "Space, privacy, and grandeur",
    category: "Villas",
  },
];

// Generated luxury imagery pool — keyed by category (lowercased).
const GEN_BASE = "https://media.base44.com/images/public/6abe44d0e2d19aefccab582a/";
const G = (id) => GEN_BASE + id + "_generated_image.png";

export const GEN_IMAGES = {
  beachfront: G("b603360ac"),
  coral: G("a7b6c275b"),
  cabin: G("bc91ecd42"),
  fjord: G("8c1a26ae7"),
  santorini: G("0f7adae82"),
  ibiza: G("4df59f55b"),
  penthouse: G("b3cbb0449"),
  tokyo: G("a106e50e5"),
  tuscany: G("25e14fb75"),
  provence: G("d2fd1f9b1"),
  bali: G("98cca03e8"),
  maldives: G("489dcf875"),
};

export const IMAGE_POOL = {
  beachfront: [G("b603360ac"), G("a7b6c275b"), G("489dcf875")],
  cabins: [G("bc91ecd42"), G("8c1a26ae7")],
  villas: [G("0f7adae82"), G("4df59f55b"), G("98cca03e8")],
  city: [G("b3cbb0449"), G("a106e50e5")],
  countryside: [G("25e14fb75"), G("d2fd1f9b1")],
};

export const HERO_IMAGE = G("b603360ac");