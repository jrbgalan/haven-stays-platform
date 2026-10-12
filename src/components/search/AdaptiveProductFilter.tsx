import React from "react";
import { X, RotateCcw, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductType } from "@/types/products";

export interface FilterState {
  // Common Stays
  propertyType: string; // "all" | "hotel" | "home" | "apartment"
  stayType: string; // "all" | "overnight" | "day_use"
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  minRating: number;
  amenities: string[];

  // Activities
  activityCategory: string;
  activityDuration: string; // "all" | "short" | "medium" | "full_day"

  // Transfers
  vehicleType: string;
  passengerCapacity: number;

  // Flights
  flightStops: string; // "all" | "non_stop" | "1_stop"
  cabinClass: string;
  airline: string;

  // Bundles
  minSavings: number;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  propertyType: "all",
  stayType: "all",
  minPrice: 0,
  maxPrice: 3000,
  bedrooms: 0,
  minRating: 0,
  amenities: [],
  activityCategory: "all",
  activityDuration: "all",
  vehicleType: "all",
  passengerCapacity: 0,
  flightStops: "all",
  cabinClass: "all",
  airline: "all",
  minSavings: 0,
};

interface AdaptiveProductFilterProps {
  productType: ProductType;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  onClose?: () => void;
}

const STAY_AMENITIES = [
  "Infinity Pool",
  "Private Beach",
  "Ocean View",
  "Wine Cellar",
  "Chef's Kitchen",
  "Private Chef",
  "Spa",
  "Air Conditioning",
  "Fireplace",
  "Wifi",
];

const AIRLINES_LIST = [
  "All",
  "Singapore Airlines",
  "All Nippon Airways (ANA)",
  "Philippine Airlines",
  "Swiss International Air Lines",
  "Cathay Pacific",
  "Emirates",
  "Aegean Airlines",
  "Air France",
];

export default function AdaptiveProductFilter({
  productType,
  filters,
  onChange,
  onReset,
  onClose,
}: AdaptiveProductFilterProps) {
  const update = (patch: Partial<FilterState>) => {
    onChange({ ...filters, ...patch });
  };

  const isStay = ["hotels", "homes", "overnight", "day_use"].includes(productType);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-champagne" />
          <h3 className="font-heading text-lg font-medium text-foreground">Filter Results</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            title="Reset filters"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary text-muted-foreground lg:hidden"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Body */}
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 text-sm">
        {/* ================= STAYS FILTERS ================= */}
        {isStay && (
          <>
            {/* Property Type */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Property Type
              </label>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "All Types" },
                  { id: "hotel", label: "Luxury Hotel" },
                  { id: "home", label: "Private Villa / Home" },
                  { id: "apartment", label: "Penthouse / Apt" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => update({ propertyType: item.id })}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                      filters.propertyType === item.id
                        ? "bg-foreground text-background font-semibold"
                        : "bg-secondary text-foreground/75 hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>{productType === "day_use" ? "Price / 8h Block" : "Price / Night"}</span>
                <span className="font-mono text-foreground">${filters.maxPrice} max</span>
              </div>
              <input
                type="range"
                min={50}
                max={3000}
                step={50}
                value={filters.maxPrice}
                onChange={(e) => update({ maxPrice: Number(e.target.value) })}
                className="mt-3 w-full accent-champagne"
              />
            </div>

            {/* Guest Rating */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Guest Rating
              </label>
              <div className="mt-2.5 flex gap-2">
                {[
                  { val: 0, label: "Any" },
                  { val: 4.5, label: "4.5★+" },
                  { val: 4.8, label: "4.8★+" },
                  { val: 4.9, label: "4.9★+" },
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => update({ minRating: r.val })}
                    className={cn(
                      "flex-1 rounded-2xl border p-2 text-center text-xs font-medium transition-colors",
                      filters.minRating === r.val
                        ? "border-accent bg-accent/10 text-foreground font-semibold"
                        : "border-border hover:bg-secondary text-muted-foreground"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms */}
            {productType !== "day_use" && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Bedrooms
                </label>
                <div className="mt-2.5 flex gap-2">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => update({ bedrooms: num })}
                      className={cn(
                        "flex-1 rounded-2xl border p-2 text-center text-xs font-medium transition-colors",
                        filters.bedrooms === num
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:bg-secondary"
                      )}
                    >
                      {num === 0 ? "Any" : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sanctuary Amenities
              </label>
              <div className="mt-2.5 space-y-2">
                {STAY_AMENITIES.map((amenity) => {
                  const checked = filters.amenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const updated = checked
                            ? filters.amenities.filter((a) => a !== amenity)
                            : [...filters.amenities, amenity];
                          update({ amenities: updated });
                        }}
                        className="rounded accent-champagne"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ================= ACTIVITIES FILTERS ================= */}
        {productType === "activities" && (
          <>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </label>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {["all", "Tours", "Food", "Adventure", "Wellness", "Culture"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => update({ activityCategory: cat })}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                      filters.activityCategory === cat
                        ? "bg-foreground text-background font-semibold"
                        : "bg-secondary text-foreground/75 hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    {cat === "all" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Max Price / Person</span>
                <span className="font-mono text-foreground">${filters.maxPrice}</span>
              </div>
              <input
                type="range"
                min={50}
                max={600}
                step={25}
                value={filters.maxPrice}
                onChange={(e) => update({ maxPrice: Number(e.target.value) })}
                className="mt-3 w-full accent-champagne"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Duration
              </label>
              <div className="mt-2.5 space-y-2">
                {[
                  { id: "all", label: "Any Duration" },
                  { id: "short", label: "Under 4 Hours" },
                  { id: "medium", label: "4 to 6 Hours" },
                  { id: "full_day", label: "Full Day Immersion" },
                ].map((dur) => (
                  <label key={dur.id} className="flex items-center gap-2.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="actDuration"
                      checked={filters.activityDuration === dur.id}
                      onChange={() => update({ activityDuration: dur.id })}
                      className="accent-champagne"
                    />
                    <span>{dur.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ================= TRANSFERS FILTERS ================= */}
        {productType === "transfers" && (
          <>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vehicle Type
              </label>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {["all", "Sedan", "SUV", "Van", "Luxury Limousine"].map((v) => (
                  <button
                    key={v}
                    onClick={() => update({ vehicleType: v })}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                      filters.vehicleType === v
                        ? "bg-foreground text-background font-semibold"
                        : "bg-secondary text-foreground/75 hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    {v === "all" ? "All Vehicles" : v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Passenger Capacity
              </label>
              <div className="mt-2.5 flex gap-2">
                {[
                  { val: 0, label: "Any" },
                  { val: 3, label: "3+ Pax" },
                  { val: 5, label: "5+ Pax" },
                  { val: 7, label: "7+ Pax" },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => update({ passengerCapacity: p.val })}
                    className={cn(
                      "flex-1 rounded-2xl border p-2 text-center text-xs font-medium transition-colors",
                      filters.passengerCapacity === p.val
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:bg-secondary"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Max Transfer Rate</span>
                <span className="font-mono text-foreground">${filters.maxPrice}</span>
              </div>
              <input
                type="range"
                min={50}
                max={400}
                step={25}
                value={filters.maxPrice}
                onChange={(e) => update({ maxPrice: Number(e.target.value) })}
                className="mt-3 w-full accent-champagne"
              />
            </div>
          </>
        )}

        {/* ================= FLIGHTS FILTERS ================= */}
        {productType === "flights" && (
          <>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Flight Stops
              </label>
              <div className="mt-2.5 flex gap-2">
                {[
                  { id: "all", label: "All Flights" },
                  { id: "non_stop", label: "Non-stop" },
                  { id: "1_stop", label: "1 Stop" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => update({ flightStops: s.id })}
                    className={cn(
                      "flex-1 rounded-2xl border p-2 text-center text-xs font-medium transition-colors",
                      filters.flightStops === s.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:bg-secondary"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Cabin Class
              </label>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {["all", "Economy", "Premium Economy", "Business", "First"].map((c) => (
                  <button
                    key={c}
                    onClick={() => update({ cabinClass: c })}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                      filters.cabinClass === c
                        ? "bg-foreground text-background font-semibold"
                        : "bg-secondary text-foreground/75 hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    {c === "all" ? "All Classes" : c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Airline Carrier
              </label>
              <select
                value={filters.airline}
                onChange={(e) => update({ airline: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-border bg-card p-2.5 text-xs text-foreground outline-none"
              >
                {AIRLINES_LIST.map((air) => (
                  <option key={air} value={air === "All" ? "all" : air}>
                    {air}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Max Ticket Price</span>
                <span className="font-mono text-foreground">${filters.maxPrice}</span>
              </div>
              <input
                type="range"
                min={100}
                max={4000}
                step={100}
                value={filters.maxPrice}
                onChange={(e) => update({ maxPrice: Number(e.target.value) })}
                className="mt-3 w-full accent-champagne"
              />
            </div>
          </>
        )}

        {/* ================= BUNDLES FILTERS ================= */}
        {productType === "packages" && (
          <>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Minimum Bundle Savings
              </label>
              <div className="mt-2.5 flex gap-2">
                {[
                  { val: 0, label: "Any Savings" },
                  { val: 20, label: "20% Off+" },
                  { val: 25, label: "25% Off+" },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => update({ minSavings: s.val })}
                    className={cn(
                      "flex-1 rounded-2xl border p-2 text-center text-xs font-medium transition-colors",
                      filters.minSavings === s.val
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "border-border hover:bg-secondary"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Max Bundle Total</span>
                <span className="font-mono text-foreground">${filters.maxPrice}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={6000}
                step={200}
                value={filters.maxPrice}
                onChange={(e) => update({ maxPrice: Number(e.target.value) })}
                className="mt-3 w-full accent-champagne"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

