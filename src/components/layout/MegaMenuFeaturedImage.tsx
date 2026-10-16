import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getPhotos, imageUrl, type UnsplashPhoto } from "@/lib/photos";
import PhotoCredit from "@/components/ui/PhotoCredit";
import { cn } from "@/lib/utils";

interface MegaMenuFeaturedImageProps {
  topic: string;
  title: string;
  subtitle: string;
  badge?: string;
  linkTo: string;
  className?: string;
}

interface ImageLayer {
  url: string;
  photo: UnsplashPhoto | null;
  key: string;
}

export default function MegaMenuFeaturedImage({
  topic,
  title,
  subtitle,
  badge = "Featured Sanctuary",
  linkTo,
  className,
}: MegaMenuFeaturedImageProps) {
  // Check reduced motion & touch capability
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Fetch 3 photos for this topic to enable cycling
  const topicPhotos = useMemo(() => {
    const list = getPhotos(topic, 3);
    return list.length > 0 ? list : getPhotos("beachfront villa", 3);
  }, [topic]);

  const [photoIndex, setPhotoIndex] = useState(0);

  // Stacked image layers for seamless crossfade (Layer A and Layer B)
  const currentPhoto = topicPhotos[photoIndex % topicPhotos.length] || null;
  const currentUrl = useMemo(
    () => (currentPhoto ? imageUrl(currentPhoto, 800, 80) : ""),
    [currentPhoto]
  );

  const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");
  const [layerA, setLayerA] = useState<ImageLayer>({
    url: currentUrl,
    photo: currentPhoto,
    key: "init-A",
  });
  const [layerB, setLayerB] = useState<ImageLayer>({
    url: currentUrl,
    photo: currentPhoto,
    key: "init-B",
  });

  // Track if initial load is done
  const isFirstRender = useRef(true);

  // Update image with preloading on topic or photoIndex change
  useEffect(() => {
    if (!currentUrl) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      setLayerA({ url: currentUrl, photo: currentPhoto, key: `${topic}-${photoIndex}-A` });
      return;
    }

    // Preload image before initiating crossfade to eliminate flicker
    const img = new Image();
    img.src = currentUrl;
    img.onload = () => {
      if (activeLayer === "A") {
        setLayerB({ url: currentUrl, photo: currentPhoto, key: `${topic}-${photoIndex}-B` });
        setActiveLayer("B");
      } else {
        setLayerA({ url: currentUrl, photo: currentPhoto, key: `${topic}-${photoIndex}-A` });
        setActiveLayer("A");
      }
    };
  }, [currentUrl, currentPhoto, topic, photoIndex]);

  // Reset photo index when topic changes
  useEffect(() => {
    setPhotoIndex(0);
  }, [topic]);

  // While menu stays on one link for > 4 seconds, slowly cycle through 3 photos with crossfade
  useEffect(() => {
    if (prefersReducedMotion || topicPhotos.length <= 1) return;

    const timer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % Math.min(topicPhotos.length, 3));
    }, 4500);

    return () => clearInterval(timer);
  }, [topic, topicPhotos.length, prefersReducedMotion]);

  const displayedPhoto = activeLayer === "A" ? layerA.photo : layerB.photo;

  return (
    <div
      className={cn(
        "group relative flex h-full min-h-[290px] flex-col justify-end overflow-hidden rounded-2xl bg-muted p-4 shadow-sm",
        className
      )}
    >
      {/* Stacked Image Layer A */}
      <div
        key={layerA.key}
        className={cn(
          "absolute inset-0 h-full w-full overflow-hidden transition-opacity ease-in-out",
          prefersReducedMotion ? "duration-0" : "duration-700",
          activeLayer === "A" ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
        )}
      >
        <img
          src={layerA.url}
          alt={layerA.photo?.alt_text || title}
          className={cn(
            "h-full w-full object-cover transition-transform ease-out",
            prefersReducedMotion ? "scale-100 duration-0" : "duration-1000 group-hover:scale-105",
            activeLayer === "A" && !prefersReducedMotion ? "scale-100" : "scale-[1.03]"
          )}
        />
      </div>

      {/* Stacked Image Layer B */}
      <div
        key={layerB.key}
        className={cn(
          "absolute inset-0 h-full w-full overflow-hidden transition-opacity ease-in-out",
          prefersReducedMotion ? "duration-0" : "duration-700",
          activeLayer === "B" ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
        )}
      >
        <img
          src={layerB.url}
          alt={layerB.photo?.alt_text || title}
          className={cn(
            "h-full w-full object-cover transition-transform ease-out",
            prefersReducedMotion ? "scale-100 duration-0" : "duration-1000 group-hover:scale-105",
            activeLayer === "B" && !prefersReducedMotion ? "scale-100" : "scale-[1.03]"
          )}
        />
      </div>

      {/* Scrim Overlay */}
      <div className="absolute inset-0 z-2 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

      {/* Top Attribution Badge */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
        <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md">
          {badge}
        </span>
        {displayedPhoto && (
          <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <PhotoCredit photo={displayedPhoto} variant="badge" />
          </div>
        )}
      </div>

      {/* Content & Link */}
      <Link to={linkTo} className="relative z-10 block text-white focus:outline-none">
        <h4 className="font-heading text-lg font-medium leading-snug drop-shadow-sm transition-colors group-hover:text-champagne-light">
          {title}
        </h4>
        <p className="mt-0.5 text-xs text-white/80 line-clamp-2 drop-shadow-xs">{subtitle}</p>
        <p className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-champagne-light">
          <span>Explore collection</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </p>
      </Link>
    </div>
  );
}

