import React from "react";
import { X } from "lucide-react";
import { CATEGORIES, AMENITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PRICE_MIN = 0;
const PRICE_MAX = 2500;

export interface FilterValues {
  category: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  amenities: string[];
}

export interface FilterPanelProps {
  filters: FilterValues;
  onChange: (patch: any) => void;
  onClose?: () => void;
  className?: string;
}

export default function FilterPanel({ filters, onChange, onClose, className = "" }: FilterPanelProps) {
  const set = (patch: Partial<FilterValues>) => onChange({ ...filters, ...patch });

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="font-heading text-lg font-medium">Filters</h3>
        {onClose && (
          <button onClick={onClose} aria-label="Close filters" className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
        {/* Property type */}
        <div>
          <h4 className="text-sm font-semibold">Property type</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {["All", ...CATEGORIES.map((c) => c.id)].map((c) => (
              <button
                key={c}
                onClick={() => set({ category: c })}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  (filters.category || "All") === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-secondary"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div>
          <h4 className="text-sm font-semibold">Price per night</h4>
          <PriceRange
            min={filters.minPrice ?? PRICE_MIN}
            max={filters.maxPrice ?? PRICE_MAX}
            onChange={(minPrice, maxPrice) => set({ minPrice, maxPrice })}
          />
        </div>

        {/* Bedrooms */}
        <div>
          <h4 className="text-sm font-semibold">Bedrooms</h4>
          <div className="mt-3 flex gap-2">
            {[
              { label: "Any", value: 0 },
              { label: "2+", value: 2 },
              { label: "3+", value: 3 },
              { label: "4+", value: 4 },
            ].map((b) => (
              <button
                key={b.value}
                onClick={() => set({ bedrooms: b.value })}
                className={cn(
                  "flex-1 rounded-xl border py-2 text-sm transition-colors",
                  (filters.bedrooms ?? 0) === b.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-secondary"
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="text-sm font-semibold">Amenities</h4>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {AMENITIES.slice(0, 16).map((a) => {
              const active = (filters.amenities || []).includes(a);
              return (
                <button
                  key={a}
                  onClick={() =>
                    set({
                      amenities: active
                        ? filters.amenities.filter((x) => x !== a)
                        : [...(filters.amenities || []), a],
                    })
                  }
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left text-xs transition-colors",
                    active ? "border-foreground bg-secondary" : "border-border hover:bg-secondary/60"
                  )}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-border px-5 py-4">
        <button
          onClick={() => onChange({ category: "All", minPrice: PRICE_MIN, maxPrice: PRICE_MAX, bedrooms: 0, amenities: [] })}
          className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium hover:bg-secondary"
        >
          Clear all
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-foreground py-2.5 text-sm font-medium text-background lg:hidden"
          >
            Show results
          </button>
        )}
      </div>
    </div>
  );
}

interface PriceRangeProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

function PriceRange({ min, max, onChange }: PriceRangeProps) {
  const lo = Math.max(PRICE_MIN, Math.min(min, max));
  const hi = Math.min(PRICE_MAX, Math.max(min, max));
  const leftPct = ((lo - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const rightPct = ((hi - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">${lo}</span>
        <span className="text-muted-foreground">to</span>
        <span className="font-medium">${hi}{hi >= PRICE_MAX ? "+" : ""}</span>
      </div>

      <div className="relative mt-4 h-6">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-border" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-foreground"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          value={lo}
          onChange={(e) => onChange(Number(e.target.value), hi)}
          aria-label="Minimum price"
          className="range-dual absolute inset-0 w-full appearance-none bg-transparent
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-luxe
            [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground
            [&::-moz-range-thumb]:bg-background pointer-events-none"
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          value={hi}
          onChange={(e) => onChange(lo, Number(e.target.value))}
          aria-label="Maximum price"
          className="range-dual absolute inset-0 w-full appearance-none bg-transparent
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-luxe
            [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground
            [&::-moz-range-thumb]:bg-background pointer-events-none"
        />
      </div>
    </div>
  );
}
