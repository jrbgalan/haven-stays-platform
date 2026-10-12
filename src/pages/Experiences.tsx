import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Clock, Users, Star, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/button";

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
  image: string;
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
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    tagline: "Glide past limestone sea karst to a secluded emerald lagoon with onboard champagne and private chef.",
    badge: "Guest Favorite"
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
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    tagline: "An intimate 9-course Kaiseki tasting inside a 200-year-old preserved Machiya garden residence.",
    badge: "Exclusive"
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
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    tagline: "Fly above the Matterhorn ridge and land on pristine snowfields for an artisanal Swiss alpine picnic.",
    badge: "Rare Access"
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
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    tagline: "A deep restorative ritual overlooking sacred river gorges guided by master holistic healers.",
    badge: "Wellness Sanctuary"
  },
  {
    id: "exp-6",
    title: "Chianti Hilltop Truffle Foraging & Chianti Classico Reserve",
    category: "Culinary & Vineyards",
    location: "Tuscany",
    country: "Italy",
    duration: "5 Hours",
    groupSize: "Private (Up to 6)",
    price: 750,
    rating: 4.96,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    tagline: "Witness bioluminescent waters and gentle manta rays alongside a resident marine biologist.",
    badge: "Eco-Immersion"
  },
  {
    id: "exp-8",
    title: "Secret Bamboo Forest Meditation & Tea Master Class",
    category: "Wellness & Spa",
    location: "Arashiyama",
    country: "Japan",
    duration: "3 Hours",
    groupSize: "Private (2-4 guests)",
    price: 490,
    rating: 4.94,
    reviewsCount: 47,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    tagline: "Private early-morning access to a hidden Zen temple temple garden with a 15th-generation tea master.",
  }
];

const CATEGORIES = [
  "All",
  "Maritime & Yachting",
  "Culinary & Vineyards",
  "Wilderness & Alpine",
  "Wellness & Spa",
];

export default function Experiences() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [bookedId, setBookedId] = useState<string | null>(null);

  const filtered = selectedCat === "All"
    ? EXPERIENCES
    : EXPERIENCES.filter((e) => e.category === selectedCat);

  return (
    <div className="min-h-screen pt-20">
      {/* HERO */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-28 lg:py-32">
        <div className="absolute inset-0 film-grain" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-4 py-1.5 text-xs font-medium tracking-wide text-champagne-dark dark:text-champagne-light">
                <Sparkles size={13} /> Tailored Journeys
              </span>
              <h1 className="mt-5 font-heading text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Signature Experiences, Orchestrated by Haven
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Private yacht charters, sommelier-led vineyard dinners, and secluded alpine expeditions — curated by our global concierge to deepen every stay.
              </p>
            </div>
          </SectionReveal>

          {/* CATEGORY FILTER TABS */}
          <SectionReveal delay={0.1} className="mt-12">
            <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    selectedCat === cat
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

      {/* EXPERIENCES GRID */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exp, idx) => (
            <SectionReveal key={exp.id} delay={idx * 0.06}>
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxe transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe-lg">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 scrim-card" />
                  {exp.badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background backdrop-blur">
                      {exp.badge}
                    </span>
                  )}
                  <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white/90">
                    {exp.location}, {exp.country}
                  </span>
                </div>

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

                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {exp.tagline}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                    <div>
                      <span className="text-xs text-muted-foreground">Starting from</span>
                      <p className="text-lg font-semibold text-foreground">${exp.price} <span className="text-xs font-normal text-muted-foreground">/ group</span></p>
                    </div>

                    <Button
                      variant={bookedId === exp.id ? "secondary" : "default"}
                      size="sm"
                      onClick={() => setBookedId(bookedId === exp.id ? null : exp.id)}
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
            </SectionReveal>
          ))}
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

