import type { Activity, Experience, Transfer, Flight, HotelFlightBundle, ProductBooking } from "@/types/products";
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

    // Trust & social proof enrichment
    const isVerified = index % 5 !== 3; // ~80% verified
    const hasDiscount = index % 3 === 0;
    const originalPricePerNight = hasDiscount ? Math.round(l.pricePerNight * 1.14) : undefined;
    const freeCancellation = index % 4 !== 3;
    const instantBookable = index % 5 !== 4;
    const bookedThisMonth = 8 + ((index * 5 + 3) % 16);
    const remainingUnits = index % 3 === 0 ? 2 : index % 3 === 1 ? 3 : 5;
    const cleaningFee = Math.round(l.pricePerNight * 0.12);
    const serviceFee = Math.round(l.pricePerNight * 0.08);
    const taxes = Math.round(l.pricePerNight * 0.06);

    return {
      ...l,
      propertyType,
      stayType,
      dayUsePricePerBlock,
      dayUseTimeSlots,
      isVerified,
      originalPricePerNight,
      freeCancellation,
      instantBookable,
      bookedThisMonth,
      remainingUnits,
      cleaningFee,
      serviceFee,
      taxes,
    };
  });
}

// 10 RICH SEEDED EXPERIENCES & ACTIVITIES
export const EXPERIENCES_DATA: Experience[] = [
  {
    id: "exp-1",
    title: "El Nido Hidden Lagoon Catamaran Charter & Chef Tasting",
    category: "Maritime & Yachting",
    location: "Miniloc & Shimizu Islands, El Nido",
    city: "El Nido",
    country: "Philippines",
    duration: "6 Hours",
    groupSize: "Private (Up to 8)",
    languages: ["English", "Tagalog", "French"],
    difficulty: "Easy",
    minAge: 6,
    instantConfirmation: true,
    price: 185,
    pricePerPerson: 185,
    rating: 4.98,
    reviewCount: 142,
    reviewsCount: 142,
    cancellationPolicy: "Free cancellation up to 48 hours before the start time for a full 100% refund. Within 48 hours, reschedule without fee or 50% refund.",
    availableSlots: ["08:30 AM", "10:30 AM", "01:00 PM"],
    hostName: "Captain Mateo & Chef Isabella",
    hostBio: "Licensed master mariner and former executive chef at Amanpulo, Mateo and Isabella have navigated northern Palawan's secret marine caverns and coves for over 14 years.",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    hostResponseTime: "Within 1 hour",
    description: "Glide aboard a custom 44-foot French cruising catamaran through the soaring black limestone sea canyons of Bacuit Bay. Slip quietly through the tidal crevice opening into the secluded emerald waters of Miniloc's inner lagoon before motorized public tour boats arrive. Swim over untouched sea anemone gardens, drift alongside green sea turtles, and conclude on a private crescent cove with a four-course seafood degustation grilled fresh on deck.",
    tagline: "Glide past limestone sea karst to secluded emerald lagoons with onboard champagne and private chef.",
    highlights: [
      "Exclusive twin-hull catamaran charter with oversized forward lounging nets",
      "Private entry to hidden tidal lagoons before public tour boats arrive",
      "Four-course grilled seafood & tropical fruits feast prepared live on deck",
      "High-definition underwater drone photography & prescription snorkel gear included",
      "Artisanal cocktails and chilled French champagne open bar"
    ],
    included: [
      "Private 44-foot catamaran & licensed captain with two dedicated deckhands",
      "Four-course gourmet seafood lunch & premium beverage pairings",
      "Seacraft sea-scooters, paddleboards, and prescription snorkel masks",
      "Hotel pickup and drop-off in air-conditioned executive van",
      "All marine sanctuary permits and environmental entrance fees"
    ],
    notIncluded: [
      "Crew gratuities (discretionary)",
      "Deep scuba tank certification dives (available upon request)"
    ],
    whatToBring: [
      "Swimwear and dry change of luxury linen clothing",
      "Reef-safe biodegradable sunscreen",
      "Polarized sunglasses and sunhat",
      "Waterproof phone pouch or underwater camera"
    ],
    itinerary: [
      { time: "08:30 AM", title: "Private Marina Welcome & Briefing", description: "Board the catamaran at El Nido Yacht Marina. Welcome chilled calamansi-mint elixirs and route overview by Captain Mateo." },
      { time: "09:30 AM", title: "Miniloc Hidden Lagoon Transit", description: "Sail past towering black limestone karst spires. Slip through the narrow crevice opening into the calm turquoise waters of the inner lagoon." },
      { time: "11:30 AM", title: "Shimizu Island Snorkeling & Reef Safari", description: "Drift over pristine coral plateaus teeming with green sea turtles and clownfish schools guided by our onboard marine naturalist." },
      { time: "01:00 PM", title: "Deckside Seafood Degustation", description: "Anchor in a quiet crescent cove. Chef Isabella grills tiger prawns, yellowfin tuna skewers, and organic Palawan mango ceviche." },
      { time: "02:30 PM", title: "Sunset Leisure Sail Back", description: "Hoisting sails for a quiet, gentle downwind cruise back to port accompanied by chilled champagne and acoustic ambient soundtrack." }
    ],
    meetingPoint: "Haven Yacht Club Jetty, Corong-Corong Beach, El Nido, Palawan",
    meetingPointInstructions: "Meet our concierge at the Haven hospitality pavilion located adjacent to the Corong-Corong marina dock. Complimentary private valet parking is available.",
    meetingCoordinates: { lat: 11.1638, lng: 119.3951 },
    faqs: [
      { question: "What happens if there is tropical rain or rough sea?", answer: "Our team monitors Coast Guard marine forecasts every 3 hours. If weather conditions are deemed unsuitable for sailing, we offer an immediate reschedule or 100% full refund." },
      { question: "Can dietary restrictions be accommodated for the lunch?", answer: "Yes, Chef Isabella accommodates vegetarian, vegan, pescatarian, gluten-free, and halal diets with 24 hours advance notice." },
      { question: "Are children and non-swimmers welcome?", answer: "Absolutely. We carry certified US Coast Guard life vests for all ages and sea-scooters that make floating effortless." }
    ],
    reviews: [
      { id: "rev-1", author: "Claire & Marcus Vance", country: "United Kingdom", rating: 5, date: "October 2026", comment: "The highlight of our entire three-week stay in Southeast Asia. Gliding into the hidden lagoon in total silence before anyone else arrived was magical. Isabella's grilled prawns and garlic coconut rice were unbelievable.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-2", author: "Hiroshi Tanaka", country: "Japan", rating: 5, date: "September 2026", comment: "Impeccable service, professional seamanship, and genuine hospitality. The drone photos they sent that evening were National Geographic quality. Truly a five-star luxury charter.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-3", author: "Elena Rostova", country: "Switzerland", rating: 5, date: "August 2026", comment: "Captain Mateo knows every reef and cavern. Snorkeling with three sea turtles was surreal. Could not recommend Haven experiences more highly.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    topic: "sunset cruise",
    badge: "Guest Favorite",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "exp-2",
    title: "Kyoto Heritage Machiya Tea Ceremony & Kaiseki",
    category: "Culinary & Vineyards",
    location: "Gion District, Kyoto",
    city: "Kyoto",
    country: "Japan",
    duration: "4 Hours",
    groupSize: "Private (2-4 guests)",
    languages: ["Japanese", "English"],
    difficulty: "Easy",
    minAge: 12,
    instantConfirmation: true,
    price: 220,
    pricePerPerson: 220,
    rating: 5.0,
    reviewCount: 89,
    reviewsCount: 89,
    cancellationPolicy: "Free cancellation up to 72 hours before start time. Within 72 hours, 50% refund due to fresh market ingredient preparations.",
    availableSlots: ["10:00 AM", "04:30 PM"],
    hostName: "Tea Master Sen Soshitsu & Chef Kenjiro",
    hostBio: "15th-generation Urasenke certified tea master paired with a two-Michelin-star Kaiseki alumnus dedicated to preserving Kyoto's culinary heritage.",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    hostResponseTime: "Within 2 hours",
    description: "Step across ancient stone thresholds into a privately owned, 250-year-old preserved cedar Machiya residence in historic Gion. Begin with a contemplative charcoal ceremony and whisked ceremonial-grade Uji matcha beside a moss-draped Zen courtyard garden. Transition to an eight-course seasonal Kaiseki dinner highlighting cedar-smoked duck, charcoal-seared wild sea bream, and heirloom Kyoto kyo-yasai vegetables paired with rare artisan junmai daiginjo sakes.",
    tagline: "An intimate culinary immersion inside a preserved 250-year-old Machiya residence guided by a master tea artisan.",
    highlights: [
      "Closed-door private access to a registered cultural heritage Machiya",
      "Ceremonial charcoal-lighting and Urasenke tea ritual guided by a master",
      "Eight-course seasonal autumn Kaiseki tasting menu prepared by Chef Kenjiro",
      "Exclusive curated pairings of rare artisanal small-batch Kyoto sakes",
      "Gift of handcrafted Bizen-ware ceremonial tea bowl"
    ],
    included: [
      "Private reservation of the entire historic Machiya and garden",
      "Master tea ceremony lesson and bespoke matcha tasting",
      "Eight-course Kaiseki dinner and sake pairings",
      "Handcrafted artisan ceramic bowl in presentation paulownia box",
      "English cultural translator and culinary docent"
    ],
    notIncluded: [
      "Hotel transfer (concierge can arrange private towncar)",
      "Additional vintage sake bottles from the private cellar"
    ],
    whatToBring: [
      "Clean white socks for stepping on historic tatami mats",
      "Comfortable elegant casual attire (avoid strong perfumes to preserve cedar aromas)",
      "Camera for courtyard garden photography"
    ],
    itinerary: [
      { time: "04:30 PM", title: "Machiya Welcome & Garden Walk", description: "Arrival in Gion. Traditional water purification at the stone tsukubai basin and introduction to historic Edo-era woodcraft." },
      { time: "05:15 PM", title: "Urasenke Chado Ceremony", description: "Sit in the four-and-a-half tatami tearoom. Savor seasonal wagashi confections followed by bowl of freshly whisked ceremonial matcha." },
      { time: "06:15 PM", title: "Eight-Course Kaiseki Degustation", description: "Seated in the private dining pavilion overlooking illuminated stone lanterns. Eight courses of seasonal gastronomy." },
      { time: "08:15 PM", title: "Closing Reflection & Ceramic Gift", description: "Presentation of custom calligraphy scroll and boxed Bizen-yaki tea bowl to commemorate the evening." }
    ],
    meetingPoint: "Sen Heritage Residence, Shinbashi-dori, Gion, Higashiyama, Kyoto",
    meetingPointInstructions: "Our host will greet you at the wooden lattice gate on Shinbashi-dori marked with the Haven copper insignia.",
    meetingCoordinates: { lat: 35.0037, lng: 135.7772 },
    faqs: [
      { question: "Is it required to sit seiza (on knees) on the tatami?", answer: "Not at all. Low ergonomic chairs with back support and tatami floor pillows are readily available." },
      { question: "Are non-alcoholic beverage pairings available?", answer: "Yes, we feature cold-brewed gyokuro green teas, fermented sparkling yuzu elixirs, and roasted hojicha." },
      { question: "Is photography permitted?", answer: "Photography is warmly welcomed in the courtyard garden and dining rooms. We only ask to pause during the silent tea whisking moment." }
    ],
    reviews: [
      { id: "rev-4", author: "Julian & Sophie Mercer", country: "Canada", rating: 5, date: "October 2026", comment: "Unforgettable evening. The tranquility of the courtyard garden illuminated by stone lanterns while listening to the tea master was deeply moving. Kenjiro's duck broth was transcendent.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-5", author: "Dr. Marcus Wei", country: "Singapore", rating: 5, date: "September 2026", comment: "By far the most authentic cultural immersion we have experienced in Japan. No crowds, zero pretension, just extraordinary mastery and warmth.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-6", author: "Beatrice Dupont", country: "France", rating: 5, date: "August 2026", comment: "The attention to detail in every dish and ceramic pairing was museum quality. An absolute must for lovers of gastronomy.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" }
    ],
    topic: "private chef dining",
    badge: "Exclusive",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "exp-3",
    title: "Matterhorn Glacier Alpine Helicopter Flight & Fondue",
    category: "Wilderness & Alpine",
    location: "Theodul Pass, Zermatt",
    city: "Zermatt",
    country: "Switzerland",
    duration: "3.5 Hours",
    groupSize: "Private (Up to 4)",
    languages: ["German", "English", "French"],
    difficulty: "Moderate",
    minAge: 10,
    instantConfirmation: true,
    price: 490,
    pricePerPerson: 490,
    rating: 4.97,
    reviewCount: 64,
    reviewsCount: 64,
    cancellationPolicy: "Free cancellation up to 48 hours before flight. If high alpine winds prevent safe glacier landing, 100% full refund or alternative valley flight.",
    availableSlots: ["09:00 AM", "11:30 AM", "02:00 PM"],
    hostName: "Chief Pilot Stefan & Alpine Guide Chantal",
    hostBio: "Swiss Air Rescue certified mountain aviator Stefan with 18 years alpine flight time alongside certified UIAGM high-altitude guide Chantal.",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    hostResponseTime: "Within 1 hour",
    description: "Soar above the razor-sharp crest of the Matterhorn in a luxury Airbus H130 panoramic helicopter. Experience breathtaking low-level flight over yawning glacier crevasses before touching down smoothly onto untouched powder snow fields at 3,400 meters altitude. Inside a heated geodesic glass pavilion on the glacier, savor an artisanal truffle fondue made from cave-aged Gruyère AOP and Valais Pinot Noir while surrounded by 38 four-thousand-meter alpine peaks.",
    tagline: "Spectacular aerial views of the Matterhorn crest followed by a remote snowfield landing with truffle fondue.",
    highlights: [
      "Low-altitude aerial pass right alongside the iconic Matterhorn North Face",
      "Remote glacier landing at 3,400m inaccessible by any ski lifts",
      "Heated geodesic pavilion dining with 360-degree panorama of 38 alpine peaks",
      "Artisanal summer truffle fondue and Valais premier cru Pinot Noir",
      "High-altitude guided snowshoe walk with UIAGM certified guide"
    ],
    included: [
      "Private chartered Airbus H130 helicopter flight (40 mins total flight time)",
      "Certified alpine guide and safety equipment (crampons, snowshoes, thermal outerwear)",
      "Full gourmet fondue luncheon, charcuterie board, and wine pairings",
      "Champagne summit toast and high-definition photography pack"
    ],
    notIncluded: [
      "Thermal base layers (rental available at Zermatt heliport)",
      "Helicopter ski drops (requires separate backcountry permit)"
    ],
    whatToBring: [
      "Warm winter alpine boots or sturdy hiking footwear",
      "UV Category 4 sunglasses or ski goggles (glacier reflection)",
      "Warm gloves, beanie, and windproof jacket",
      "High SPF sunscreen and lip protection"
    ],
    itinerary: [
      { time: "09:00 AM", title: "Zermatt Heliport Briefing", description: "Meet pilot Stefan at Air Zermatt base. Safety briefing, thermal gear check, and weather radar preview." },
      { time: "09:30 AM", title: "Matterhorn Summit Crest Flight", description: "Liftoff and climb steeply over Zmutt glacier. Bank around the Hörnli ridge and North Face with sweeping vistas." },
      { time: "10:15 AM", title: "Glacier Snowfield Touchdown", description: "Smooth landing at Unterer Theodulgletscher. Guide Chantal leads a gentle 20-minute panoramic snowshoe ridge walk." },
      { time: "10:45 AM", title: "Alpine Dome Truffle Fondue", description: "Enter the heated pavilion. Clinking glasses of Swiss champagne followed by bubbling fondue and local Bündnerfleisch." },
      { time: "12:00 PM", title: "Descent Through Matter Valley", description: "Scenic return flight dipping low over larch forests and historic wooden chalets back to Zermatt heliport." }
    ],
    meetingPoint: "Air Zermatt Heliport, Spissstrasse 107, 3920 Zermatt",
    meetingPointInstructions: "Our private electric shuttle will collect you from your Zermatt chalet or hotel lobby 20 minutes prior to departure.",
    meetingCoordinates: { lat: 46.0294, lng: 7.7548 },
    faqs: [
      { question: "Is this experience safe for people with vertigo?", answer: "The flight is remarkably stable, and the pavilion on the glacier is seated flat on deep snow with solid footing throughout." },
      { question: "What altitude do we reach?", answer: "The landing site sits at 3,380 meters above sea level. Guests who are sensitive to altitude are advised to stay hydrated." },
      { question: "Can we book this during summer?", answer: "Yes, the glacier snowfield remains snow-covered year-round, offering crisp alpine air even in July and August." }
    ],
    reviews: [
      { id: "rev-7", author: "Lord Alistair Sterling", country: "United Kingdom", rating: 5, date: "October 2026", comment: "Standing on an untouched glacier looking directly at the Matterhorn while eating piping hot fondue is something you never forget. Stefan's flying was butter smooth.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-8", author: "Camille Laurent", country: "Monaco", rating: 5, date: "September 2026", comment: "Breathtaking in every sense. The panoramic views from the helicopter were astounding, and the dome setup was delightfully warm and luxurious.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-9", author: "Anders Lindqvist", country: "Sweden", rating: 5, date: "July 2026", comment: "Flawless coordination by Haven. Truly a bucket list memory for my wife's 40th birthday.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    topic: "hiking adventure",
    badge: "Rare Access",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "exp-4",
    title: "Sacred Ayung River Sound Bath & Balinese Holistic Spa",
    category: "Wellness & Spa",
    location: "Sayan Ridge, Ubud",
    city: "Ubud",
    country: "Indonesia",
    duration: "3 Hours",
    groupSize: "Solo or Couple (Private)",
    languages: ["Indonesian", "English"],
    difficulty: "Easy",
    minAge: 14,
    instantConfirmation: true,
    price: 140,
    pricePerPerson: 140,
    rating: 4.95,
    reviewCount: 112,
    reviewsCount: 112,
    cancellationPolicy: "Free cancellation up to 24 hours before your ritual. Within 24 hours, full credit towards any other Haven wellness session.",
    availableSlots: ["09:00 AM", "01:30 PM", "04:30 PM"],
    hostName: "Healer Wayan & Herbalist Ni Kadek",
    hostBio: "Seventh-generation Balinese Usada traditional wellness practitioner trained in vibrational frequencies and Ayurvedic herbal alchemy.",
    hostAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    hostResponseTime: "Within 1 hour",
    description: "Perched high on the mist-draped Sayan Ridge suspended over the roaring Ayung River, this private holistic journey begins with a sacred water flower blessing. Lie comfortably on warmed linen cushions as master Wayan orchestrates resonant sound frequencies using full-moon Tibetan bronze singing bowls and gong chimes. The vibration releases deep cellular tension before Ni Kadek applies a warm herbal poultice massage and guides you into an open-air copper tub brimming with 500 fragrant jungle petals.",
    tagline: "Deep frequency healing with Tibetan singing bowls suspended above a flowing jungle ravine, finished with herbal floral baths.",
    highlights: [
      "Exclusive private sanctuary pavilion suspended directly above the Ayung River ravine",
      "Sacred Balinese water purification blessing with holy spring waters",
      "60-minute full-moon Tibetan bronze bowl sound therapy session",
      "Four-hand warm coconut-lemongrass herbal poultice massage",
      "Handcrafted botanical elixirs, fresh young coconut water, and organic tropical fruit platter"
    ],
    included: [
      "Exclusive use of the riverside wellness pavilion and copper soaking tub",
      "Sound healing master session and two certified holistic massage therapists",
      "Organic botanical oils, herbal compresses, and 500 fresh flower petal bath",
      "Private roundtrip transfer in Ubud area",
      "Bespoke take-home essential oil blend tailored to your astrological element"
    ],
    notIncluded: [
      "Extended acupuncture treatments (can be requested in advance)",
      "Transfers outside the greater Gianyar/Ubud district"
    ],
    whatToBring: [
      "Comfortable loose cotton clothing",
      "Swimsuit if preferred for the private open-air floral bath",
      "Personal journal for post-meditation reflections"
    ],
    itinerary: [
      { time: "09:00 AM", title: "Jungle Pavilion Arrival & Herbal Tea", description: "Arrival down bamboo forest steps. Enjoy a chilled rosella-ginger infusion and consultative wellness discussion." },
      { time: "09:30 AM", title: "Sacred Melukat Blessing", description: "Gentle water purification ritual honoring the river spirit and releasing energetic burdens." },
      { time: "10:00 AM", title: "Tibetan Bronze Sound Healing", description: "Full-body acoustic vibrational immersion tuned to 432 Hz frequency for nervous system restoration." },
      { time: "11:00 AM", title: "Herbal Poultice Massage & Petal Bath", description: "Four-hand massage using steamed galangal-turmeric poultices followed by a soak in the rose-frangipani copper bath." },
      { time: "11:45 AM", title: "Fresh Young Coconut & Integration", description: "Relax on daybeds overlooking the canyon with fresh coconut water and light organic nourishment." }
    ],
    meetingPoint: "Haven Sayan Wellness Sanctuary, Jl. Raya Sayan, Ubud, Bali",
    meetingPointInstructions: "Our estate gate is located 400m south of the Four Seasons Sayan. The valet host will welcome you at the bamboo fountain.",
    meetingCoordinates: { lat: -8.5069, lng: 115.2443 },
    faqs: [
      { question: "Is this suitable for pregnant guests?", answer: "Yes, we modify the massage techniques with supportive side cushions and gentle prenatal-safe essential oils." },
      { question: "Are the floral petals sustainably sourced?", answer: "All flowers are harvested daily from our organic estate gardens and returned to compost after the treatment." },
      { question: "Can couples experience this together?", answer: "Yes, our pavilion features side-by-side treatment couches and an oversized double copper soaking tub." }
    ],
    reviews: [
      { id: "rev-10", author: "Ananya & Dev Patel", country: "India", rating: 5, date: "October 2026", comment: "The sound vibrations combined with the distant rumble of the river below induced the deepest state of relaxation I have ever known. Wayan is a true master.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-11", author: "Sarah Jenkins", country: "Australia", rating: 5, date: "September 2026", comment: "The floral bath looks like a painting and smells like heaven. The herbal poultice massage eased weeks of stiff travel muscles.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-12", author: "Lukas Weber", country: "Germany", rating: 5, date: "August 2026", comment: "Unparalleled setting, total tranquility, and authentic respect for Balinese cultural rituals. Outstanding.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    topic: "spa and wellness",
    badge: "Wellness Sanctuary",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "exp-5",
    title: "Caldera Sunset Sail & Volcanic Wine Tasting",
    category: "Maritime & Yachting",
    location: "Oia Bay to Thirassia, Santorini",
    city: "Santorini",
    country: "Greece",
    duration: "5 Hours",
    groupSize: "Private (Up to 6)",
    languages: ["Greek", "English"],
    difficulty: "Easy",
    minAge: 12,
    instantConfirmation: true,
    price: 210,
    pricePerPerson: 210,
    rating: 4.94,
    reviewCount: 178,
    reviewsCount: 178,
    cancellationPolicy: "Free cancellation up to 48 hours in advance. Full refund if winds exceed maritime safety guidelines.",
    availableSlots: ["02:30 PM", "03:30 PM"],
    hostName: "Captain Andreas & Sommelier Nikos",
    hostBio: "Native Santorinian sea captain Andreas paired with Nikos, a DipWSET certified Aegean sommelier whose family has cultivated volcanic Assyrtiko vines for four generations.",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    hostResponseTime: "Within 1 hour",
    description: "Board an Italian catamaran at picturesque Ammoudi Bay beneath the whitewashed cliffs of Oia. Cruise across the deep blue waters of the sunken caldera, anchor near the mineral-rich geothermal sulfur springs for a warm swim, and glide past the dramatic volcanic island of Thirassia. As the golden hour bathes the Cycladic cliffs in crimson light, Sommelier Nikos pours four rare indigenous Assyrtiko and oak-aged Vinsanto wines alongside fresh grilled sea bream, octopus skewers, and Santorini fava puree.",
    tagline: "Sail beneath volcanic cliffs with a sommelier pouring rare indigenous Assyrtiko wines alongside grilled Mediterranean fare.",
    highlights: [
      "Private sailing across the ancient volcanic caldera of Santorini",
      "Swim in warm geothermal volcanic sulfur springs and Red Beach coves",
      "Guided tasting of 4 indigenous wines: dry Assyrtiko, Athiri, Aidani, and rare Vinsanto",
      "Freshly prepared Mediterranean feast grilled live by onboard chef",
      "Front-row unobstructed sunset view below Oia's cliffs away from the crowds"
    ],
    included: [
      "Private catamaran charter with licensed captain and crew",
      "Sommelier-led wine degustation with educational tasting notes",
      "Full Mediterranean seafood dinner and Cycladic mezze",
      "Snorkeling masks, fins, and clean plush towels",
      "Roundtrip executive van transfer from any Santorini hotel"
    ],
    notIncluded: [
      "Custom premium champagne bottles (can be added on request)",
      "Tips for crew and captain"
    ],
    whatToBring: [
      "Dark-colored swimsuit (volcanic springs have mineral sulfur)",
      "Light jacket or shawl for cool evening breeze after sunset",
      "Sun protection (sunglasses, hat, reef-safe sunscreen)"
    ],
    itinerary: [
      { time: "03:00 PM", title: "Ammoudi Bay Embarkation", description: "Meet at the quiet fishing pier of Ammoudi. Boarding and welcome toast with sparkling Greek wine." },
      { time: "03:45 PM", title: "Volcanic Hot Springs Anchor", description: "Swim in the geothermal waters of Nea Kameni where warm subterranean springs flow into the sea." },
      { time: "05:00 PM", title: "Thirassia Island Coast Sail", description: "Sail past ancient shepherd hamlets on Thirassia with panoramic views of the main island cliffs." },
      { time: "06:15 PM", title: "Sommelier Tasting & Sunset Dinner", description: "Drop anchor. Nikos introduces volcanic terroir wines paired with grilled sea bream and Cycladic mezze." },
      { time: "07:45 PM", title: "Golden Sunset Below Oia", description: "Watch the sun sink into the Aegean sea with a glass of 16-year barrel-aged Vinsanto before docking." }
    ],
    meetingPoint: "Ammoudi Pier, Oia 847 02, Santorini",
    meetingPointInstructions: "Our private Mercedes van drops you directly at the Ammoudi yacht boarding ramp. No climbing steep caldera steps required.",
    meetingCoordinates: { lat: 36.4618, lng: 25.3719 },
    faqs: [
      { question: "Will the hot springs stain my swimwear?", answer: "Because the water contains natural iron and sulfur minerals, we advise wearing darker colored swimsuits." },
      { question: "Is the yacht shaded from the afternoon sun?", answer: "Yes, the yacht features a spacious bimini hardtop covered lounge as well as sunbathing nets." },
      { question: "Are children allowed?", answer: "Yes, we welcome families and provide non-alcoholic Greek fruit cordials and children's menu options." }
    ],
    reviews: [
      { id: "rev-13", author: "Gregory & Donna Hall", country: "United States", rating: 5, date: "October 2026", comment: "Watching the Oia sunset from our private boat with a glass of chilled Assyrtiko was sublime. Far better than elbowing through crowds up in the village.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-14", author: "Mathilde Vane", country: "Belgium", rating: 5, date: "September 2026", comment: "Nikos's knowledge of the volcanic soil and ancient grapevines made this so much more than a boat trip. The food was sensational.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-15", author: "Liam O'Connor", country: "Ireland", rating: 5, date: "August 2026", comment: "Highlight of our honeymoon. Flawless hospitality from Andreas and Nikos. 10 out of 10.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    topic: "wine tasting",
    badge: "Sunset Choice",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "exp-6",
    title: "Chianti Hillside Truffle Hunt & Medieval Castle Feast",
    category: "Culinary & Vineyards",
    location: "Val d'Orcia & Chianti, Florence",
    city: "Florence",
    country: "Italy",
    duration: "5.5 Hours",
    groupSize: "Private (Up to 6)",
    languages: ["Italian", "English"],
    difficulty: "Easy",
    minAge: 8,
    instantConfirmation: true,
    price: 260,
    pricePerPerson: 260,
    rating: 4.99,
    reviewCount: 95,
    reviewsCount: 95,
    cancellationPolicy: "Free cancellation up to 48 hours prior. Within 48 hours, 50% refund due to private estate chef staffing.",
    availableSlots: ["09:30 AM", "02:30 PM"],
    hostName: "Truffle Master Gianni & Chef Francesca",
    hostBio: "Third-generation tartufaio Gianni and his champion Lagotto Romagnolo hunting hounds Luna and Pippo, collaborating with estate chef Francesca inside a 14th-century fortress.",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    hostResponseTime: "Within 2 hours",
    description: "Venture deep into the mist-covered oak and hazelnut woodlands of the Tuscan hills alongside Gianni and his playful, highly trained Lagotto Romagnolo truffle hounds. Witness the thrill when the dogs scent prized black summer or white autumn truffles buried beneath damp soil. After harvesting, journey to a private 14th-century castle cellar. Chef Francesca guides you in rolling fresh tagliolini pasta before shaving your morning finds over golden butter emulsions and uncorking vintage Brunello di Montalcino.",
    tagline: "Follow certified Lagotto Romagnolo truffle dogs through damp oak forests, followed by a handmade pasta workshop in a medieval cellar.",
    highlights: [
      "Live truffle foraging guided by a licensed master tartufaio in private woods",
      "Hands-on demonstration with trained Italian Lagotto Romagnolo truffle hounds",
      "Exclusive access to a 14th-century Chianti castle wine cellar and courtyard",
      "Masterclass in rolling authentic Tuscan egg tagliolini from scratch",
      "Four-course truffle degustation lunch paired with aged Chianti Classico Riserva"
    ],
    included: [
      "Expert-led forest truffle hunt and private land permits",
      "Pasta-making workshop with all organic regional ingredients",
      "Four-course gourmet luncheon with generous fresh truffle shavings",
      "Sommelier flight of 3 Chianti Classico and Brunello wines",
      "Roundtrip chauffeur transfer from central Florence hotels"
    ],
    notIncluded: [
      "Purchase of whole intact reserve truffles to ship home (available on request)",
      "Gratuities for the culinary team"
    ],
    whatToBring: [
      "Sturdy walking shoes or trail sneakers for the forest path",
      "Comfortable layered casual clothing",
      "Appetite for rich handmade pasta and wine!"
    ],
    itinerary: [
      { time: "09:30 AM", title: "Florence Hotel Pickup", description: "Private Mercedes V-Class transfer winding through scenic Chianti olive groves and cypress lanes." },
      { time: "10:30 AM", title: "Forest Foraging with Lagotto Hounds", description: "Hike with Gianni and dogs Luna & Pippo through damp oak woods. Unearth fresh subterranean truffles." },
      { time: "11:45 AM", title: "Castle Cellar Arrival & Aperitivo", description: "Enter the medieval castle gates. Crisp prosecco and truffle-infused pecorino crostini welcome." },
      { time: "12:15 PM", title: "Handmade Tagliolini Workshop", description: "Work with Chef Francesca to knead, roll, and cut thin ribbon pasta using organic Tuscan semolina." },
      { time: "01:00 PM", title: "Four-Course Truffle Degustation", description: "Feast in the vaulted brick dining hall with shaved truffles on carpaccio, tagliolini, and roasted guinea fowl." }
    ],
    meetingPoint: "Castello di Meleto Estate Gate, Gaiole in Chianti, Tuscany",
    meetingPointInstructions: "Your chauffeur will greet you directly at your Florence hotel lobby with your name board. Drive time is approximately 45 minutes.",
    meetingCoordinates: { lat: 43.5012, lng: 11.4338 },
    faqs: [
      { question: "Is the forest walk strenuous?", answer: "No, it is an easy stroll on soft forest soil with frequent stops to watch the dogs dig." },
      { question: "Can gluten-free pasta be prepared?", answer: "Yes, Chef Francesca prepares dedicated handmade gluten-free pasta upon advance notice." },
      { question: "Are children allowed to pet the truffle dogs?", answer: "Luna and Pippo adore guests and children! Petting and playing fetch with them is a highlight of the morning." }
    ],
    reviews: [
      { id: "rev-16", author: "Nicholas & Karen Brody", country: "United States", rating: 5, date: "October 2026", comment: "Watching Luna pinpoint a truffle under two feet of roots and excitedly dig it up was astonishing! The meal afterwards in the castle with endless shaved truffles was pure bliss.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-17", author: "Astrid Lindau", country: "Sweden", rating: 5, date: "September 2026", comment: "Gianni's warmth and Francesca's pasta skills made this feel like visiting Italian family. The wine pairings were perfection.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-18", author: "Arthur Pendelton", country: "United Kingdom", rating: 5, date: "August 2026", comment: "Easily the best excursion we took during our fortnight in Tuscany. Outstanding quality throughout.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    topic: "wine tasting",
    badge: "Culinary Legend",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "exp-7",
    title: "Private Reef Conservation & Manta Ray Night Dive",
    category: "Maritime & Yachting",
    location: "Hanifaru Bay, Baa Atoll",
    city: "Baa Atoll",
    country: "Maldives",
    duration: "4 Hours",
    groupSize: "Private (Up to 4)",
    languages: ["Dhivehi", "English", "French"],
    difficulty: "Moderate",
    minAge: 12,
    instantConfirmation: true,
    price: 380,
    pricePerPerson: 380,
    rating: 5.0,
    reviewCount: 76,
    reviewsCount: 76,
    cancellationPolicy: "Free cancellation up to 48 hours prior. 100% full refund if UNESCO biosphere marine rangers restrict lagoon entry.",
    availableSlots: ["04:30 PM"],
    hostName: "Marine Biologist Dr. Aris & Dive Master Tariq",
    hostBio: "Resident UNESCO Baa Atoll Biosphere researcher Dr. Aris alongside PADI Master Instructor Tariq, specializing in gentle manta ray behavioral interactions.",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    hostResponseTime: "Within 1 hour",
    description: "Venture into the heart of the UNESCO World Biosphere Reserve at Baa Atoll during the lunar plankton bloom. Led by a marine scientist, learn the identification markings and graceful barrel-rolling feeding behavior of the Maldivian reef manta ray population. Snorkel in warm, crystal-clear 29°C waters as giant gentle mantas with three-meter wingspans glide within inches of you, before witnessing glowing bioluminescent phytoplankton light up the sea surface under the starry night sky.",
    tagline: "Witness bioluminescent waters and gentle manta rays alongside a resident marine scientist.",
    highlights: [
      "Access to protected UNESCO Biosphere Reserve marine zones",
      "Private briefing and live hydrophone audio listening to reef acoustics",
      "Encounter feeding reef manta rays in their natural feeding cyclone",
      "Night snorkel in glowing electric-blue bioluminescent phytoplankton waters",
      "Underwater 4K RAW video and professional photo package included"
    ],
    included: [
      "Private twin-engine catamaran with hot freshwater deck showers",
      "Marine biologist guidance and personalized manta adoption certificate",
      "Premium Mares freediving fins, low-volume silicon masks, and rashguards",
      "Underwater dive lights and high-sensitivity underwater camera footage",
      "Canapés, tropical fruit kebabs, and chilled beverages on deck"
    ],
    notIncluded: [
      "Scuba gear (Hanifaru Bay is strictly snorkel-only by UNESCO law to protect mantas)",
      "Alcoholic beverages during the marine expedition"
    ],
    whatToBring: [
      "Swimsuit or rashguard",
      "Dry towel and light jacket for the boat ride back",
      "GoPro or waterproof camera if you wish to record personal angles"
    ],
    itinerary: [
      { time: "04:30 PM", title: "Catamaran Departure & Biology Briefing", description: "Boarding at Baa Atoll marina. Dr. Aris shares digital hydrographic maps and individual manta photo catalogs." },
      { time: "05:15 PM", title: "Hanifaru Bay Manta Encounter", description: "Quietly enter the bay. Snorkel alongside feeding aggregations of reef manta rays gliding in mesmerizing loops." },
      { time: "06:45 PM", title: "Sunset Deckside Canapés", description: "Warm freshwater rinse, dry towels, and hot ginger lemongrass tea as the crimson sunset spreads across the atoll." },
      { time: "07:30 PM", title: "Bioluminescent Night Plunge", description: "Dip into the warm black water. Every stroke sparks brilliant turquoise sparks of glowing bioluminescent dinoflagellates." },
      { time: "08:30 PM", title: "Marina Return & Video Download", description: "Docking back at your resort jetty with your curated photo & video drive handed to you." }
    ],
    meetingPoint: "Baa Atoll Biosphere Jetty, Dharavandhoo Island, Maldives",
    meetingPointInstructions: "Our speed catamaran picks you up directly at your resort's arrival water jetty.",
    meetingCoordinates: { lat: 5.1611, lng: 73.1311 },
    faqs: [
      { question: "Is it safe to snorkel so close to mantas?", answer: "Yes, reef mantas are completely harmless filter-feeders without stingers. Dr. Aris ensures passive, respectful non-intrusive interactions." },
      { question: "What if we don't encounter mantas?", answer: "While wild nature is never 100% predictable, our spotters check Hanifaru daily. We maintain a 94% sighting success rate during the season." },
      { question: "Do I need to be an expert swimmer?", answer: "Comfortable basic snorkeling skills are sufficient. Flotation vests and guide tow-lines are always deployed." }
    ],
    reviews: [
      { id: "rev-19", author: "Dr. Evelyn Ross", country: "United States", rating: 5, date: "October 2026", comment: "Having seven mantas glide right underneath us in crystal water while Dr. Aris explained their gestures was the most magical wildlife encounter of my life.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-20", author: "Jean-Paul & Celine", country: "France", rating: 5, date: "September 2026", comment: "The bioluminescent night swim felt like floating in outer space. The video footage Tariq edited for us was breathtaking.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-21", author: "Kenji Sato", country: "Japan", rating: 5, date: "August 2026", comment: "Extremely professional, scientific, and deeply respectful of the animals. Worth every penny.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    topic: "snorkeling and diving",
    badge: "Eco-Immersion",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "exp-8",
    title: "Sunrise Hot Air Balloon Over Ancient Valleys",
    category: "Wilderness & Alpine",
    location: "Love Valley & Rose Valley, Cappadocia",
    city: "Göreme",
    country: "Turkey",
    duration: "4 Hours",
    groupSize: "Private Basket (Up to 4)",
    languages: ["Turkish", "English"],
    difficulty: "Easy",
    minAge: 8,
    instantConfirmation: true,
    price: 320,
    pricePerPerson: 320,
    rating: 4.99,
    reviewCount: 165,
    reviewsCount: 165,
    cancellationPolicy: "Free cancellation up to 48 hours prior. Full 100% refund if Civil Aviation grounds morning flights due to high wind.",
    availableSlots: ["05:00 AM"],
    hostName: "Chief Pilot Emre & Host Aylin",
    hostBio: "Commercial aviation master pilot Emre with 4,200 flight hours over central Anatolia, accompanied by local art historian Aylin.",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    hostResponseTime: "Within 1 hour",
    description: "Rise in total silence before dawn over the whimsical fairy chimney rock spires and carved cave monasteries of Cappadocia. In your private oversized wicker basket with cushioned rail seating, ascend smoothly to 1,000 meters above sea level just as the sun crests the Anatolian horizon, illuminating the pastel rose and ochre ripples of the valley. Following a gentle landing in a secluded orchard, celebrate with a champagne sabering and lavish Turkish breakfast.",
    tagline: "Float in total silence over sun-drenched canyon spires followed by a champagne sunrise breakfast.",
    highlights: [
      "Exclusive private balloon basket with premium cushioned seating and clear visibility",
      "Extended 75-minute gentle sunrise flight reaching 1,000 meters altitude",
      "Skim inches above ancient rock-cut pigeon houses and fairy chimney tops",
      "Traditional landing champagne sabering ritual and flight certificate",
      "Gourmet Turkish breakfast buffet with artisanal cheeses, wild honeycomb, and pastries"
    ],
    included: [
      "Private hot air balloon charter and certified senior flight pilot",
      "All Turkish Civil Aviation departure taxes and passenger flight insurance",
      "Lavish post-landing outdoor orchard champagne breakfast",
      "Pre-flight fresh espresso, Turkish tea, and morning pastries",
      "Executive SUV roundtrip transfers from all Cappadocia cave hotels"
    ],
    notIncluded: [
      "Souvenir video drones (can be arranged upon check-in)",
      "Gratuities for the ground recovery crew"
    ],
    whatToBring: [
      "Warm layers (morning temperatures are chilly before dawn even in summer)",
      "Flat, comfortable enclosed footwear for field landing",
      "Camera with wide-angle and zoom capability"
    ],
    itinerary: [
      { time: "05:00 AM", title: "Hotel SUV Pickup", description: "Private collection from your cave suite. Scenic transfer to the launch meadow in Love Valley." },
      { time: "05:30 AM", title: "Inflation & Morning Espresso", description: "Watch giant colorful envelopes inflate against the dark starry sky while sipping freshly roasted coffee." },
      { time: "06:00 AM", title: "Dawn Liftoff & Flight", description: "Gentle ascent as dawn breaks. Drift across Rose Valley and Pigeon Valley with 360-degree views." },
      { time: "07:15 AM", title: "Soft Touchdown & Champagne Sabering", description: "Smooth landing in a secluded apricot grove. Chief pilot Emre sabers a bottle of local sparkling vintage." },
      { time: "07:45 AM", title: "Orchard Breakfast & Return", description: "Savor warm börek, goat cheeses, and fig preserves before your private return transfer." }
    ],
    meetingPoint: "Haven Launch Meadow, Love Valley, Göreme, Cappadocia",
    meetingPointInstructions: "Our chauffeur collects you directly from your hotel lobby at 05:00 AM.",
    meetingCoordinates: { lat: 38.6533, lng: 34.8294 },
    faqs: [
      { question: "Is the basket unstable or prone to swaying?", answer: "Hot air balloon flight is remarkably tranquil. Because the balloon moves with the wind, there is no wind resistance or motion sickness." },
      { question: "How does the private basket differ from public tours?", answer: "Public flights pack 20-28 passengers shoulder-to-shoulder. Our private flight is exclusively reserved for you and your travel companions." },
      { question: "What happens if weather cancels the flight?", answer: "Safety is paramount. If grounded by aviation officials, we re-book you for the following morning or issue a 100% immediate refund." }
    ],
    reviews: [
      { id: "rev-22", author: "Miriam & Daniel Alcott", country: "United Kingdom", rating: 5, date: "October 2026", comment: "漂浮在几千个童话般的仙人烟囱之上看日出，那是我们一生中最震撼的时刻。Emre船长落地精准平稳，香槟早餐也美味极了。", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-23", author: "Siddharth Rao", country: "United Arab Emirates", rating: 5, date: "September 2026", comment: "The private basket made all the difference. Quiet, intimate, and zero crowds. Essential luxury experience.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-24", author: "Hannah Schmidt", country: "Austria", rating: 5, date: "July 2026", comment: "Pure magic. Watching 100 balloons speckle the pastel sunrise from our private sanctuary in the sky was dreamlike.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    topic: "hot air balloon",
    badge: "Rare Access",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "exp-9",
    title: "Artisanal Market Walk & Michelin Knife Masterclass",
    category: "Culinary & Vineyards",
    location: "Tsukiji Outer Market & Ginza, Tokyo",
    city: "Tokyo",
    country: "Japan",
    duration: "4.5 Hours",
    groupSize: "Small Group (Max 6)",
    languages: ["Japanese", "English"],
    difficulty: "Easy",
    minAge: 14,
    instantConfirmation: true,
    price: 340,
    pricePerPerson: 340,
    rating: 4.97,
    reviewCount: 45,
    reviewsCount: 45,
    cancellationPolicy: "Free cancellation up to 72 hours before start time. Within 72 hours, 50% refund due to wholesale market cuts procured.",
    availableSlots: ["08:30 AM", "01:00 PM"],
    hostName: "Chef Toshiro & Bladesmith Yamashita",
    hostBio: "30-year Ginza sushi shokunin Chef Toshiro paired with 4th-generation Sakai blacksmith Yamashita, master of Damascus steel forging and waterstone whetstone polishing.",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    hostResponseTime: "Within 2 hours",
    description: "Begin with an insider's early morning exploration through the bustling alleys of Tsukiji's outer fish market. Learn how three-star Michelin chefs select wild bluefin tuna, sea urchin, and real mountain wasabi from generational vendors. Move to a private atelier in Ginza where master Yamashita instructs you on 1,000-grit to 8,000-grit Japanese whetstone knife sharpening. Conclude with an intimate omakase lunch and take home your own personalized forged santoku knife hand-engraved with your name.",
    tagline: "Hand-select heirloom seafood at morning markets, sharpen your own forged Japanese blade, and savor an omakase lunch.",
    highlights: [
      "Curated guided walk through Tsukiji's legendary wholesale seafood vendors",
      "Tasting of 3 grades of wild bluefin tuna and Hokkaido sea urchin (uni)",
      "Hands-on Japanese whetstone sharpening workshop with Sakai knife master",
      "Hand-engraved forged Sakai stainless Damascus Santoku knife included to keep",
      "Seven-piece artisanal Edomae nigiri lunch prepared in front of you"
    ],
    included: [
      "Guided market gastronomy tour with all food and beverage tastings",
      "Personal forged Japanese kitchen knife with custom kanji hand-engraving",
      "Two-hour knife sharpening masterclass with Yamashita bladesmith",
      "Private Edomae sushi counter omakase luncheon with sake pairing",
      "Bespoke English culinary and blade terminology handbook"
    ],
    notIncluded: [
      "Additional knife purchases from the forge display",
      "Hotel transportation"
    ],
    whatToBring: [
      "Comfortable flat walking shoes suitable for market floors",
      "Camera for market and atelier photography"
    ],
    itinerary: [
      { time: "08:30 AM", title: "Tsukiji Outer Market Rendezvous", description: "Meet Chef Toshiro at Namiyoke Inari Shrine. Warm roasted barley tea and market history orientation." },
      { time: "09:00 AM", title: "Wholesale Tasting Trail", description: "Sample tamagoyaki omelets, grilled scallops, fresh sea urchin, and learn the anatomy of tuna loin cuts." },
      { time: "10:30 AM", title: "Ginza Forge Atelier Transfer", description: "Short towncar ride to the private blade atelier. Introduction to Japanese carbon and Damascus steel metallurgy." },
      { time: "11:00 AM", title: "Whetstone Sharpening Masterclass", description: "Hands-on waterstone honing. Master Yamashita guides your grip, pressure, and angle to razor sharpness." },
      { time: "12:15 PM", title: "Countertop Omakase Lunch", description: "Sit at the 8-seat hinoki cypress counter. Watch Chef Toshiro slice fresh market tuna with your newly honed blade." }
    ],
    meetingPoint: "Namiyoke Inari Shrine Gate, Tsukiji, Chuo-ku, Tokyo",
    meetingPointInstructions: "Chef Toshiro will meet you beside the giant red shrine lantern on the corner of Tsukiji 6-chome.",
    meetingCoordinates: { lat: 35.6645, lng: 139.7712 },
    faqs: [
      { question: "Can I bring my new knife back home on an airplane?", answer: "Yes, our team packages your forged knife in a TSA-approved security-sealed wooden presentation box suitable for checked luggage." },
      { question: "Are left-handed knives available?", answer: "Yes, please inform us when reserving and Master Yamashita will prepare a dedicated left-handed blade." },
      { question: "Can vegetarian guests participate?", answer: "While the knife workshop is identical, market food tastings and sushi lunch can be customized with seasonal vegetables, tofu, and mushrooms." }
    ],
    reviews: [
      { id: "rev-25", author: "Patrick Sterling", country: "United States", rating: 5, date: "October 2026", comment: "The santoku knife I brought home cuts through ripe tomatoes like air. Toshiro and Yamashita were patient, masterful, and wonderful teachers.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-26", author: "Matteo Conti", country: "Italy", rating: 5, date: "September 2026", comment: "As a professional chef myself, I was blown away by the depth of metallurgical knowledge Yamashita shared. Outstanding omakase as well.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-27", author: "Vivienne Westwood", country: "Australia", rating: 5, date: "August 2026", comment: "Engraving my initials into the steel blade was such a personal touch. One of my favorite days in Tokyo.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" }
    ],
    topic: "cooking class",
    badge: "Master Artisan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "exp-10",
    title: "Siargao Pacific Reef Break Coaching & Secret Rock Pool Expedition",
    category: "Wilderness & Alpine",
    location: "General Luna to Magpupungko, Siargao",
    city: "Siargao",
    country: "Philippines",
    duration: "4.5 Hours",
    groupSize: "Private (2-4 guests)",
    languages: ["English", "Tagalog"],
    difficulty: "Moderate",
    minAge: 10,
    instantConfirmation: true,
    price: 110,
    pricePerPerson: 110,
    rating: 4.92,
    reviewCount: 130,
    reviewsCount: 130,
    cancellationPolicy: "Free cancellation up to 24 hours prior. Reschedule or full refund if ocean swell exceeds safe coaching levels.",
    availableSlots: ["07:00 AM", "01:00 PM"],
    hostName: "Coach Kiko & Island Guide Maya",
    hostBio: "Former Philippine national surf champion Kiko paired with local conservationist Maya, born and raised among Siargao's pristine coral barrier reefs.",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    hostResponseTime: "Within 1 hour",
    description: "Experience the untamed tropical Pacific energy of Siargao. Travel in an open-air vintage 4x4 safari jeep along coastal palm corridors to the natural emerald rock pools of Magpupungko, exposed only during dead low tide. Swim inside calm turquoise pools bordered by crashing ocean surf. Afterwards, head to a secluded sandbar outer reef where Coach Kiko provides personalized longboard coaching tailored to your wave experience, followed by wood-fired grilled fish and fresh young coconuts.",
    tagline: "Low-tide exploration of secluded emerald tidal pools, private longboard coaching, and fresh coconut harvest under virgin palms.",
    highlights: [
      "Low-tide private access to crystal clear Magpupungko natural rock pools",
      "Open-roof 4x4 safari jeep transit through thousand-palm coastal roads",
      "Two hours of private 1-on-1 surf coaching at secluded gentle reef breaks",
      "High-speed 4K drone footage capturing your wave rides from above",
      "Traditional beachfront boodle fight feast of grilled mahi-mahi and tropical fruit"
    ],
    included: [
      "Custom epoxy longboard or shortboard matched to your height and level",
      "Certified surf coach and lifeguard accompaniment throughout",
      "Open-air 4x4 jeep safari transportation with driver",
      "Full organic beach luncheon and fresh drinking coconuts",
      "Drone video reel and all entrance permits"
    ],
    notIncluded: [
      "Sun rashguards (available for purchase at surf base)",
      "Gratuities for the surf coaching team"
    ],
    whatToBring: [
      "Swimwear and water booties or reef shoes for walking on limestone rocks",
      "Reef-safe sunscreen and zinc oxide face stick",
      "Dry towel and change of clothes",
      "Reusable water bottle"
    ],
    itinerary: [
      { time: "07:00 AM", title: "General Luna 4x4 Jeep Departure", description: "Meet at Haven surf outpost. Cruise through scenic palm forests with morning tropical breeze." },
      { time: "08:00 AM", title: "Magpupungko Tidal Pools Exploration", description: "Arrive at low tide. Swim inside emerald natural rock pools while massive Pacific waves crash beyond the reef wall." },
      { time: "09:30 AM", title: "Outer Reef Longboard Coaching", description: "Paddle out to a secluded, gentle breaking wave. Coach Kiko assists with wave timing, popup mechanics, and trim." },
      { time: "11:30 AM", title: "Beachfront Coconut Harvest & Boodle Lunch", description: "Fresh coconuts sliced from the tree and banana-leaf feast of grilled mahi-mahi and mango sticky rice." }
    ],
    meetingPoint: "Haven Surf Pavilion, Tourism Road, General Luna, Siargao",
    meetingPointInstructions: "Our 4x4 jeep will be parked in front of the Haven bamboo surf lounge on Tourism Road.",
    meetingCoordinates: { lat: 9.7828, lng: 126.1558 },
    faqs: [
      { question: "Is this suitable for complete beginners?", answer: "Yes! Coach Kiko selects gentle rolling waves over deep sandy bottoms for beginners to guarantee safety and fun." },
      { question: "Are reef shoes necessary?", answer: "Yes, we strongly recommend wearing reef booties around Magpupungko's volcanic limestone formations." },
      { question: "What if it rains?", answer: "Surfing in tropical rain is one of the island's best sensations! If thunder or dangerous swell occurs, we reschedule." }
    ],
    reviews: [
      { id: "rev-28", author: "Tobias & Mia Becker", country: "Germany", rating: 5, date: "October 2026", comment: "Kiko got both of us standing up on our very first waves! The drone video he sent us was incredible. The rock pools were paradise.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-29", author: "Jessica Tan", country: "Singapore", rating: 5, date: "September 2026", comment: "Riding in the open-top 4x4 through the palm forests was pure joy. The fresh grilled fish lunch was the best meal on the island.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { id: "rev-30", author: "Cody Matthews", country: "Australia", rating: 5, date: "July 2026", comment: "Top-tier coaching, pristine waves, and authentic local vibes. Do not skip this when visiting Siargao.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    topic: "hiking adventure",
    badge: "Island Classic",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

// Helper to look up an experience by any ID alias (e.g. "exp-1", "act-1")
export function getMockExperience(id: string): Experience | undefined {
  if (!id) return undefined;
  const target = id.toLowerCase().trim();
  return EXPERIENCES_DATA.find(
    (e) =>
      e.id.toLowerCase() === target ||
      e.id.replace("exp-", "act-").toLowerCase() === target ||
      e.id.replace("act-", "exp-").toLowerCase() === target
  );
}

// Backward-compatible MOCK_ACTIVITIES mapped from rich EXPERIENCES_DATA
export const MOCK_ACTIVITIES: Activity[] = EXPERIENCES_DATA;

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

