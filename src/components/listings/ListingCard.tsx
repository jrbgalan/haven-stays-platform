import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import SaveButton from "@/components/listings/SaveButton";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function ListingCard({ listing, index = 0 }) {
  const [active, setActive] = useState(0);
  const images = listing.images || [];
  const count = images.length;

  const prev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive((i) => (i - 1 + count) % count);
  };
  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive((i) => (i + 1) % count);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link to={`/listing/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-luxe">
          <div className="absolute inset-0">
            <SmartImage
              src={images[active]}
              alt={listing.title}
              className="h-full w-full"
              imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          <div className="absolute right-2 top-2 z-10">
            <SaveButton listingId={listing.id} />
          </div>

          {count > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 grid-place-items-center rounded-full bg-white/90 p-1.5 shadow-luxe opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white md:grid"
              >
                <ChevronLeft size={16} className="text-foreground" />
              </button>
              <button
                onClick={next}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 grid-place-items-center rounded-full bg-white/90 p-1.5 shadow-luxe opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white md:grid"
              >
                <ChevronRight size={16} className="text-foreground" />
              </button>
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === active ? "w-4 bg-white" : "w-1.5 bg-white/60"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {listing.featured && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-medium tracking-wide text-background backdrop-blur">
              Featured
            </span>
          )}
        </div>

        <div className="mt-3 space-y-0.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate font-medium text-foreground">{listing.title}</h3>
            <div className="flex shrink-0 items-center gap-1 text-sm">
              <Star size={13} className="fill-accent text-accent" />
              <span className="tabular-nums">{listing.rating?.toFixed(1)}</span>
            </div>
          </div>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={12} /> {listing.city}, {listing.country}
          </p>
          <p className="pt-1 text-sm">
            <span className="font-semibold text-foreground">{formatCurrency(listing.pricePerNight)}</span>
            <span className="text-muted-foreground"> night</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}