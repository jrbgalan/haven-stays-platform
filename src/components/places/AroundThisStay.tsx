import React, { useEffect, useMemo, useState } from "react";
import { UtensilsCrossed, Camera, Trees, Wine, Gem } from "lucide-react";
import { getPlaces } from "@/services";
import SectionReveal from "@/components/ui/SectionReveal";
import PlaceCard from "./PlaceCard";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "Eat & Drink", icon: UtensilsCrossed },
  { id: "Attractions", icon: Camera },
  { id: "Nature", icon: Trees },
  { id: "Nightlife", icon: Wine },
  { id: "Hidden Gems", icon: Gem },
];

export default function AroundThisStay({ listingId }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Eat & Drink");

  useEffect(() => {
    setLoading(true);
    getPlaces(listingId)
      .then(setPlaces)
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, [listingId]);

  const byCat = useMemo(() => {
    const map = {};
    places.forEach((p) => { (map[p.category] ||= []).push(p); });
    return map;
  }, [places]);
  const shown = byCat[tab] || [];
  const firstWithContent = TABS.find((t) => (byCat[t.id] || []).length > 0)?.id;

  useEffect(() => {
    if (firstWithContent && (byCat[tab] || []).length === 0) setTab(firstWithContent);
  }, [firstWithContent]);

  return (
    <SectionReveal>
      <div className="border-t border-border py-8">
        <h3 className="font-heading text-lg font-medium">Around this stay</h3>
        <p className="mt-1 text-sm text-muted-foreground">Handpicked spots worth the walk.</p>

        <div className="mt-5 no-scrollbar flex gap-2 overflow-x-auto">
          {TABS.map((t) => {
            const count = (byCat[t.id] || []).length;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                disabled={count === 0}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                  tab === t.id ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary",
                  count === 0 && "cursor-not-allowed opacity-40 hover:bg-transparent"
                )}
              >
                <t.icon size={14} /> {t.id}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl bg-secondary" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No spots in this category yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((p, i) => <PlaceCard key={p.id} place={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </SectionReveal>
  );
}