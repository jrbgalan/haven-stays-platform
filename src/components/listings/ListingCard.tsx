import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, MapPin, Star, Flame, Check, Scale
} from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import SaveButton from "@/components/listings/SaveButton";
import ShareButton from "@/components/listings/ShareButton";
import VerifiedBadge from "@/components/listings/VerifiedBadge";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types/listing";

interface ListingCardProps {
  listing: Listing;
  index?: number;
  showTotalPrice?: boolean;
  isComparing?: boolean;
  onToggleCompare?: (listing: Listing) => void;
}

export default function ListingCard({
  listing,
  index = 0,
  showTotalPrice = false,
  isComparing = false,
  onToggleCompare,
}: ListingCardProps) {
  const [active, setActive] = useState(0);
  const images = listing.images || [];
  const count = images.length;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActive((i) => (i - 1 + count) % count);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActive((i) => (i + 1) % count);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleCompare) onToggleCompare(listing);
  };

  // Fees calculation for total price transparency
  const feesAndTaxes = (listing.cleaningFee || 0) + (listing.serviceFee || 0) + (listing.taxes || 0);
  const allInclusiveTotal = listing.pricePerNight + feesAndTaxes;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative"
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

          {/* Top-Right Action Controls: Share + Save */}
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
            <div className="rounded-full bg-black/35 backdrop-blur-md">
              <ShareButton
                title={listing.title}
                url={`${window.location.origin}/listing/${listing.id}`}
                className="text-white hover:bg-white/20"
                size={15}
              />
            </div>
            <div className="rounded-full bg-black/35 backdrop-blur-md">
              <SaveButton listingId={listing.id} size={18} />
            </div>
          </div>

          {/* Top-Left Controls: Featured / Verified / Compare Toggle */}
          <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5 items-start">
            {listing.featured && (
              <span className="rounded-full bg-foreground/85 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-background backdrop-blur shadow-sm">
                Featured
              </span>
            )}
            {listing.isVerified && (
              <VerifiedBadge size="sm" className="bg-black/45 text-white border-white/20 shadow-sm" />
            )}
          </div>

          {/* Compare Button */}
          {onToggleCompare && (
            <button
              type="button"
              onClick={handleCompareClick}
              aria-label={isComparing ? "Remove from comparison" : "Add to comparison"}
              className={cn(
                "absolute left-2.5 bottom-2.5 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide shadow-md backdrop-blur-md transition-all duration-200",
                isComparing
                  ? "bg-champagne text-black ring-2 ring-champagne"
                  : "bg-black/55 text-white/90 hover:bg-black/75 opacity-0 group-hover:opacity-100"
              )}
            >
              {isComparing ? (
                <>
                  <Check size={11} className="stroke-[3]" />
                  <span>Comparing</span>
                </>
              ) : (
                <>
                  <Scale size={11} />
                  <span>Compare</span>
                </>
              )}
            </button>
          )}

          {/* Carousel Arrows & Indicator */}
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
        </div>

        {/* Card Details */}
        <div className="mt-3 space-y-1">
          {/* Title & Rating */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate font-medium text-foreground text-base">{listing.title}</h3>
            <div className="flex shrink-0 items-center gap-1 text-sm">
              <Star size={13} className="fill-accent text-accent" />
              <span className="tabular-nums font-semibold">{listing.rating?.toFixed(1) || "5.0"}</span>
            </div>
          </div>

          {/* Location */}
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} className="text-champagne-dark dark:text-champagne-light" />
            <span>{listing.city}, {listing.country}</span>
          </p>

          {/* Price Transparency & Price-History Hint */}
          <div className="pt-0.5 flex flex-wrap items-baseline justify-between gap-1">
            <div>
              {showTotalPrice ? (
                <div>
                  <span className="font-heading text-base font-semibold text-foreground">
                    {formatCurrency(allInclusiveTotal)}
                  </span>
                  <span className="text-xs text-muted-foreground"> total</span>
                  <p className="text-[10px] text-muted-foreground">
                    Includes {formatCurrency(feesAndTaxes)} in taxes & fees
                  </p>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-base font-semibold text-foreground">
                    {formatCurrency(listing.pricePerNight)}
                  </span>
                  <span className="text-xs text-muted-foreground"> / night</span>
                  {listing.originalPricePerNight && (
                    <span className="ml-1 text-[11px] line-through text-muted-foreground">
                      {formatCurrency(listing.originalPricePerNight)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Price-history hint */}
            {listing.originalPricePerNight && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Price dropped 14%
              </span>
            )}
          </div>

          {/* Social Proof Line */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground">
            {listing.bookedThisMonth ? (
              <span className="flex items-center gap-1 text-foreground/80 font-medium">
                <Flame size={12} className="text-amber-500" />
                Booked {listing.bookedThisMonth} times this month
              </span>
            ) : null}
            {listing.remainingUnits && listing.remainingUnits <= 3 ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold text-[10px]">
                Only {listing.remainingUnits} left on your dates
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}