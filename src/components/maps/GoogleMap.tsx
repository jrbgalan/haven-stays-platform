import React, { useState, useMemo } from "react";
import {
  MapPin,
  Maximize2,
  Minimize2,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Minus,
  Navigation,
  ShieldCheck,
  Compass,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface GoogleMapProps {
  location?: string;
  city?: string;
  country?: string;
  title?: string;
  initialZoom?: number;
  heightClassName?: string;
  className?: string;
  showControls?: boolean;
  showHighlights?: boolean;
  showPrivacyNote?: boolean;
  highlights?: Array<{ label: string; value: string; icon?: React.ElementType }>;
}

type MapMode = "m" | "k" | "p"; // m = roadmap, k = satellite, p = terrain

export default function GoogleMap({
  location,
  city,
  country,
  title,
  initialZoom = 14,
  heightClassName = "h-[360px] sm:h-[420px]",
  className,
  showControls = true,
  showHighlights = true,
  showPrivacyNote = true,
  highlights,
}: GoogleMapProps) {
  const [zoom, setZoom] = useState(initialZoom);
  const [mode, setMode] = useState<MapMode>("m");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Build clean search query for Google Maps without needing API key
  const query = useMemo(() => {
    const parts = [location, city, country].filter(Boolean);
    if (parts.length > 0) {
      return Array.from(new Set(parts)).join(", ");
    }
    return title || "Luxury Stay";
  }, [location, city, country, title]);

  const displayLocation = location || [city, country].filter(Boolean).join(", ") || "Verified Destination";

  // Free Google Maps embed URL (no API key required)
  const embedUrl = useMemo(() => {
    const encoded = encodeURIComponent(query);
    return `https://maps.google.com/maps?q=${encoded}&t=${mode}&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  }, [query, mode, zoom]);

  // Google Maps external link for directions and full Google Maps app
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 1, 19));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 1, 4));

  // Default neighborhood highlights if none provided
  const resolvedHighlights = highlights || [
    { label: "Surroundings", value: "Private & Serene", icon: Compass },
    { label: "Airport Access", value: "30-45 mins", icon: Navigation },
    { label: "Security", value: "24/7 Gated", icon: ShieldCheck },
  ];

  const mapContent = (
    <div className="relative w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-card shadow-sm">
      {/* Map loading shimmer */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-muted/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex items-center gap-2.5 rounded-full bg-card/90 px-4 py-2 text-xs font-medium text-foreground shadow-sm border border-border">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            <span>Loading Google Map…</span>
          </div>
        </div>
      )}

      {/* Google Maps Embed Iframe */}
      <iframe
        key={`${embedUrl}-${mode}-${zoom}`}
        title={`Map of ${query}`}
        src={embedUrl}
        className={cn(
          "w-full h-full border-0 transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
      />

      {/* Top Overlay Controls Bar */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Location Badge */}
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border/80 bg-card/95 px-3 py-1.5 shadow-luxe backdrop-blur-md">
            <div className="grid h-5 w-5 place-items-center rounded-full bg-foreground text-background">
              <MapPin size={11} />
            </div>
            <span className="max-w-[160px] sm:max-w-[240px] truncate text-xs font-semibold tracking-tight text-foreground">
              {displayLocation}
            </span>
          </div>

          {/* Mode Switchers: Map / Satellite / Terrain */}
          <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border/80 bg-card/95 p-1 shadow-luxe backdrop-blur-md">
            <button
              type="button"
              onClick={() => setMode("m")}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                mode === "m"
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Standard Roadmap"
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => setMode("k")}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                mode === "k"
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Satellite Imagery"
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMode("p")}
              className={cn(
                "hidden sm:inline-block rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                mode === "p"
                  ? "bg-foreground text-background shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Topographical Terrain"
            >
              Terrain
            </button>
          </div>
        </div>
      )}

      {/* Right-side Zoom & Action Controls */}
      {showControls && (
        <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 19}
            className="grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-card/95 text-foreground shadow-luxe backdrop-blur-md transition-all hover:bg-secondary disabled:opacity-40"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus size={14} />
          </button>
          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 4}
            className="grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-card/95 text-foreground shadow-luxe backdrop-blur-md transition-all hover:bg-secondary disabled:opacity-40"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus size={14} />
          </button>
          {/* Fullscreen / Expand */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-card/95 text-foreground shadow-luxe backdrop-blur-md transition-all hover:bg-secondary"
            aria-label={isFullscreen ? "Exit fullscreen" : "Expand map"}
            title={isFullscreen ? "Exit fullscreen" : "Expand map"}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      )}

      {/* Bottom Left Quick Links */}
      {showControls && (
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-1.5 pointer-events-auto">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/95 px-3 py-1.5 text-[11px] font-medium text-foreground shadow-luxe backdrop-blur-md transition-colors hover:bg-secondary"
          >
            <span>Open in Google Maps</span>
            <ExternalLink size={10} className="text-muted-foreground" />
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/95 px-2.5 py-1.5 text-[11px] font-medium text-foreground shadow-luxe backdrop-blur-md transition-colors hover:bg-secondary"
            title="Copy location address"
          >
            {copied ? (
              <>
                <Check size={11} className="text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={11} className="text-muted-foreground" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-3.5", className)}>
      {/* Standard Inline Map */}
      <div className={cn("w-full", heightClassName)}>{mapContent}</div>

      {/* Neighborhood Highlights Cards */}
      {showHighlights && (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {resolvedHighlights.map((item, idx) => {
            const Icon = item.icon || Compass;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/50 p-3 shadow-xs"
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-secondary text-foreground">
                  <Icon size={14} className="text-foreground/80" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-xs font-semibold text-foreground truncate">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Privacy & Directions Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground pt-1">
        {showPrivacyNote && (
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Exact coordinates & arrival guide provided upon booking confirmation.</span>
          </div>
        )}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
          >
            <Navigation size={11} />
            <span>Get Directions</span>
          </a>
        </div>
      </div>

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-card/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-background">
                  <MapPin size={13} />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold leading-none">{displayLocation}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Explore surrounding geography & roads</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="grid h-8 w-8 place-items-center rounded-full border border-border bg-secondary hover:bg-muted text-foreground transition-colors"
                aria-label="Close fullscreen map"
              >
                <Minimize2 size={13} />
              </button>
            </div>

            {/* Modal Map Body */}
            <div className="relative flex-1 w-full h-full">
              <iframe
                title={`Fullscreen Map of ${query}`}
                src={embedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

