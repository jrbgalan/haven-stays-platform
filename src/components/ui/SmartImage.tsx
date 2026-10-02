import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface SmartImageProps {
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  gradient?: string;
  rounded?: boolean;
  eager?: boolean;
}

/**
 * SmartImage — blur-up load with graceful gradient fallback.
 * Never shows a broken-image icon: if the source fails, a tasteful
 * champagne-tinted gradient fills the box.
 */
export default function SmartImage({
  src,
  alt = "",
  className,
  imgClassName,
  gradient = "from-champagne/30 via-secondary to-muted",
  rounded = true,
  eager = false,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-muted", rounded && "rounded-[inherit]", className)}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full object-cover transition-all duration-700 ease-out",
            loaded ? "blur-0 scale-100 opacity-100" : "blur-xl scale-105 opacity-0",
            imgClassName
          )}
        />
      )}
      {failed && (
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} aria-hidden="true">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-foreground/40 text-lg tracking-tight">Haven</span>
          </div>
        </div>
      )}
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" />
      )}
    </div>
  );
}

