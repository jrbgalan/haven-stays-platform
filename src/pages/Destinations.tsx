import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, ArrowRight, Sun, Calendar, Map as MapIcon, X } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import GoogleMap from "@/components/maps/GoogleMap";

interface DestinationItem {
  id: string;
  name: string;
  country: string;
  region: string;
  tagline: string;
  count: number;
  season: string;
  temp: string;
  image: string;
  featured?: boolean;
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: "palawan",
    name: "Palawan",
    country: "Philippines",
    region: "Southeast Asia",
    tagline: "Limestone towers rising from hidden lagoons and untouched private islands.",
    count: 19,
    season: "Nov – May",
    temp: "29°C",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    id: "cebu",
    name: "Cebu",
    country: "Philippines",
    region: "Southeast Asia",
    tagline: "White sand sandbars, whale shark sanctuaries, and tranquil seaside estates.",
    count: 14,
    season: "Dec – Jun",
    temp: "30°C",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "siargao",
    name: "Siargao",
    country: "Philippines",
    region: "Southeast Asia",
    tagline: "Unpretentious barefoot luxury, swaying palm groves, and Pacific breaks.",
    count: 11,
    season: "Aug – Nov",
    temp: "28°C",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "East Asia",
    tagline: "Skyline penthouses, Michelin culinary temples, and serene modern ryokans.",
    count: 22,
    season: "Mar – May · Sep – Nov",
    temp: "19°C",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "East Asia",
    tagline: "Ancient Zen gardens, preserved cedar pavilions, and autumn maple groves.",
    count: 15,
    season: "Apr – Jun · Oct – Nov",
    temp: "17°C",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Southeast Asia",
    tagline: "Terraced emerald rice paddies, cliffside infinity pools, and holistic sanctuaries.",
    count: 35,
    season: "Apr – Oct",
    temp: "27°C",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    region: "Mediterranean",
    tagline: "Whitewashed caldera architecture perched high above the cobalt Aegean sea.",
    count: 18,
    season: "May – Oct",
    temp: "26°C",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    id: "amalfi",
    name: "Amalfi Coast",
    country: "Italy",
    region: "Mediterranean",
    tagline: "Vertical lemon groves, historic cliff-clinging villas, and golden Italian sunsets.",
    count: 16,
    season: "May – Sep",
    temp: "25°C",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "zermatt",
    name: "Zermatt & Swiss Alps",
    country: "Switzerland",
    region: "Alpine & Americas",
    tagline: "Timber chalets facing the Matterhorn, crackling hearths, and glacier ski runs.",
    count: 12,
    season: "Dec – Apr · Jul – Sep",
    temp: "8°C",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "tulum",
    name: "Riviera Maya",
    country: "Mexico",
    region: "Alpine & Americas",
    tagline: "Jungle-fringed modernist villas, cenote dipping pools, and warm Caribbean breezes.",
    count: 14,
    season: "Nov – Apr",
    temp: "28°C",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  }
];

import { useSeo } from "@/lib/seo";

const REGIONS = ["All", "Southeast Asia", "East Asia", "Mediterranean", "Alpine & Americas"];

export default function Destinations() {
  useSeo(
    "Curated Global Destinations",
    "Explore coveted travel sanctuaries across Southeast Asia, the Mediterranean, Japan, the Swiss Alps, and the Americas."
  );
  const [activeRegion, setActiveRegion] = useState("All");
  const [mapModalDest, setMapModalDest] = useState<DestinationItem | null>(null);

  const filtered = activeRegion === "All"
    ? DESTINATIONS
    : DESTINATIONS.filter((d) => d.region === activeRegion);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-background pt-24 pb-8 md:pt-28 md:pb-12 lg:pb-14">
        <div className="absolute inset-0 film-grain" />
        <div className="container-haven">
          <SectionReveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-4 py-1.5 text-xs font-medium tracking-wide text-champagne-dark dark:text-champagne-light">
                <Globe size={13} /> The Global Collection
              </span>
              <h1 className="mt-2.5 font-heading text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Destinations Chosen for Quiet Wonder
              </h1>
              <p className="mt-3.5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                From sun-drenched Cycladic cliffs to mist-veiled Japanese cedar valleys — browse hand-verified private estates across the world’s most evocative landscapes.
              </p>
            </div>
          </SectionReveal>

          {/* REGION FILTER CHIPS */}
          <SectionReveal delay={0.1} className="mt-8 sm:mt-10">
            <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    activeRegion === region
                      ? "bg-foreground text-background shadow-luxe"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/80 hover:text-foreground"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* DESTINATIONS GRID */}
      <section className="container-haven section-padding-b">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.map((dest, idx) => (
            <SectionReveal key={dest.id} delay={idx * 0.05}>
              <Link
                to={`/explore?location=${encodeURIComponent(dest.name)}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxe transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe-lg"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-muted">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 scrim-card" />
                  {dest.featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background backdrop-blur">
                      Featured Destination
                    </span>
                  )}
                  <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-champagne-light">
                    {dest.country}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-heading text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-champagne-dark dark:group-hover:text-champagne-light">
                      {dest.name}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground">
                      {dest.count} stays
                    </span>
                  </div>

                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {dest.tagline}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} /> {dest.season}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sun size={13} /> {dest.temp}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMapModalDest(dest);
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
                      title="View on Google Map"
                    >
                      <MapIcon size={11} />
                      <span>Map</span>
                    </button>
                    <span className="flex items-center gap-1 font-semibold text-foreground group-hover:underline">
                      Explore <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* DESTINATION GOOGLE MAP PREVIEW MODAL */}
      {mapModalDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card/90 backdrop-blur">
              <div>
                <h3 className="font-heading text-lg font-semibold">{mapModalDest.name}, {mapModalDest.country}</h3>
                <p className="text-xs text-muted-foreground">{mapModalDest.tagline}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/explore?location=${encodeURIComponent(mapModalDest.name)}`}
                  className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
                >
                  View {mapModalDest.count} Stays
                </Link>
                <button
                  type="button"
                  onClick={() => setMapModalDest(null)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-border bg-secondary hover:bg-muted text-foreground transition-colors"
                  aria-label="Close map preview"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full p-4 overflow-hidden">
              <GoogleMap
                location={`${mapModalDest.name}, ${mapModalDest.country}`}
                city={mapModalDest.name}
                country={mapModalDest.country}
                title={mapModalDest.name}
                initialZoom={12}
                heightClassName="h-full"
                showControls={true}
                showHighlights={true}
                showPrivacyNote={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

