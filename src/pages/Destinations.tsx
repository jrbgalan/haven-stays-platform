import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  ArrowRight,
  Sun,
  Calendar,
  Map as MapIcon,
  X,
  Camera,
  Layers,
  Sparkles,
} from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import GoogleMap from "@/components/maps/GoogleMap";
import PhotoCredit from "@/components/ui/PhotoCredit";
import { getPhotos, imageUrl, type UnsplashPhoto } from "@/lib/photos";
import { useSeo } from "@/lib/seo";

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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
  },
];

const REGIONS = ["All", "Southeast Asia", "East Asia", "Mediterranean", "Alpine & Americas"];

export default function Destinations() {
  useSeo(
    "Curated Global Destinations & Sanctuaries",
    "Explore coveted travel sanctuaries across Southeast Asia, the Mediterranean, Japan, the Swiss Alps, and the Americas."
  );

  const [activeRegion, setActiveRegion] = useState("All");
  const [mapModalDest, setMapModalDest] = useState<DestinationItem | null>(null);
  const [galleryModalDest, setGalleryModalDest] = useState<DestinationItem | null>(null);

  const filtered =
    activeRegion === "All" ? DESTINATIONS : DESTINATIONS.filter((d) => d.region === activeRegion);

  // Photos for the active gallery mosaic modal (6-8 photos)
  const mosaicPhotos = useMemo(() => {
    if (!galleryModalDest) return [];
    return getPhotos(galleryModalDest.name, 8);
  }, [galleryModalDest]);

  // Global Featured Mosaic (8 photos)
  const globalMosaic = useMemo(() => {
    const list: Array<{ photo: UnsplashPhoto; title: string; country: string; span: string }> = [];
    const pool = [
      { name: "Palawan", country: "Philippines", span: "col-span-12 sm:col-span-8 lg:col-span-8" },
      { name: "Santorini", country: "Greece", span: "col-span-12 sm:col-span-4 lg:col-span-4" },
      { name: "Kyoto", country: "Japan", span: "col-span-12 sm:col-span-4 lg:col-span-4" },
      { name: "Bali", country: "Indonesia", span: "col-span-12 sm:col-span-4 lg:col-span-4" },
      { name: "Zermatt", country: "Switzerland", span: "col-span-12 sm:col-span-4 lg:col-span-4" },
      { name: "Cebu", country: "Philippines", span: "col-span-12 sm:col-span-6 lg:col-span-6" },
      { name: "Amalfi Coast", country: "Italy", span: "col-span-12 sm:col-span-6 lg:col-span-6" },
    ];

    pool.forEach((item) => {
      const p = getPhotos(item.name, 1)[0];
      if (p) {
        list.push({ photo: p, title: item.name, country: item.country, span: item.span });
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
              <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-champagne-dark dark:text-champagne-light">
                <Globe size={13} /> The Global Collection
              </span>
              <h1 className="mt-3 font-heading text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Destinations Chosen for Quiet Wonder
              </h1>
              <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                From limestone atolls in the Sulu Sea to mist-clad Kyoto cedar groves, each haven is chosen
                for rare privacy, architectural character, and genuine sense of place.
              </p>
            </div>
          </SectionReveal>

          {/* REGION TABS */}
          <SectionReveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-2">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dest, idx) => {
            const destPhotos = getPhotos(dest.name, 5);
            const heroPhoto = destPhotos[0] || null;
            const heroUrl = heroPhoto ? imageUrl(heroPhoto, 1200, 80) : dest.image;
            const stripPhotos = destPhotos.slice(1, 5);

            return (
              <SectionReveal key={dest.id} delay={idx * 0.05}>
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxe transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe-lg">
                  {/* Hero Photo with Photographer Credit */}
                  <div
                    className="relative aspect-[16/11] overflow-hidden bg-muted"
                    style={{ backgroundColor: heroPhoto?.color || "#18181b" }}
                  >
                    <img
                      src={heroUrl}
                      alt={heroPhoto?.alt_text || dest.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

                    {dest.featured && (
                      <span className="absolute left-4 top-4 rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background backdrop-blur-md">
                        Featured Destination
                      </span>
                    )}

                    {heroPhoto && (
                      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <PhotoCredit photo={heroPhoto} variant="badge" />
                      </div>
                    )}

                    <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-wider text-champagne-light">
                      {dest.country}
                    </span>
                  </div>

                  {/* Body Content */}
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

                    {/* Photo Strip in Card (3-4 Thumbnails with Credits) */}
                    {stripPhotos.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-border/60">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5 font-medium">
                          <span>Visual highlights</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setGalleryModalDest(dest);
                            }}
                            className="hover:text-foreground inline-flex items-center gap-1"
                          >
                            <Camera size={11} /> 6-8 photos
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 overflow-hidden rounded-xl">
                          {stripPhotos.map((p, pIdx) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setGalleryModalDest(dest)}
                              className="group/thumb relative aspect-square overflow-hidden bg-muted"
                              title={`View ${dest.name} gallery`}
                              style={{ backgroundColor: p.color }}
                            >
                              <img
                                src={imageUrl(p, 300, 70)}
                                alt={p.alt_text}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Card Actions Footer */}
                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {dest.season}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sun size={13} /> {dest.temp}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setGalleryModalDest(dest);
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
                          title="View 6-8 photo mosaic gallery"
                        >
                          <Layers size={11} />
                          <span>Mosaic</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setMapModalDest(dest);
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
                          title="View on Google Map"
                        >
                          <MapIcon size={11} />
                          <span>Map</span>
                        </button>
                      </div>

                      <Link
                        to={`/explore?location=${encodeURIComponent(dest.name)}`}
                        className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline"
                      >
                        Explore <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </section>

      {/* GLOBAL SANCTUARIES 8-PHOTO MOSAIC GALLERY SECTION */}
      <section className="border-t border-border/70 bg-card/40 py-16 sm:py-24">
        <div className="container-haven">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-champagne-dark dark:text-champagne-light">
                <Sparkles size={13} /> Global Mosaic
              </span>
              <h2 className="mt-3 font-heading text-3xl font-medium sm:text-4xl text-foreground">
                Portals to Extraordinary Sanctuaries
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                High-resolution architectural photography captured across Haven's global network.
              </p>
            </div>
          </SectionReveal>

          {/* 8-Photo Mosaic Grid */}
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            {globalMosaic.map((item, idx) => (
              <SectionReveal key={idx} delay={idx * 0.05} className={item.span}>
                <Link
                  to={`/explore?location=${encodeURIComponent(item.title)}`}
                  className="group relative block h-64 sm:h-80 overflow-hidden rounded-3xl border border-border/80 shadow-luxe"
                  style={{ backgroundColor: item.photo.color }}
                >
                  <img
                    src={imageUrl(item.photo, 1400, 80)}
                    alt={item.photo.alt_text}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PhotoCredit photo={item.photo} variant="badge" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-champagne-light">
                      {item.country}
                    </span>
                    <h3 className="font-heading text-xl font-medium leading-snug drop-shadow-sm group-hover:text-champagne-light transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6-8 PHOTO MOSAIC GALLERY MODAL */}
      {galleryModalDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card/90 backdrop-blur">
              <div>
                <h3 className="font-heading text-lg font-semibold">
                  {galleryModalDest.name}, {galleryModalDest.country}
                </h3>
                <p className="text-xs text-muted-foreground">{galleryModalDest.tagline}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/explore?location=${encodeURIComponent(galleryModalDest.name)}`}
                  className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background hover:opacity-90"
                >
                  Explore {galleryModalDest.count} Stays
                </Link>
                <button
                  type="button"
                  onClick={() => setGalleryModalDest(null)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-border bg-secondary hover:bg-muted text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* 6-8 Photo Mosaic Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-12 gap-3 sm:gap-4">
                {mosaicPhotos.map((p, i) => {
                  const span =
                    i === 0
                      ? "col-span-12 sm:col-span-8 h-72 sm:h-96"
                      : i === 1
                      ? "col-span-12 sm:col-span-4 h-72 sm:h-96"
                      : i === 2 || i === 3
                      ? "col-span-12 sm:col-span-6 h-60 sm:h-72"
                      : "col-span-12 sm:col-span-4 h-52 sm:h-64";

                  return (
                    <div
                      key={p.id}
                      className={`group relative overflow-hidden rounded-2xl border border-border/80 shadow-sm ${span}`}
                      style={{ backgroundColor: p.color }}
                    >
                      <img
                        src={imageUrl(p, 1200, 80)}
                        alt={p.alt_text}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <PhotoCredit photo={p} variant="badge" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE MAP PREVIEW MODAL */}
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
