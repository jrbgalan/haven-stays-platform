import React from "react";
import { cn } from "@/lib/utils";
import type { UnsplashPhoto } from "@/lib/photos";

interface PhotoCreditProps {
  photo?: UnsplashPhoto | null;
  photographerName?: string;
  photographerUrl?: string;
  photoUrl?: string;
  className?: string;
  variant?: "badge" | "subtle" | "overlay";
}

export default function PhotoCredit({
  photo,
  photographerName,
  photographerUrl,
  photoUrl,
  className,
  variant = "badge",
}: PhotoCreditProps) {
  const name = photographerName || photo?.photographer_name || "Unsplash";
  const pUrl = photographerUrl || photo?.photographer_profile_url || "https://unsplash.com/?utm_source=haven&utm_medium=referral";
  const imgUrl = photoUrl || photo?.photo_page_url || "https://unsplash.com/?utm_source=haven&utm_medium=referral";

  if (variant === "subtle") {
    return (
      <span className={cn("text-[11px] text-muted-foreground", className)}>
        Photo by{" "}
        <a
          href={pUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          {name}
        </a>{" "}
        on{" "}
        <a
          href={imgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          Unsplash
        </a>
      </span>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur-md shadow-sm transition-opacity pointer-events-auto",
        className
      )}
    >
      <span>Photo by</span>
      <a
        href={pUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline decoration-white/40 hover:text-white hover:decoration-white transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {name}
      </a>
      <span>on</span>
      <a
        href={imgUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline decoration-white/40 hover:text-white hover:decoration-white transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        Unsplash
      </a>
    </div>
  );
}
