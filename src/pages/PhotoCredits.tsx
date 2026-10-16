import React, { useState, useMemo } from "react";
import { Camera, ExternalLink, Search } from "lucide-react";
import { getAllPhotographers, imageUrl } from "@/lib/photos";
import SectionReveal from "@/components/ui/SectionReveal";
import { useSeo } from "@/lib/seo";

export default function PhotoCredits() {
  useSeo(
    "Photo Credits & Attributions",
    "Acknowledging the talented photographers on Unsplash who bring Haven's luxury sanctuaries and experiences to life."
  );

  const [query, setQuery] = useState("");
  const photographers = useMemo(() => getAllPhotographers(), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return photographers;
    const q = query.toLowerCase();
    return photographers.filter((p) => p.name.toLowerCase().includes(q));
  }, [photographers, query]);

  const totalPhotos = useMemo(
    () => photographers.reduce((acc, p) => acc + p.photoCount, 0),
    [photographers]
  );

  return (
    <div className="pt-20 pb-20">
      {/* Header */}
      <section className="relative overflow-hidden bg-background pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="container-haven">
          <SectionReveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-champagne-dark dark:text-champagne-light">
                <Camera size={13} /> Visual Storytelling
              </span>
              <h1 className="mt-3 font-heading text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Photo Credits &amp; Attribution
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Haven is honored to showcase the work of {photographers.length} exceptional
                creators from the global Unsplash community across {totalPhotos} curated photographs.
                Every image complies with Unsplash guidelines and attribution standards.
              </p>

              {/* Search input */}
              <div className="mt-6 relative max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search photographer name…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Photographers Grid */}
      <section className="container-haven">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, idx) => (
            <SectionReveal key={item.name} delay={Math.min(idx * 0.03, 0.3)}>
              <div className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-luxe transition-all duration-300 hover:shadow-luxe-lg">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-medium text-foreground group-hover:text-champagne-dark dark:group-hover:text-champagne-light transition-colors">
                      {item.name}
                    </h3>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {item.photoCount} {item.photoCount === 1 ? "photo" : "photos"}
                    </span>
                  </div>

                  {/* Thumbnail Previews */}
                  <div className="mt-3.5 grid grid-cols-4 gap-1.5 overflow-hidden rounded-xl">
                    {item.samplePhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative aspect-square overflow-hidden bg-muted"
                        style={{ backgroundColor: photo.color }}
                      >
                        <img
                          src={imageUrl(photo, 240, 70)}
                          alt={photo.alt_text}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <a
                    href={item.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
                  >
                    <span>View Unsplash Profile</span>
                    <ExternalLink size={11} className="text-muted-foreground" />
                  </a>
                  <span className="text-[11px] text-muted-foreground">Unsplash Contributor</span>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <p>No photographers found matching "{query}".</p>
          </div>
        )}

        {/* Unsplash Attribution Note */}
        <div className="mt-12 rounded-3xl border border-border/70 bg-card/50 p-6 sm:p-8 text-center text-xs text-muted-foreground leading-relaxed">
          <p>
            Photography provided via the{" "}
            <a
              href="https://unsplash.com/?utm_source=haven&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground underline"
            >
              Unsplash API
            </a>
            . All photographs are displayed under the Unsplash License. Hotlinked directly to
            Unsplash CDNs with author credit and download metrics tracked.
          </p>
        </div>
      </section>
    </div>
  );
}
