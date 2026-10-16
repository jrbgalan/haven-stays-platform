import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Clock,
  Users,
  Star,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Camera,
} from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/button";
import PhotoCredit from "@/components/ui/PhotoCredit";
import { getPhotos, imageUrl, type UnsplashPhoto } from "@/lib/photos";
import { useSeo } from "@/lib/seo";

interface Experience {
  id: string;
  title: string;
  category: string;
  location: string;
  country: string;
  duration: string;
  groupSize: string;
  price: number;
  rating: number;
  reviewsCount: number;
  topic: string;
  tagline: string;
  badge?: string;
}

const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    title: "Sunset Catamaran & Hidden Lagoon Charter",
    category: "Maritime & Yachting",
    location: "El Nido, Palawan",
    country: "Philippines",
    duration: "6 Hours",
    groupSize: "Private (Up to 8)",
    price: 950,
    rating: 4.98,
    reviewsCount: 42,
    topic: "sunset cruise",
    tagline: "Glide past limestone sea karst to a secluded emerald lagoon with onboard champagne and private chef.",
    badge: "Guest Favorite",
  },
  {
    id: "exp-2",
    title: "Private Omakase & Tea Ceremony at Dawn",
    category: "Culinary & Vineyards",
    location: "Kyoto",
    country: "Japan",
    duration: "4 Hours",
    groupSize: "Private (2-4 guests)",
    price: 680,
    rating: 5.0,
    reviewsCount: 31,
    topic: "private chef dining",
    tagline: "An intimate 9-course Kaiseki tasting inside a 200-year-old preserved Machiya garden residence.",
    badge: "Exclusive",
  },
  {
    id: "exp-3",
    title: "Helicopter Alpine Glacier Landing & Fondue",
    category: "Wilderness & Alpine",
    location: "Zermatt",
    country: "Switzerland",
    duration: "3.5 Hours",
    groupSize: "Private (Up to 4)",
    price: 1400,
    rating: 4.97,
    reviewsCount: 29,
    topic: "hiking adventure",
    tagline: "Fly above the Matterhorn ridge and land on pristine snowfields for an artisanal Swiss alpine picnic.",
    badge: "Rare Access",
  },
  {
    id: "exp-4",
    title: "Caldera Sunset Wine Tasting & Aegean Sail",
    category: "Maritime & Yachting",
    location: "Oia, Santorini",
    country: "Greece",
    duration: "5 Hours",
    groupSize: "Private (Up to 6)",
    price: 820,
    rating: 4.95,
    reviewsCount: 56,
    topic: "wine tasting",
    tagline: "Sail past volcanic springs and savor volcanic Assyrtiko wines paired with grilled Aegean catch.",
  },
  {
    id: "exp-5",
    title: "Traditional Balinese Sound Healing & Ayurvedic Bath",
    category: "Wellness & Spa",
    location: "Ubud, Bali",
    country: "Indonesia",
    duration: "3 Hours",
    groupSize: "Solo or Couple",
    price: 340,
    rating: 4.99,
    reviewsCount: 68,
    topic: "spa and wellness",
    tagline: "A deep restorative ritual overlooking sacred river gorges guided by master holistic healers.",
    badge: "Wellness Sanctuary",
  },
  {
    id: "exp-6",
    title: "Chianti Hilltop Truffle Foraging & Reserve Cellar",
    category: "Culinary & Vineyards",
    location: "Tuscany",
    country: "Italy",
    duration: "5 Hours",
    groupSize: "Private (Up to 6)",
    price: 750,
    rating: 4.96,
    reviewsCount: 38,
    topic: "wine tasting",
    tagline: "Forage black summer truffles with Lagotto dogs followed by a 4-course estate cellar feast.",
  },
  {
    id: "exp-7",
    title: "Private Reef Conservation & Manta Ray Night Dive",
    category: "Maritime & Yachting",
    location: "Baa Atoll",
    country: "Maldives",
    duration: "4 Hours",
    groupSize: "Private (Up to 4)",
    price: 1100,
    rating: 5.0,
    reviewsCount: 22,
    topic: "snorkeling and diving",
    tagline: "Witness bioluminescent waters and gentle manta rays alongside a resident marine biologist.",
    badge: "Eco-Immersion",
  },
  {
    id: "exp-8",
    title: "Sunrise Hot Air Balloon Over Ancient Valleys",
    category: "Wilderness & Alpine",
    location: "Cappadocia & Alpine Ridges",
    country: "Bespoke Escapes",
    duration: "4 Hours",
    groupSize: "Private (Up to 4)",
    price: 890,
    rating: 4.99,
    reviewsCount: 53,
    topic: "hot air balloon",
    tagline: "Float in total silence over sun-drenched canyon spires followed by a champagne sunrise breakfast.",
    badge: "Rare Access",
  },
  {
    id: "exp-9",
    title: "Artisanal Market Walk & Michelin Cooking Masterclass",
    category: "Culinary & Vineyards",
    location: "Tokyo",
    country: "Japan",
    duration: "4.5 Hours",
    groupSize: "Small Group (Max 6)",
    price: 520,
    rating: 4.97,
    reviewsCount: 45,
    topic: "cooking class",
    tagline: "Hand-select heirloom vegetables at morning markets and cook alongside an acclaimed master chef.",
  },
];

const CATEGORIES = ["All", "Maritime & Yachting", "Culinary & Vineyards", "Wilderness & Alpine", "Wellness & Spa"];

// Experience Card with 3+ Photo Carousel & Hover Photo Credits
function ExperienceCardItem({
  exp,
  bookedId,
  onInquire,
}: {
  exp: Experience;
  bookedId: string | null;
  onInquire: (id: string) => void;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);

  // Retrieve 3+ photos for this experience topic
  const photos = useMemo(() => {
    return getPhotos(exp.topic, 4);
  }, [exp.topic]);

  const currentPhoto = photos[photoIndex % photos.length] || null;
  const currentImgUrl = currentPhoto ? imageUrl(currentPhoto, 800, 80) : "";

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxe transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe-lg">
      {/* 3+ Photo Carousel */}
      <div
        className="relative aspect-[16/10] overflow-hidden bg-muted"
        style={{ backgroundColor: currentPhoto?.color || "#18181b" }}
      >
        {currentImgUrl && (
          <img
            src={currentImgUrl}
            alt={currentPhoto?.alt_text || exp.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

        {/* Carousel Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-black/90"
              aria-label="Previous photo"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-black/90"
              aria-label="Next photo"
            >
              <ChevronRight size={14} />
            </button>
          </>
        )}

        {/* Carousel Dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-2.5 right-3 z-20 flex items-center gap-1">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPhotoIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  photoIndex === i ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Badge & Location */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          {exp.badge && (
            <span className="rounded-full bg-foreground/85 px-3 py-1 text-xs font-medium text-background backdrop-blur-md">
              {exp.badge}
            </span>
          )}
        </div>

        {/* Photo Attribution on Hover */}
        {currentPhoto && (
          <div className="absolute top-4 right-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <PhotoCredit photo={currentPhoto} variant="badge" />
          </div>
        )}

        <span className="absolute bottom-3 left-4 z-10 text-xs font-semibold uppercase tracking-wider text-white/95">
          {exp.location}, {exp.country}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {exp.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} /> {exp.groupSize}
          </span>
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Star size={12} className="fill-accent text-accent" /> {exp.rating} ({exp.reviewsCount})
          </span>
        </div>

        <h3 className="mt-3 font-heading text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-champagne-dark dark:group-hover:text-champagne-light">
          {exp.title}
        </h3>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">{exp.tagline}</p>

        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <div>
            <span className="text-xs text-muted-foreground">Starting from</span>
            <p className="text-lg font-semibold text-foreground">
              ${exp.price} <span className="text-xs font-normal text-muted-foreground">/ group</span>
            </p>
          </div>

          <Button
            variant={bookedId === exp.id ? "secondary" : "default"}
            size="sm"
            onClick={() => onInquire(exp.id)}
            className="group/btn"
          >
            {bookedId === exp.id ? (
              <>
                <CheckCircle2 size={14} className="text-emerald-500" /> Inquired
              </>
            ) : (
              <>
                Inquire <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Experiences() {
  useSeo(
    "Curated Bespoke Experiences & Expeditions",
    "Private yacht charters, alpine helicopter picnics, dawn tea rituals, and immersive wildlife encounters."
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [bookedId, setBookedId] = useState<string | null>(null);

  const filtered =
    activeCategory === "All" ? EXPERIENCES : EXPERIENCES.filter((e) => e.category === activeCategory);

  // Moments Masonry Gallery Photos
  const momentsPhotos = useMemo(() => {
    const list: Array<{ photo: UnsplashPhoto; title: string; location: string; span: string }> = [];
    const pool = [
      { topic: "sunset cruise", title: "Sunset Lagoon Sailing", location: "El Nido, Palawan", span: "col-span-12 sm:col-span-6 lg:col-span-4" },
      { topic: "hot air balloon", title: "Alpine Dawn Flight", location: "Swiss Alps", span: "col-span-12 sm:col-span-6 lg:col-span-8" },
      { topic: "snorkeling and diving", title: "Coral Garden Immersion", location: "Baa Atoll, Maldives", span: "col-span-12 sm:col-span-6 lg:col-span-4" },
      { topic: "spa and wellness", title: "Ayurvedic Water Ritual", location: "Ubud, Bali", span: "col-span-12 sm:col-span-6 lg:col-span-4" },
      { topic: "wine tasting", title: "Volcanic Cellar Tasting", location: "Oia, Santorini", span: "col-span-12 sm:col-span-6 lg:col-span-4" },
      { topic: "hiking adventure", title: "Glacier Ridge Trek", location: "Zermatt, Switzerland", span: "col-span-12 sm:col-span-6 lg:col-span-6" },
      { topic: "cultural tour", title: "Dawn Temple Walk", location: "Kyoto, Japan", span: "col-span-12 sm:col-span-6 lg:col-span-6" },
    ];

    pool.forEach((item) => {
      const p = getPhotos(item.topic, 1)[0];
      if (p) {
        list.push({ photo: p, title: item.title, location: item.location, span: item.span });
      }
    });

    return list;
  }, []);

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="relative overflow-hidden bg-background pt-10 pb-8 sm:pt-14 sm:pb-12 lg:pb-14">
        <div className="container-haven">
          <SectionReveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-champagne-dark dark:text-champagne-light">
                <Sparkles size={13} /> Bespoke Itineraries
              </span>
              <h1 className="mt-3 font-heading text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Experiences Far Beyond the Ordinary
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Handcrafted adventures led by local visionaries, private captains, and master artisans.
                Exclusively accessible to Haven guests.
              </p>
            </div>
          </SectionReveal>

          {/* CATEGORY CHIPS */}
          <SectionReveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-foreground text-background shadow-luxe"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/80 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* EXPERIENCES GRID (Each card has 3+ photos) */}
      <section className="container-haven section-padding-b">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exp, idx) => (
            <SectionReveal key={exp.id} delay={idx * 0.05}>
              <ExperienceCardItem
                exp={exp}
                bookedId={bookedId}
                onInquire={(id) => setBookedId(bookedId === id ? null : id)}
              />
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* MASONRY "MOMENTS" GALLERY SECTION */}
      <section className="border-t border-border/70 bg-card/40 py-16 sm:py-24">
        <div className="container-haven">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-champagne-dark dark:text-champagne-light">
                <Camera size={13} /> Captured In Stillness
              </span>
              <h2 className="mt-3 font-heading text-3xl font-medium sm:text-4xl text-foreground">
                Moments of Wonder Across the Globe
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                Authentic encounters photographed by Haven travelers and Unsplash creators.
              </p>
            </div>
          </SectionReveal>

          {/* Masonry Grid */}
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            {momentsPhotos.map((item, idx) => (
              <SectionReveal key={idx} delay={idx * 0.05} className={item.span}>
                <div
                  className="group relative h-72 sm:h-80 overflow-hidden rounded-3xl border border-border/80 shadow-luxe"
                  style={{ backgroundColor: item.photo.color }}
                >
                  <img
                    src={imageUrl(item.photo, 1200, 80)}
                    alt={item.photo.alt_text}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Top Photo Credit on Hover */}
                  <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PhotoCredit photo={item.photo} variant="badge" />
                  </div>

                  {/* Bottom Caption */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-champagne-light">
                      {item.location}
                    </span>
                    <h3 className="font-heading text-lg font-medium leading-snug drop-shadow-sm">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONCIERGE BANNER */}
      <section className="border-t border-border/70 bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <SectionReveal>
            <ShieldCheck size={36} className="mx-auto text-champagne" strokeWidth={1.5} />
            <h2 className="mt-4 font-heading text-3xl font-medium sm:text-4xl text-foreground">
              Desire a fully custom itinerary?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground leading-relaxed">
              Our bespoke concierge team arranges private aircraft, security, rare vintage acquisitions, and sequestered island takeovers.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/concierge">Consult Haven Concierge</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/explore">Explore Private Stays</Link>
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
