import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";

interface DestinationCardData {
  id: string;
  name: string;
  tagline: string;
  count: string;
  image: string;
  region: string;
}

const DESTINATIONS: DestinationCardData[] = [
  {
    id: "cebu",
    name: "Cebu",
    tagline: "Coral atolls, limestone lagoons, and seaside seclusion",
    count: "14 private villas",
    region: "Central Visayas",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "palawan",
    name: "Palawan",
    tagline: "The world's pristine frontier of crystalline waters & emerald peaks",
    count: "19 sanctuaries",
    region: "MIMAROPA",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "siargao",
    name: "Siargao",
    tagline: "Barefoot luxury, whispering coconut groves, and Pacific breaks",
    count: "11 cliffside estates",
    region: "Caraga",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "bohol",
    name: "Bohol",
    tagline: "Verdant rolling hills and private riverside sanctuaries",
    count: "8 heritage retreats",
    region: "Central Visayas",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "baguio",
    name: "Baguio",
    tagline: "Pine-scented mountain air and crackling fireside pavilions",
    count: "9 pine retreats",
    region: "Cordillera",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "tokyo",
    name: "Tokyo",
    tagline: "Minimalist modern ryokans and luminous skyline sky-suites",
    count: "22 urban havens",
    region: "Kanto",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "bali",
    name: "Bali",
    tagline: "Terraced rice amphitheaters and tranquil bamboo sanctuaries",
    count: "35 eco-villas",
    region: "Lesser Sunda",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "santorini",
    name: "Santorini",
    tagline: "Whitewashed caldera architecture suspended between sea and sky",
    count: "18 caldera estates",
    region: "Cyclades",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function PopularDestinations() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionReveal>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-medium tracking-wide text-champagne-dark dark:text-champagne-light">
                <Sparkles size={12} /> Coveted Escapes
              </span>
              <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Popular Destinations
              </h2>
              <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
                Explore our most requested regions — hand-curated stays surrounded by extraordinary natural beauty and cultural stillness.
              </p>
            </div>

            <Link
              to="/destinations"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-champagne-dark dark:hover:text-champagne-light"
            >
              View all destinations
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </SectionReveal>

        {/* 8-CARD RESPONSIVE GRID */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((dest, index) => {
            const isHovered = hoveredId === dest.id;
            const isAnyHovered = hoveredId !== null;
            const isSibling = isAnyHovered && !isHovered;

            return (
              <SectionReveal
                key={dest.id}
                delay={index * 0.05}
                className={isHovered ? "relative z-30" : "relative z-10"}
              >
                <Link
                  to={`/explore?location=${encodeURIComponent(dest.name)}`}
                  onMouseEnter={() => setHoveredId(dest.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group relative block h-[380px] w-full overflow-hidden rounded-3xl border border-border/70 bg-card transition-all duration-300 ease-out active:scale-[0.98] ${
                    isHovered
                      ? "z-20 scale-[1.06] shadow-2xl ring-1 ring-border/80"
                      : isSibling
                      ? "opacity-60 shadow-luxe"
                      : "shadow-luxe hover:shadow-luxe-lg"
                  }`}
                  style={{
                    willChange: "transform, opacity, box-shadow"
                  }}
                >
                  {/* Background Image with zoom */}
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 scrim-card" />

                  {/* Top Badge: Listing Count */}
                  <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-md border border-white/10">
                    <MapPin size={11} className="text-champagne" />
                    <span>{dest.count}</span>
                  </div>

                  {/* Bottom Text Content */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-champagne-light">
                      {dest.region}
                    </span>
                    <h3 className="mt-1 font-heading text-2xl font-medium tracking-tight text-white sm:text-3xl">
                      {dest.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs text-white/80 leading-relaxed sm:text-sm">
                      {dest.tagline}
                    </p>

                    {/* View stays button - fades & glides up on hover */}
                    <div className="mt-4 flex items-center justify-between opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-lg">
                        View stays <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

