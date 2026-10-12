import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check, Star, ShieldCheck, Scale } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Listing } from "@/types/listing";

interface CompareDrawerProps {
  selectedListings: Listing[];
  onRemove: (id: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
  showTotalPrice?: boolean;
}

const COMPARISON_AMENITIES = [
  "Private Pool",
  "Ocean View",
  "Private Chef",
  "Hot Tub",
  "Spa",
  "Wine Cellar",
  "Air Conditioning",
  "Wifi",
];

export default function CompareDrawer({
  selectedListings,
  onRemove,
  onClear,
  isOpen,
  onClose,
  showTotalPrice = false,
}: CompareDrawerProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-0 sm:p-4">
        {/* Backdrop dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal / Drawer Window */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-border bg-card shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-champagne/15 text-champagne-dark dark:text-champagne-light">
                <Scale size={18} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-medium text-foreground">
                  Sanctuary Comparison
                </h3>
                <p className="text-xs text-muted-foreground">
                  Comparing {selectedListings.length} of max 3 hand-curated stays
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClear}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body Content - Side by Side columns */}
          <div className="overflow-x-auto p-6">
            <div
              className="grid gap-6 min-w-[640px]"
              style={{
                gridTemplateColumns: `repeat(${selectedListings.length}, minmax(260px, 1fr))`,
              }}
            >
              {selectedListings.map((listing) => {
                const img = (listing.images || [])[0] || "";
                const allInclusivePrice = listing.pricePerNight + (listing.cleaningFee || 0) + (listing.serviceFee || 0) + (listing.taxes || 0);

                return (
                  <div
                    key={listing.id}
                    className="flex flex-col justify-between rounded-2xl border border-border/80 bg-secondary/20 p-4 shadow-sm"
                  >
                    <div>
                      {/* Image & Remove button */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                        <img
                          src={img}
                          alt={listing.title}
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => onRemove(listing.id)}
                          aria-label={`Remove ${listing.title}`}
                          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/90 transition-colors"
                        >
                          <X size={14} />
                        </button>
                        {listing.isVerified && (
                          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-champagne/90 px-2 py-0.5 text-[9px] font-bold text-foreground backdrop-blur">
                            <ShieldCheck size={10} /> Verified
                          </div>
                        )}
                      </div>

                      {/* Title & City */}
                      <div className="mt-3">
                        <h4 className="font-heading text-base font-semibold text-foreground line-clamp-1">
                          {listing.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {listing.city}, {listing.country}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="mt-3 rounded-xl bg-background/80 p-3 border border-border/60">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-muted-foreground">Per night</span>
                          <span className="font-heading text-lg font-medium text-foreground">
                            {formatCurrency(listing.pricePerNight)}
                          </span>
                        </div>
                        {showTotalPrice && (
                          <div className="mt-1 flex items-baseline justify-between border-t border-border/40 pt-1 text-[11px]">
                            <span className="text-muted-foreground">All-inclusive total</span>
                            <span className="font-semibold text-champagne-dark dark:text-champagne-light">
                              {formatCurrency(allInclusivePrice)}
                            </span>
                          </div>
                        )}
                        {listing.originalPricePerNight && (
                          <span className="mt-1 inline-block text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            Price dropped 12%
                          </span>
                        )}
                      </div>

                      {/* Metrics Table */}
                      <div className="mt-4 space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Rating</span>
                          <span className="flex items-center gap-1 font-semibold">
                            <Star size={12} className="fill-accent text-accent" />
                            {listing.rating?.toFixed(1) || "5.0"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Bedrooms / Baths</span>
                          <span className="font-medium text-foreground">
                            {listing.bedrooms || 1} bed · {listing.bathrooms || 1} bath
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Max Guests</span>
                          <span className="font-medium text-foreground">
                            {listing.maxGuests || 2} guests
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Type</span>
                          <span className="capitalize font-medium text-foreground">
                            {listing.propertyType || "Villa"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Cancellation</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            {listing.freeCancellation ? "Free cancellation" : "Standard"}
                          </span>
                        </div>
                      </div>

                      {/* Amenities checklist */}
                      <div className="mt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Key Amenities
                        </p>
                        <div className="mt-2 space-y-1.5 text-xs">
                          {COMPARISON_AMENITIES.map((amenity) => {
                            const hasAmenity = (listing.amenities || []).some(
                              (a) => a.toLowerCase() === amenity.toLowerCase()
                            );
                            return (
                              <div
                                key={amenity}
                                className="flex items-center justify-between text-[11px]"
                              >
                                <span className={hasAmenity ? "text-foreground" : "text-muted-foreground/60"}>
                                  {amenity}
                                </span>
                                {hasAmenity ? (
                                  <Check size={13} className="text-emerald-500 font-bold" />
                                ) : (
                                  <span className="text-muted-foreground/40">—</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Book / View Button */}
                    <div className="mt-6 pt-3 border-t border-border/60">
                      <Link
                        to={`/listing/${listing.id}`}
                        onClick={onClose}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
                      >
                        Reserve Stay <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

