import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import PhotoCredit from "@/components/ui/PhotoCredit";
import { getPhotos, imageUrl } from "@/lib/photos";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types/products";

interface ExperienceCardProps {
  experience: Experience;
  onBook?: (exp: Experience) => void;
  className?: string;
  variant?: "default" | "compact" | "featured";
}

export default function ExperienceCard({
  experience,
  onBook,
  className,
  variant = "default",
}: ExperienceCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);

  // Retrieve 3+ photos for this experience topic
  const photos = useMemo(() => {
    const list = getPhotos(experience.topic || "hiking adventure", 4);
    if (list.length > 0) return list;
    return [];
  }, [experience.topic]);

  const currentPhoto = photos[photoIndex % photos.length] || null;
  const currentImgUrl = currentPhoto
    ? imageUrl(currentPhoto, 800, 80)
    : experience.image;

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

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex(index);
  };

  const handleBookClick = (e: React.MouseEvent) => {
    if (onBook) {
      e.preventDefault();
      e.stopPropagation();
      onBook(experience);
    }
  };

  const priceAmount = experience.pricePerPerson || experience.price;
  const ratingVal = experience.rating ? experience.rating.toFixed(2) : "4.95";
  const reviewsCountVal = experience.reviewCount || experience.reviewsCount || 48;

  return (
    <Link
      to={`/experiences/${experience.id}`}
      role="link"
      tabIndex={0}
      aria-label={`View experience: ${experience.title}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/75 bg-card shadow-luxe transition-all duration-300",
        "hover:-translate-y-1.5 hover:shadow-luxe-lg",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
        "cursor-pointer select-none",
        className
      )}
    >
      {/* 1. MEDIA CAROUSEL SECTION */}
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          variant === "compact" ? "aspect-[16/11]" : "aspect-[16/10]"
        )}
        style={{ backgroundColor: currentPhoto?.color || "#18181b" }}
      >
        {currentImgUrl && (
          <motion.img
            layoutId={`exp-hero-img-${experience.id}`}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            src={currentImgUrl}
            alt={currentPhoto?.alt_text || experience.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Carousel Navigation Arrows (min 44px hit target) */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 min-h-[44px] min-w-[44px] place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-black/90 focus-visible:opacity-100"
              aria-label="Previous photo"
            >
              <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
                <ChevronLeft size={16} />
              </div>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 min-h-[44px] min-w-[44px] place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-black/90 focus-visible:opacity-100"
              aria-label="Next photo"
            >
              <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
                <ChevronRight size={16} />
              </div>
            </button>
          </>
        )}

        {/* Carousel Indicator Dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => handleDotClick(e, i)}
                className={cn(
                  "h-1.5 rounded-full transition-all min-h-[14px] min-w-[14px] flex items-center justify-center p-0 bg-transparent"
                )}
                aria-label={`Go to photo ${i + 1}`}
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all",
                    photoIndex === i ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  )}
                />
              </button>
            ))}
          </div>
        )}

        {/* Badges: Verified / Category / Highlight */}
        <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
          {experience.badge && (
            <span className="rounded-full bg-foreground/85 px-3 py-1 text-xs font-semibold text-background backdrop-blur-md shadow-sm">
              {experience.badge}
            </span>
          )}
          <span className="rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
            {experience.category}
          </span>
        </div>

        {/* Photo Attribution on Hover */}
        {currentPhoto && (
          <div className="absolute top-4 right-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <PhotoCredit photo={currentPhoto} variant="badge" />
          </div>
        )}

        {/* Location pill */}
        <span className="absolute bottom-3 left-4 z-10 text-xs font-semibold uppercase tracking-wider text-white/95 drop-shadow-sm">
          {experience.city || experience.location}, {experience.country}
        </span>
      </div>

      {/* 2. CARD BODY */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {/* Quick Meta Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock size={13} className="text-champagne-dark dark:text-champagne-light" />
            {experience.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} />
            {experience.groupSize}
          </span>
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Star size={12} className="fill-accent text-accent" />
            {ratingVal} ({reviewsCountVal})
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-heading text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-champagne-dark dark:group-hover:text-champagne-light line-clamp-2">
          {experience.title}
        </h3>

        {/* Description / Tagline */}
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {experience.tagline || experience.description}
        </p>

        {/* Highlights Pills (if available) */}
        {experience.highlights && experience.highlights.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
            {experience.highlights.slice(0, 2).map((h, i) => (
              <span
                key={i}
                className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground font-medium truncate max-w-[200px]"
              >
                • {h}
              </span>
            ))}
          </div>
        )}

        {/* 3. CARD FOOTER */}
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <div>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">From</span>
            <p className="text-lg font-semibold text-foreground leading-tight">
              {formatCurrency(priceAmount)}
              <span className="text-xs font-normal text-muted-foreground"> / guest</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onBook && (
              <button
                type="button"
                onClick={handleBookClick}
                className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/80 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary active:scale-95"
              >
                Reserve
              </button>
            )}

            <span className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-transform group-hover:scale-102 shadow-sm">
              <span>Explore</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
