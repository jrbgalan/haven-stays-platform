import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getPhotoByTopic, imageUrl } from "@/lib/photos";
import PhotoCredit from "@/components/ui/PhotoCredit";
import { cn } from "@/lib/utils";

interface CategoryCardItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  topic: string;
  count: string;
  to: string;
}

const CATEGORY_ITEMS: CategoryCardItem[] = [
  {
    id: "beachfront",
    category: "Beachfront",
    title: "Beachfront Estates",
    subtitle: "Lagoon waters, coral reefs & private coves",
    topic: "beachfront villa",
    count: "38 sanctuaries",
    to: "/explore?category=Beachfront",
  },
  {
    id: "cabins",
    category: "Cabins",
    title: "Mountain Cabins",
    subtitle: "Pine hearth retreats & alpine stillness",
    topic: "mountain cabin",
    count: "24 retreats",
    to: "/explore?category=Cabins",
  },
  {
    id: "villas",
    category: "Villas",
    title: "Grand Villas & Pools",
    subtitle: "Infinity plunge pools & sweeping panoramas",
    topic: "luxury villa pool",
    count: "42 estates",
    to: "/explore?category=Villas",
  },
  {
    id: "penthouses",
    category: "City",
    title: "City Penthouses",
    subtitle: "Skyline horizons & private rooftop decks",
    topic: "city penthouse",
    count: "19 sky-suites",
    to: "/explore?category=City",
  },
  {
    id: "countryside",
    category: "Countryside",
    title: "Countryside Châteaux",
    subtitle: "Historic vineyards, stone walls & olive groves",
    topic: "countryside estate",
    count: "29 properties",
    to: "/explore?category=Countryside",
  },
  {
    id: "ryokan",
    category: "Ryokan",
    title: "Serene Ryokans",
    subtitle: "Tatami pavilions, onsen baths & maple gardens",
    topic: "ryokan",
    count: "16 pavilions",
    to: "/explore?category=Villas",
  },
];

interface CategoryPhotoCardsProps {
  className?: string;
}

export default function CategoryPhotoCards({ className }: CategoryPhotoCardsProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6", className)}>
      {CATEGORY_ITEMS.map((item) => {
        const photo = getPhotoByTopic(item.topic, 0);
        const imgUrl = photo ? imageUrl(photo, 800, 80) : "";

        return (
          <Link
            key={item.id}
            to={item.to}
            className="group relative flex aspect-[4/5] sm:aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl border border-border/70 bg-card p-5 shadow-luxe transition-all duration-500 hover:-translate-y-1.5 hover:shadow-luxe-lg"
            style={{ backgroundColor: photo?.color || "#18181b" }}
          >
            {/* Background Image */}
            {imgUrl && (
              <img
                src={imgUrl}
                alt={photo?.alt_text || item.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
            )}

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

            {/* Top Category Badge & Photo Credit */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-1">
              <span className="rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                {item.category}
              </span>
              {photo && (
                <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <PhotoCredit photo={photo} variant="badge" />
                </div>
              )}
            </div>

            {/* Content at Bottom */}
            <div className="relative z-10 text-white">
              <span className="text-[11px] font-medium text-champagne-light drop-shadow-xs">
                {item.count}
              </span>
              <h3 className="mt-1 font-heading text-lg font-medium leading-snug drop-shadow-sm group-hover:text-champagne-light transition-colors">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-white/80 line-clamp-2 drop-shadow-xs leading-relaxed">
                {item.subtitle}
              </p>
              <p className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 group-hover:text-champagne-light">
                <span>Explore</span>
                <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
