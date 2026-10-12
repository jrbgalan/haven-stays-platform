import type { Activity, Transfer, Flight, HotelFlightBundle, ProductBooking } from "@/types/products";
import type { Listing } from "@/types/listing";
import { CURATED_LISTINGS } from "./curatedStays";

// Enrich curated listings with propertyType, stayType, and dayUsePricePerBlock
export function enrichListings(listings: Listing[]): Listing[] {
  return listings.map((l, index) => {
    // Determine propertyType: hotel, home, apartment
    let propertyType: 'hotel' | 'home' | 'apartment' = 'home';
    if (l.category === 'City' || index % 3 === 0) {
      propertyType = 'hotel';
    } else if (l.category === 'Beachfront' || l.category === 'Cabins' || index % 3 === 1) {
      propertyType = 'home';
    } else {
      propertyType = 'apartment';
    }

    // Determine stayType: overnight, day_use, or both
    const allowsDayUse = index % 2 === 0 || l.category === 'Beachfront' || l.category === 'City';
    const stayType: 'overnight' | 'day_use' | 'both' = allowsDayUse ? 'both' : 'overnight';
    const dayUsePricePerBlock = Math.round(l.pricePerNight * 0.45);
    const dayUseTimeSlots = ["09:00 - 17:00", "12:00 - 20:00", "14:00 - 22:00"];

    return {
      ...l,
      propertyType,
      stayType,
      dayUsePricePerBlock,
      dayUseTimeSlots,
    };
  });
}

// 8+ MOCK ACTIVITIES
export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    title: "El Nido Hidden Lagoon Catamaran Charter & Chef Tasting",
    category: "Tours",
    location: "Miniloc & Shimizu Islands",
    city: "El Nido",
    country: "Philippines",
    duration: "6 Hours",
    pricePerPerson: 185,
    rating: 4.98,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80",
    description: "Private twin-hull catamaran expedition gliding through secret karst sea canyons with fresh seafood lunch prepared by an onboard private chef.",
    highlights: ["Private catamaran access", "Crystal lagoon snorkeling", "Five-course grilled lunch", "Champagne open bar"],
    included: ["Catamaran crew", "Chef tasting", "Snorkel gear", "Hotel pickup"]
  },
  {
    id: "act-2",
    title: "Kyoto Heritage Machiya Tea Ceremony & Kaiseki",
    category: "Food",
    location: "Gion District",
    city: "Kyoto",
    country: "Japan",
    duration: "4 Hours",
    pricePerPerson: 220,
    rating: 5.0,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    description: "An intimate culinary immersion inside a preserved 250-year-old Machiya residence guided by a licensed Urasenke tea master and Michelin-trained chef.",
    highlights: ["Private Zen garden tea ritual", "8-course seasonal Kaiseki", "Rare matcha pairings", "Historic architecture walk"],
    included: ["Master tea lesson", "8-course dinner", "Artisanal ceramics gift"]
  },
  {
    id: "act-3",
    title: "Matterhorn Glacier Alpine Helicopter Flight & Picnic",
    category: "Adventure",
    location: "Theodul Pass",
    city: "Zermatt",
    country: "Switzerland",
    duration: "3.5 Hours",
    pricePerPerson: 490,
    rating: 4.96,
    reviewCount: 64,
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80",
    description: "Spectacular aerial views of the Matterhorn crest followed by a remote snowfield landing with fondue and Swiss Pinot Noir.",
    highlights: ["Summit ridge flight", "Glacier landing", "Artisanal cheese fondue", "High-altitude photography"],
    included: ["Helicopter charter", "Alpine guide", "Thermal gear", "Champagne picnic"]
  },
  {
    id: "act-4",
    title: "Sacred Ayung River Sound Bath & Balinese Holistic Spa",
    category: "Wellness",
    location: "Sayan Ridge",
    city: "Ubud",
    country: "Indonesia",
    duration: "3 Hours",
    pricePerPerson: 140,
    rating: 4.95,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
    description: "Deep frequency healing with Tibetan singing bowls suspended above a flowing jungle ravine, finished with herbal floral baths.",
    highlights: ["Sound frequency therapy", "Custom floral bath", "Ayurvedic massage", "Organic botanical elixirs"],
    included: ["Master practitioner", "Private pavilion", "Herbal refreshments"]
  },
  {
    id: "act-5",
    title: "Caldera Sunset Sail & Volcanic Wine Tasting",
    category: "Tours",
    location: "Oia Bay to Thirassia",
    city: "Santorini",
    country: "Greece",
    duration: "5 Hours",
    pricePerPerson: 210,
    rating: 4.94,
    reviewCount: 178,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80",
    description: "Sail beneath towering red volcanic cliffs with a sommelier pouring rare indigenous Assyrtiko wines alongside grilled Mediterranean fare.",
    highlights: ["Volcanic hot springs swim", "Sunset at Oia from the sea", "Four Assyrtiko tastings", "Greek mezze dinner"],
    included: ["Luxury catamaran", "Sommelier commentary", "Towels and snorkel gear"]
  },
  {
    id: "act-6",
    title: "Chianti Hillside Truffle Hunt & Medieval Castle Feast",
    category: "Food",
    location: "Val d'Orcia",
    city: "Florence",
    country: "Italy",
    duration: "5.5 Hours",
    pricePerPerson: 260,
    rating: 4.99,
    reviewCount: 95,
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80",
    description: "Follow certified Lagotto Romagnolo truffle dogs through damp oak forests, followed by a handmade pasta workshop in a 14th-century cellar.",
    highlights: ["Live truffle foraging", "Fresh pasta workshop", "Castle wine vault tour", "Truffle degustation dinner"],
    included: ["Truffle master guide", "Wine pairings", "Private transport"]
  },
  {
    id: "act-7",
    title: "Siargao Pacific Reef Break & Secret Rock Pool Expedition",
    category: "Adventure",
    location: "General Luna to Magpupungko",
    city: "Siargao",
    country: "Philippines",
    duration: "4.5 Hours",
    pricePerPerson: 110,
    rating: 4.92,
    reviewCount: 130,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    description: "Low-tide exploration of secluded emerald tidal pools, private longboard coaching, and fresh coconut harvest under virgin palms.",
    highlights: ["Low-tide tidal pools", "Private surf coaching", "Drone footage included", "Beachfront boodle fight lunch"],
    included: ["Surfboard and instructor", "Lunch and coconuts", "Island 4x4 transfer"]
  },
  {
    id: "act-8",
    title: "Ancient Machiya Calligraphy & Zen Garden Meditation",
    category: "Culture",
    location: "Daitoku-ji Temple",
    city: "Kyoto",
    country: "Japan",
    duration: "3 Hours",
    pricePerPerson: 165,
    rating: 4.97,
    reviewCount: 76,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
    description: "Exclusive after-hours access to an undisturbed Zen sub-temple garden with meditation guidance from a resident Buddhist abbot.",
    highlights: ["Closed-door temple access", "Traditional washi calligraphy", "Guided silent meditation", "Historical scrolls view"],
    included: ["Personal ink & scroll kit", "Abbot consultation", "Matcha & wagashi"]
  }
];

// 8+ MOCK AIRPORT TRANSFERS
export const MOCK_TRANSFERS: Transfer[] = [
  {
    id: "trans-1",
    airportName: "Manila Ninoy Aquino Int'l",
    airportCode: "MNL",
    city: "Manila",
    country: "Philippines",
    vehicleType: "Sedan",
    vehicleModel: "Mercedes-Benz S-Class Long Wheelbase",
    capacityPassengers: 3,
    capacityLuggage: 3,
    basePrice: 120,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    features: ["Chauffeur in suit", "Flight tracking", "Bottled San Pellegrino", "60 mins free wait time"]
  },
  {
    id: "trans-2",
    airportName: "Manila Ninoy Aquino Int'l",
    airportCode: "MNL",
    city: "Manila",
    country: "Philippines",
    vehicleType: "Van",
    vehicleModel: "Toyota Alphard Executive Lounge",
    capacityPassengers: 5,
    capacityLuggage: 5,
    basePrice: 160,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    features: ["Captain ottoman seats", "Onboard Wi-Fi", "Privacy curtains", "Luggage porter"]
  },
  {
    id: "trans-3",
    airportName: "Mactan-Cebu International",
    airportCode: "CEB",
    city: "Cebu",
    country: "Philippines",
    vehicleType: "SUV",
    vehicleModel: "Range Rover Velar Luxury",
    capacityPassengers: 4,
    capacityLuggage: 4,
    basePrice: 140,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    features: ["Panoramic roof", "Leather interior", "Child safety seats", "Meet & Greet at arrivals"]
  },
  {
    id: "trans-4",
    airportName: "Tokyo Haneda Airport",
    airportCode: "HND",
    city: "Tokyo",
    country: "Japan",
    vehicleType: "Luxury Limousine",
    vehicleModel: "Toyota Century / Lexus LS500h",
    capacityPassengers: 3,
    capacityLuggage: 3,
    basePrice: 220,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    features: ["Bilingual driver", "White-glove service", "Heated wool seats", "Toll fees included"]
  },
  {
    id: "trans-5",
    airportName: "Ngurah Rai International",
    airportCode: "DPS",
    city: "Denpasar / Bali",
    country: "Indonesia",
    vehicleType: "Van",
    vehicleModel: "Toyota Vellfire VIP Edition",
    capacityPassengers: 6,
    capacityLuggage: 6,
    basePrice: 95,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    features: ["Cold scented towels", "Chilled young coconuts", "Custom drop-off to Ubud/Uluwatu"]
  },
  {
    id: "trans-6",
    airportName: "Santorini Thira Airport",
    airportCode: "JTR",
    city: "Santorini",
    country: "Greece",
    vehicleType: "Van",
    vehicleModel: "Mercedes-Benz V-Class Avantgarde",
    capacityPassengers: 7,
    capacityLuggage: 7,
    basePrice: 130,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    features: ["Luggage assistance down caldera steps", "Air conditioning", "Direct Oia/Imerovigli access"]
  },
  {
    id: "trans-7",
    airportName: "Zurich Kloten Airport",
    airportCode: "ZRH",
    city: "Zurich",
    country: "Switzerland",
    vehicleType: "SUV",
    vehicleModel: "Audi Q8 Quattro All-Weather",
    capacityPassengers: 4,
    capacityLuggage: 4,
    basePrice: 280,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    features: ["Ski equipment rack", "Mountain passes navigation", "Bottled Swiss mineral water"]
  },
  {
    id: "trans-8",
    airportName: "Florence Peretola Airport",
    airportCode: "FLR",
    city: "Florence",
    country: "Italy",
    vehicleType: "Sedan",
    vehicleModel: "BMW 7 Series Sedan",
    capacityPassengers: 3,
    capacityLuggage: 3,
    basePrice: 150,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    features: ["NCC licensed professional", "Direct hotel or Chianti estate drop-off", "English speaking"]
  }
];

// 8+ MOCK FLIGHTS
export const MOCK_FLIGHTS: Flight[] = [
  {
    id: "fl-1",
    airline: "Singapore Airlines",
    airlineLogo: "SQ",
    flightNumber: "SQ 918",
    originCity: "Singapore",
    originCode: "SIN",
    destinationCity: "Manila",
    destinationCode: "MNL",
    departureTime: "09:35",
    arrivalTime: "13:15",
    duration: "3h 40m",
    stops: 0,
    cabinClass: "Business",
    price: 680,
    aircraft: "Airbus A350-900"
  },
  {
    id: "fl-2",
    airline: "All Nippon Airways (ANA)",
    airlineLogo: "NH",
    flightNumber: "NH 869",
    originCity: "Tokyo",
    originCode: "HND",
    destinationCity: "Manila",
    destinationCode: "MNL",
    departureTime: "10:15",
    arrivalTime: "14:05",
    duration: "4h 50m",
    stops: 0,
    cabinClass: "Business",
    price: 890,
    aircraft: "Boeing 787-9 Dreamliner"
  },
  {
    id: "fl-3",
    airline: "Philippine Airlines",
    airlineLogo: "PR",
    flightNumber: "PR 2141",
    originCity: "Manila",
    originCode: "MNL",
    destinationCity: "El Nido (Lio)",
    destinationCode: "ENI",
    departureTime: "07:30",
    arrivalTime: "08:50",
    duration: "1h 20m",
    stops: 0,
    cabinClass: "Economy",
    price: 180,
    aircraft: "ATR 72-600"
  },
  {
    id: "fl-4",
    airline: "Swiss International Air Lines",
    airlineLogo: "LX",
    flightNumber: "LX 18",
    originCity: "Zurich",
    originCode: "ZRH",
    destinationCity: "Tokyo",
    destinationCode: "NRT",
    departureTime: "13:00",
    arrivalTime: "09:10 (+1)",
    duration: "12h 10m",
    stops: 0,
    cabinClass: "Business",
    price: 2450,
    aircraft: "Boeing 777-300ER"
  },
  {
    id: "fl-5",
    airline: "Cathay Pacific",
    airlineLogo: "CX",
    flightNumber: "CX 785",
    originCity: "Hong Kong",
    originCode: "HKG",
    destinationCity: "Denpasar",
    destinationCode: "DPS",
    departureTime: "10:00",
    arrivalTime: "14:55",
    duration: "4h 55m",
    stops: 0,
    cabinClass: "Premium Economy",
    price: 540,
    aircraft: "Airbus A330-300"
  },
  {
    id: "fl-6",
    airline: "Emirates",
    airlineLogo: "EK",
    flightNumber: "EK 332",
    originCity: "Dubai",
    originCode: "DXB",
    destinationCity: "Manila",
    destinationCode: "MNL",
    departureTime: "03:50",
    arrivalTime: "16:00",
    duration: "8h 10m",
    stops: 0,
    cabinClass: "First",
    price: 3600,
    aircraft: "Airbus A380-800"
  },
  {
    id: "fl-7",
    airline: "Aegean Airlines",
    airlineLogo: "A3",
    flightNumber: "A3 358",
    originCity: "Athens",
    originCode: "ATH",
    destinationCity: "Santorini",
    destinationCode: "JTR",
    departureTime: "11:20",
    arrivalTime: "12:10",
    duration: "50m",
    stops: 0,
    cabinClass: "Economy",
    price: 140,
    aircraft: "Airbus A320neo"
  },
  {
    id: "fl-8",
    airline: "Air France",
    airlineLogo: "AF",
    flightNumber: "AF 1240",
    originCity: "Paris",
    originCode: "CDG",
    destinationCity: "Florence",
    destinationCode: "FLR",
    departureTime: "09:40",
    arrivalTime: "11:25",
    duration: "1h 45m",
    stops: 0,
    cabinClass: "Business",
    price: 420,
    aircraft: "Airbus A220-300"
  }
];

// 8+ MOCK HOTEL + FLIGHT BUNDLES
export const MOCK_BUNDLES: HotelFlightBundle[] = [
  {
    id: "pkg-1",
    listing: CURATED_LISTINGS[0], // Maldives Overwater
    flight: MOCK_FLIGHTS[0],
    originalPrice: 4800,
    bundlePrice: 3740,
    savingsPercent: 22,
    nights: 4,
    badge: "Exclusive Haven Savings"
  },
  {
    id: "pkg-2",
    listing: CURATED_LISTINGS[1], // Santorini
    flight: MOCK_FLIGHTS[6],
    originalPrice: 3800,
    bundlePrice: 2850,
    savingsPercent: 25,
    nights: 3,
    badge: "Aegean Escape Package"
  },
  {
    id: "pkg-3",
    listing: CURATED_LISTINGS[2], // Tuscan Estate
    flight: MOCK_FLIGHTS[7],
    originalPrice: 2600,
    bundlePrice: 1950,
    savingsPercent: 25,
    nights: 4,
    badge: "Chianti Autumn Bundle"
  },
  {
    id: "pkg-4",
    listing: CURATED_LISTINGS[3] || CURATED_LISTINGS[0], // Tulum / Kyoto
    flight: MOCK_FLIGHTS[1],
    originalPrice: 4200,
    bundlePrice: 3150,
    savingsPercent: 25,
    nights: 5,
    badge: "Popular with Couples"
  },
  {
    id: "pkg-5",
    listing: CURATED_LISTINGS[4] || CURATED_LISTINGS[1], // Swiss / Bali
    flight: MOCK_FLIGHTS[3],
    originalPrice: 5600,
    bundlePrice: 4200,
    savingsPercent: 25,
    nights: 4,
    badge: "Matterhorn Winter Special"
  },
  {
    id: "pkg-6",
    listing: CURATED_LISTINGS[5] || CURATED_LISTINGS[2],
    flight: MOCK_FLIGHTS[4],
    originalPrice: 3100,
    bundlePrice: 2320,
    savingsPercent: 25,
    nights: 5,
    badge: "Tropical Serenity Package"
  },
  {
    id: "pkg-7",
    listing: CURATED_LISTINGS[6] || CURATED_LISTINGS[0],
    flight: MOCK_FLIGHTS[2],
    originalPrice: 2200,
    bundlePrice: 1650,
    savingsPercent: 25,
    nights: 3,
    badge: "Palawan Island Sanctuary"
  },
  {
    id: "pkg-8",
    listing: CURATED_LISTINGS[7] || CURATED_LISTINGS[1],
    flight: MOCK_FLIGHTS[5],
    originalPrice: 6200,
    bundlePrice: 4650,
    savingsPercent: 25,
    nights: 4,
    badge: "First Class Luxury Bundle"
  }
];

// INITIAL PRODUCT BOOKINGS
export const INITIAL_PRODUCT_BOOKINGS: ProductBooking[] = [
  {
    id: "pbk-demo-1",
    userId: "user-demo-1",
    productType: "transfers",
    itemId: "trans-1",
    itemTitle: "Mercedes-Benz S-Class Long Wheelbase",
    itemSubtitle: "Manila Ninoy Aquino Int'l (MNL) → BGC Grand Hyatt",
    itemImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80",
    dateOrTime: "Nov 12, 2026 · 14:30",
    passengersOrGuests: 2,
    totalPrice: 120,
    status: "confirmed",
    referenceCode: "TR-872914",
    createdAt: new Date().toISOString()
  },
  {
    id: "pbk-demo-2",
    userId: "user-demo-1",
    productType: "activities",
    itemId: "act-1",
    itemTitle: "El Nido Hidden Lagoon Catamaran Charter",
    itemSubtitle: "Miniloc & Shimizu Islands",
    itemImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
    dateOrTime: "Nov 14, 2026 · 09:00 - 15:00",
    passengersOrGuests: 2,
    totalPrice: 370,
    status: "confirmed",
    referenceCode: "AC-491023",
    createdAt: new Date().toISOString()
  },
  {
    id: "pbk-demo-3",
    userId: "user-demo-1",
    productType: "flights",
    itemId: "fl-1",
    itemTitle: "Singapore Airlines SQ 918 (Business)",
    itemSubtitle: "SIN (Singapore) → MNL (Manila)",
    itemImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80",
    dateOrTime: "Nov 12, 2026 · 09:35 - 13:15",
    passengersOrGuests: 2,
    totalPrice: 1360,
    status: "confirmed",
    referenceCode: "FL-518290",
    createdAt: new Date().toISOString()
  }
];

