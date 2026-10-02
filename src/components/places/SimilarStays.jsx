import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { client } from "@/api/client";
import SmartImage from "@/components/ui/SmartImage";
import SectionReveal from "@/components/ui/SectionReveal";
import { formatCurrency } from "@/lib/format";

export default function SimilarStays({ listing }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.entities.Listing.list()
      .then((all) => {
        const rest = all.filter((l) => l.id !== listing.id);
        const scored = rest.map((l) => {
          let s = 0;
          if (l.city === listing.city) s += 3;
          if (l.category === listing.category) s += 2;
          s -= Math.abs((l.pricePerNight || 0) - (listing.pricePerNight || 0)) / 500;
          return { l, s };
        });
        scored.sort((a, b) => b.s - a.s);
        setSimilar(scored.slice(0, 8).map((x) => x.l));
      })
      .catch(() => setSimilar([]))
      .finally(() => setLoading(false));
  }, [listing.id]);

  if (!loading && similar.length === 0) return null;

  return (
    <SectionReveal>
      <div className="border-t border-border py-8">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-heading text-lg font-medium">You might also like</h3>
            <p className="mt-1 text-sm text-muted-foreground">Stays with a similar feel.</p>
          </div>
          <Link to="/explore" className="hidden items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground sm:flex">
            Explore all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="no-scrollbar mt-5 flex snap-x gap-4 overflow-x-auto pb-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-56 w-64 shrink-0 animate-pulse rounded-2xl bg-secondary" />)
            : similar.map((l) => (
              <Link key={l.id} to={`/listing/${l.id}`} className="group w-64 shrink-0 snap-start">
                <div className="relative h-40 overflow-hidden rounded-2xl">
                  <SmartImage src={(l.images || [])[0]} alt={l.title} className="h-full w-full" imgClassName="group-hover:scale-105" />
                </div>
                <div className="mt-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{l.title}</p>
                    <span className="flex shrink-0 items-center gap-0.5 text-xs">
                      <Star size={11} className="fill-accent text-accent" /> {l.rating?.toFixed(1)}
                    </span>
                  </div>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin size={10} /> {l.location}, {l.country}
                  </p>
                  <p className="mt-1 text-sm"><span className="font-semibold">{formatCurrency(l.pricePerNight)}</span> <span className="text-muted-foreground">night</span></p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </SectionReveal>
  );
}