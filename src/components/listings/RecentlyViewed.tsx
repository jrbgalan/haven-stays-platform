import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Star, MapPin, ArrowRight } from "lucide-react";
import { getListingById } from "@/services";
import { formatCurrency } from "@/lib/format";
import type { Listing } from "@/types/listing";

const STORAGE_KEY = "haven_recently_viewed_ids";

export function trackRecentlyViewed(listingId: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: string[] = raw ? JSON.parse(raw) : [];
    const updated = [listingId, ...existing.filter((id) => id !== listingId)].slice(0, 8);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage issues
  }
}

interface RecentlyViewedProps {
  currentListingId?: string;
  className?: string;
}

export default function RecentlyViewed({ currentListingId, className = "" }: RecentlyViewedProps) {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const ids: string[] = raw ? JSON.parse(raw) : [];
        const filteredIds = ids.filter((id) => id !== currentListingId).slice(0, 4);

        if (filteredIds.length === 0) {
          setLoading(false);
          return;
        }

        const loaded = await Promise.all(
          filteredIds.map((id) => getListingById(id).catch(() => null))
        );
        if (!cancelled) {
          setItems(loaded.filter(Boolean) as Listing[]);
        }
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentListingId]);

  if (loading || items.length === 0) return null;

  return (
    <div className={`mt-12 rounded-3xl border border-border/70 bg-secondary/30 p-6 sm:p-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-champagne-dark dark:text-champagne-light" />
          <h3 className="font-heading text-xl font-medium text-foreground">
            Recently Viewed Sanctuaries
          </h3>
        </div>
        <Link
          to="/explore"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          Explore more <ArrowRight size={12} />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((listing) => {
          const img = (listing.images || [])[0] || "";
          return (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                <img
                  src={img}
                  alt={listing.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="mt-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <h4 className="font-heading text-sm font-semibold text-foreground line-clamp-1">
                      {listing.title}
                    </h4>
                    <span className="flex items-center gap-0.5 text-xs font-semibold shrink-0">
                      <Star size={11} className="fill-accent text-accent" />
                      {listing.rating?.toFixed(1) || "5.0"}
                    </span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin size={10} /> {listing.city}, {listing.country}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-border/40 flex items-baseline justify-between">
                  <span className="text-[11px] text-muted-foreground">From</span>
                  <span className="text-xs font-bold text-foreground">
                    {formatCurrency(listing.pricePerNight)}
                    <span className="font-normal text-[10px] text-muted-foreground"> / night</span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

