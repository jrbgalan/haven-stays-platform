import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, LayoutGrid, List, Search, X, Sparkles } from "lucide-react";
import { client } from "@/api/client";
import ListingCard from "@/components/listings/ListingCard";
import CategoryChips from "@/components/listings/CategoryChips";
import FilterPanel from "@/components/search/FilterPanel";
import SmartSearch from "@/components/ai/SmartSearch";
import { ListingCardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types/listing";
import type { AISmartSearchResult } from "@/types/ai";

const SORTS = [
  { id: "recommended", label: "Recommended" },
  { id: "price_asc", label: "Price: low to high" },
  { id: "price_desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("recommended");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [location, setLocation] = useState(params.get("location") || "");
  const [aiResult, setAiResult] = useState<AISmartSearchResult | null>(null);

  const categoryParam = params.get("category") || "All";

  const [filters, setFilters] = useState({
    category: categoryParam,
    minPrice: 0,
    maxPrice: 2500,
    bedrooms: 0,
    amenities: [] as string[],
  });

  // Sync category param with filters if URL changes
  useEffect(() => {
    setFilters((f) => ({ ...f, category: categoryParam }));
  }, [categoryParam]);

  useEffect(() => {
    client.entities.Listing.list()
      .then((res: Listing[]) => setListings(res || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectCategory = (c: string) => {
    setFilters((f) => ({ ...f, category: c }));
    const newParams = new URLSearchParams(params);
    if (c && c !== "All") {
      newParams.set("category", c);
    } else {
      newParams.delete("category");
    }
    setParams(newParams, { replace: true });
  };

  const filtered = useMemo(() => {
    let r = [...listings];
    if (aiResult?.listingIds?.length) {
      const order = new Map(aiResult.listingIds.map((id, i) => [id, i]));
      return r.filter((l) => order.has(l.id)).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    }
    if (filters.category && filters.category !== "All") {
      r = r.filter((l) => l.category?.toLowerCase() === filters.category.toLowerCase());
    }
    r = r.filter((l) => l.pricePerNight >= filters.minPrice && l.pricePerNight <= filters.maxPrice);
    if (filters.bedrooms) r = r.filter((l) => (l.bedrooms || 0) >= filters.bedrooms);
    if (location) {
      const q = location.toLowerCase();
      r = r.filter(
        (l) =>
          l.city?.toLowerCase().includes(q) ||
          l.country?.toLowerCase().includes(q) ||
          l.title?.toLowerCase().includes(q) ||
          l.location?.toLowerCase().includes(q)
      );
    }
    if (filters.amenities?.length) {
      r = r.filter((l) => filters.amenities.every((a) => (l.amenities || []).includes(a)));
    }
    if (sort === "price_asc") r.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sort === "price_desc") r.sort((a, b) => b.pricePerNight - a.pricePerNight);
    else if (sort === "rating") r.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return r;
  }, [listings, filters, location, sort, aiResult]);

  const activeCount =
    (filters.category !== "All" ? 1 : 0) +
    (filters.bedrooms ? 1 : 0) +
    (filters.amenities?.length ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 2500 ? 1 : 0);

  return (
    <div className="pt-16">
      {/* Sticky control bar */}
      <div className="sticky top-16 z-30 border-b border-border glass">
        <div className="mx-auto max-w-7xl px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex-1 overflow-hidden">
              <CategoryChips
                active={filters.category}
                onSelect={handleSelectCategory}
              />
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm font-medium hover:bg-secondary"
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-foreground text-[11px] text-background">{activeCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* AI smart search */}
        <div className="mb-4">
          <SmartSearch onResult={(res) => setAiResult(res && !('error' in res) ? res as AISmartSearchResult : null)} />
          {aiResult && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles size={12} className="text-champagne" />
              Showing AI-matched stays
              <button onClick={() => setAiResult(null)} className="rounded-full border border-border px-2 py-0.5 hover:bg-secondary">Clear</button>
            </div>
          )}
        </div>

        {/* Search + sort row */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search by city or country"
              className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {location && (
              <button onClick={() => setLocation("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>Sort: {s.label}</option>
              ))}
            </select>
            <div className="hidden rounded-full border border-border p-1 sm:flex">
              <button onClick={() => setView("grid")} aria-label="Grid view" className={cn("grid h-8 w-8 place-items-center rounded-full", view === "grid" ? "bg-foreground text-background" : "text-foreground/60")}>
                <LayoutGrid size={15} />
              </button>
              <button onClick={() => setView("list")} aria-label="List view" className={cn("grid h-8 w-8 place-items-center rounded-full", view === "list" ? "bg-foreground text-background" : "text-foreground/60")}>
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        <p className="mb-5 text-sm text-muted-foreground">
          {loading ? "Searching…" : `${filtered.length} ${filtered.length === 1 ? "stay" : "stays"}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onClear={() => { handleSelectCategory("All"); setFilters({ category: "All", minPrice: 0, maxPrice: 2500, bedrooms: 0, amenities: [] }); setLocation(""); }} />
        ) : (
          <div className={view === "grid" ? "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-5"}>
            {filtered.map((l, i) => (
              <ListingCard key={l.id} listing={l} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 w-[88%] max-w-sm border-l border-border bg-background shadow-luxe-lg lg:hidden"
            >
              <FilterPanel filters={filters} onChange={setFilters} onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-24 text-center">
      <Search size={32} className="text-muted-foreground" strokeWidth={1.5} />
      <h3 className="mt-4 font-heading text-xl font-medium">No stays found</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">Try adjusting your filters or searching a different destination.</p>
      <button onClick={onClear} className="mt-5 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
        Clear all filters
      </button>
    </div>
  );
}
