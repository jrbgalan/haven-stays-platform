import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, LayoutGrid, List, Search, X, Scale, Sparkles, Check, ArrowRight
} from "lucide-react";
import {
  getListings,
  getActivities,
  getTransfers,
  getFlights,
  getPackages,
} from "@/services";
import ListingCard from "@/components/listings/ListingCard";
import SmartSearch from "@/components/ai/SmartSearch";
import CompareDrawer from "@/components/listings/CompareDrawer";
import { PRODUCT_TABS } from "@/components/search/MultiProductSearchBar";
import AdaptiveProductFilter, { FilterState, DEFAULT_FILTER_STATE } from "@/components/search/AdaptiveProductFilter";
import {
  ActivityCard,
  TransferCard,
  FlightCard,
  BundleCard,
  DayUseStayCard,
} from "@/components/products/ProductCards";
import ProductBookingModal, { BookingModalData } from "@/components/booking/ProductBookingModal";
import { ListingCardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useSeo } from "@/lib/seo";
import type { Listing } from "@/types/listing";
import type { ProductType, Activity, Transfer, Flight, HotelFlightBundle } from "@/types/products";
import type { AISmartSearchResult } from "@/types/ai";

const SORTS_MAP: Record<string, { id: string; label: string }[]> = {
  default: [
    { id: "recommended", label: "Recommended" },
    { id: "price_asc", label: "Price: low to high" },
    { id: "price_desc", label: "Price: high to low" },
    { id: "rating", label: "Top rated" },
  ],
  packages: [
    { id: "savings", label: "Highest Savings" },
    { id: "price_asc", label: "Price: low to high" },
    { id: "price_desc", label: "Price: high to low" },
  ],
  flights: [
    { id: "price_asc", label: "Lowest Price" },
    { id: "duration", label: "Shortest Duration" },
    { id: "price_desc", label: "Highest Price" },
  ],
};

export default function Explore() {
  useSeo(
    "Explore Stays & Multi-Product Escapes",
    "Filter hundreds of vetted luxury properties, beachfront villas, day use retreats, activities, transfers, and flights."
  );
  const [params, setParams] = useSearchParams();

  // Active product category tab
  const rawProduct = params.get("product") as ProductType;
  const productType: ProductType = [
    "hotels", "homes", "overnight", "day_use", "activities", "transfers", "flights", "packages"
  ].includes(rawProduct)
    ? rawProduct
    : "hotels";

  // Data state
  const [listings, setListings] = useState<Listing[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bundles, setBundles] = useState<HotelFlightBundle[]>([]);

  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("recommended");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(params.get("location") || "");
  const [aiResult, setAiResult] = useState<AISmartSearchResult | null>(null);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBookingItem, setSelectedBookingItem] = useState<BookingModalData | null>(null);

  // Adaptive Filter State
  const [filters, setFilters] = useState<FilterState>(() => {
    const s = { ...DEFAULT_FILTER_STATE };
    if (params.get("category")) s.activityCategory = params.get("category") || "all";
    return s;
  });

  // Price Transparency & Comparison State
  const [showTotalPrice, setShowTotalPrice] = useState(false);
  const [comparingListings, setComparingListings] = useState<Listing[]>([]);
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);

  const handleToggleCompare = (listing: Listing) => {
    setComparingListings((prev) => {
      const exists = prev.some((l) => l.id === listing.id);
      if (exists) {
        return prev.filter((l) => l.id !== listing.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), listing];
      }
      return [...prev, listing];
    });
  };

  // Fetch all product data on mount using typed service layer
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getListings().catch(() => []),
      getActivities().catch(() => []),
      getTransfers().catch(() => []),
      getFlights().catch(() => []),
      getPackages().catch(() => []),
    ])
      .then(([ls, acts, trs, fls, pks]) => {
        setListings(ls);
        setActivities(acts);
        setTransfers(trs);
        setFlights(fls);
        setBundles(pks);
      })
      .finally(() => setLoading(false));
  }, []);

  // Sync tab change into URL
  const handleTabChange = (type: ProductType) => {
    const newParams = new URLSearchParams(params);
    newParams.set("product", type);
    setParams(newParams, { replace: true });
    setAiResult(null);
  };

  // Filtered and Sorted Results
  const results = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // 1. HOTELS / HOMES / OVERNIGHT / DAY USE
    if (["hotels", "homes", "overnight", "day_use"].includes(productType)) {
      let r = [...listings];

      // Property type filter
      if (productType === "hotels") {
        r = r.filter((l) => l.propertyType === "hotel" || !l.propertyType);
      } else if (productType === "homes") {
        r = r.filter((l) => l.propertyType === "home" || l.propertyType === "apartment");
      } else if (productType === "day_use") {
        r = r.filter((l) => l.stayType === "day_use" || l.stayType === "both");
      }

      // Manual propertyType filter inside sidebar
      if (filters.propertyType !== "all") {
        r = r.filter((l) => l.propertyType === filters.propertyType);
      }

      // Price filter
      if (productType === "day_use") {
        r = r.filter((l) => (l.dayUsePricePerBlock || 300) <= filters.maxPrice);
      } else {
        r = r.filter((l) => l.pricePerNight <= filters.maxPrice);
      }

      // Rating filter
      if (filters.minRating > 0) {
        r = r.filter((l) => (l.rating || 0) >= filters.minRating);
      }

      // Bedrooms filter
      if (filters.bedrooms > 0) {
        r = r.filter((l) => (l.bedrooms || 0) >= filters.bedrooms);
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        r = r.filter((l) => filters.amenities.every((a) => (l.amenities || []).includes(a)));
      }

      // Search query
      if (q) {
        r = r.filter(
          (l) =>
            l.city?.toLowerCase().includes(q) ||
            l.country?.toLowerCase().includes(q) ||
            l.title?.toLowerCase().includes(q) ||
            l.location?.toLowerCase().includes(q)
        );
      }

      // Trust & Policy filters
      if (filters.freeCancellationOnly) {
        r = r.filter((l) => l.freeCancellation);
      }
      if (filters.instantBookOnly) {
        r = r.filter((l) => l.instantBookable);
      }
      if (filters.verifiedOnly) {
        r = r.filter((l) => l.isVerified);
      }

      // Sort
      if (sort === "price_asc") {
        r.sort((a, b) => {
          if (productType === "day_use") {
            return (a.dayUsePricePerBlock || 0) - (b.dayUsePricePerBlock || 0);
          }
          const priceA = showTotalPrice
            ? a.pricePerNight + (a.cleaningFee || 0) + (a.serviceFee || 0) + (a.taxes || 0)
            : a.pricePerNight;
          const priceB = showTotalPrice
            ? b.pricePerNight + (b.cleaningFee || 0) + (b.serviceFee || 0) + (b.taxes || 0)
            : b.pricePerNight;
          return priceA - priceB;
        });
      } else if (sort === "price_desc") {
        r.sort((a, b) => {
          if (productType === "day_use") {
            return (b.dayUsePricePerBlock || 0) - (a.dayUsePricePerBlock || 0);
          }
          const priceA = showTotalPrice
            ? a.pricePerNight + (a.cleaningFee || 0) + (a.serviceFee || 0) + (a.taxes || 0)
            : a.pricePerNight;
          const priceB = showTotalPrice
            ? b.pricePerNight + (b.cleaningFee || 0) + (b.serviceFee || 0) + (b.taxes || 0)
            : b.pricePerNight;
          return priceB - priceA;
        });
      } else if (sort === "rating") {
        r.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      return { type: productType, items: r };
    }

    // 2. ACTIVITIES
    if (productType === "activities") {
      let r = [...activities];
      if (filters.activityCategory !== "all") {
        r = r.filter((a) => a.category.toLowerCase() === filters.activityCategory.toLowerCase());
      }
      r = r.filter((a) => a.pricePerPerson <= filters.maxPrice);

      if (q) {
        r = r.filter(
          (a) =>
            a.city.toLowerCase().includes(q) ||
            a.country.toLowerCase().includes(q) ||
            a.title.toLowerCase().includes(q) ||
            a.location.toLowerCase().includes(q)
        );
      }

      if (sort === "price_asc") r.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
      else if (sort === "price_desc") r.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
      else if (sort === "rating") r.sort((a, b) => b.rating - a.rating);

      return { type: "activities", items: r };
    }

    // 3. TRANSFERS
    if (productType === "transfers") {
      let r = [...transfers];
      if (filters.vehicleType !== "all") {
        r = r.filter((t) => t.vehicleType.toLowerCase() === filters.vehicleType.toLowerCase());
      }
      if (filters.passengerCapacity > 0) {
        r = r.filter((t) => t.capacityPassengers >= filters.passengerCapacity);
      }
      r = r.filter((t) => t.basePrice <= filters.maxPrice);

      if (q) {
        r = r.filter(
          (t) =>
            t.city.toLowerCase().includes(q) ||
            t.airportName.toLowerCase().includes(q) ||
            t.airportCode.toLowerCase().includes(q)
        );
      }

      if (sort === "price_asc") r.sort((a, b) => a.basePrice - b.basePrice);
      else if (sort === "price_desc") r.sort((a, b) => b.basePrice - a.basePrice);

      return { type: "transfers", items: r };
    }

    // 4. FLIGHTS
    if (productType === "flights") {
      let r = [...flights];
      if (filters.flightStops !== "all") {
        const targetStops = filters.flightStops === "non_stop" ? 0 : 1;
        r = r.filter((f) => f.stops === targetStops);
      }
      if (filters.cabinClass !== "all") {
        r = r.filter((f) => f.cabinClass.toLowerCase() === filters.cabinClass.toLowerCase());
      }
      if (filters.airline !== "all") {
        r = r.filter((f) => f.airline.toLowerCase() === filters.airline.toLowerCase());
      }
      r = r.filter((f) => f.price <= filters.maxPrice);

      if (q) {
        r = r.filter(
          (f) =>
            f.originCity.toLowerCase().includes(q) ||
            f.destinationCity.toLowerCase().includes(q) ||
            f.airline.toLowerCase().includes(q)
        );
      }

      if (sort === "price_asc") r.sort((a, b) => a.price - b.price);
      else if (sort === "price_desc") r.sort((a, b) => b.price - a.price);

      return { type: "flights", items: r };
    }

    // 5. PACKAGES (HOTEL + FLIGHT)
    if (productType === "packages") {
      let r = [...bundles];
      if (filters.minSavings > 0) {
        r = r.filter((b) => b.savingsPercent >= filters.minSavings);
      }
      r = r.filter((b) => b.bundlePrice <= filters.maxPrice);

      if (q) {
        r = r.filter(
          (b) =>
            b.listing.city.toLowerCase().includes(q) ||
            b.listing.country.toLowerCase().includes(q) ||
            b.listing.title.toLowerCase().includes(q)
        );
      }

      if (sort === "savings") r.sort((a, b) => b.savingsPercent - a.savingsPercent);
      else if (sort === "price_asc") r.sort((a, b) => a.bundlePrice - b.bundlePrice);
      else if (sort === "price_desc") r.sort((a, b) => b.bundlePrice - a.bundlePrice);

      return { type: "packages", items: r };
    }

    return { type: productType, items: [] };
  }, [productType, listings, activities, transfers, flights, bundles, filters, searchQuery, sort]);

  // Book Handlers
  const handleBookActivity = (act: Activity) => {
    setSelectedBookingItem({
      productType: "activities",
      itemId: act.id,
      itemTitle: act.title,
      itemSubtitle: `${act.city}, ${act.country} · ${act.duration}`,
      itemImage: act.image,
      price: act.pricePerPerson,
      passengersOrGuests: 2,
    });
    setBookingModalOpen(true);
  };

  const handleBookTransfer = (trans: Transfer) => {
    setSelectedBookingItem({
      productType: "transfers",
      itemId: trans.id,
      itemTitle: trans.vehicleModel,
      itemSubtitle: `${trans.airportName} (${trans.airportCode}) → ${trans.city}`,
      itemImage: trans.image,
      price: trans.basePrice,
      passengersOrGuests: trans.capacityPassengers,
    });
    setBookingModalOpen(true);
  };

  const handleBookFlight = (fl: Flight) => {
    setSelectedBookingItem({
      productType: "flights",
      itemId: fl.id,
      itemTitle: `${fl.airline} ${fl.flightNumber} (${fl.cabinClass})`,
      itemSubtitle: `${fl.originCity} (${fl.originCode}) → ${fl.destinationCity} (${fl.destinationCode}) · ${fl.duration}`,
      itemImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80",
      price: fl.price,
      passengersOrGuests: 1,
    });
    setBookingModalOpen(true);
  };

  const handleBookBundle = (pkg: HotelFlightBundle) => {
    setSelectedBookingItem({
      productType: "packages",
      itemId: pkg.id,
      itemTitle: `${pkg.listing.title} + ${pkg.flight.airline} Flight`,
      itemSubtitle: `${pkg.listing.city}, ${pkg.listing.country} · ${pkg.nights} Nights (Save ${pkg.savingsPercent}%)`,
      itemImage: (pkg.listing.images || [])[0],
      price: pkg.bundlePrice,
      passengersOrGuests: 2,
    });
    setBookingModalOpen(true);
  };

  const handleBookDayUse = (listing: Listing) => {
    const dayPrice = listing.dayUsePricePerBlock || Math.round(listing.pricePerNight * 0.45);
    setSelectedBookingItem({
      productType: "day_use",
      itemId: listing.id,
      itemTitle: `${listing.title} (Day Access)`,
      itemSubtitle: `${listing.city}, ${listing.country} · 8-Hour Sanctuary Block`,
      itemImage: (listing.images || [])[0],
      price: dayPrice,
      timeSlot: "09:00 - 17:00",
      passengersOrGuests: 2,
    });
    setBookingModalOpen(true);
  };

  // Sorter items
  const sorters = SORTS_MAP[productType] || SORTS_MAP.default;

  return (
    <div className="min-h-screen pt-20">
      {/* 1. TOP MULTI-PRODUCT PRODUCT TAB BAR */}
      <div className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5 py-1">
            {PRODUCT_TABS.map((tab) => {
              const isActive = productType === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all",
                    isActive
                      ? "bg-foreground text-background shadow-md font-semibold"
                      : "bg-secondary/70 text-foreground/75 hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
                        isActive ? "bg-champagne text-foreground" : "bg-champagne/20 text-champagne-dark dark:text-champagne-light"
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. MAIN SEARCH & RESULTS WORKSPACE */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Control Bar: Search Input, Sorter, Filter Button */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by destination, city or name..."
              className="w-full rounded-full border border-border/80 bg-card py-2.5 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-accent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary"
            >
              <SlidersHorizontal size={14} className="text-champagne" />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-accent"
            >
              {sorters.map((s) => (
                <option key={s.id} value={s.id}>
                  Sort: {s.label}
                </option>
              ))}
            </select>

            {/* Total price transparency toggle */}
            {["hotels", "homes", "overnight"].includes(productType) && (
              <label
                className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium cursor-pointer transition-colors hover:bg-secondary select-none"
                title="Toggle between nightly rate and all-inclusive total including taxes and cleaning fees"
              >
                <input
                  type="checkbox"
                  checked={showTotalPrice}
                  onChange={(e) => setShowTotalPrice(e.target.checked)}
                  className="rounded accent-champagne cursor-pointer"
                />
                <span className={showTotalPrice ? "font-semibold text-foreground" : "text-muted-foreground"}>
                  Total with fees
                </span>
              </label>
            )}

            {/* View Grid/List toggle (stays only) */}
            {["hotels", "homes", "overnight"].includes(productType) && (
              <div className="hidden sm:flex rounded-full border border-border p-1 bg-card">
                <button
                  onClick={() => setView("grid")}
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full transition-colors",
                    view === "grid" ? "bg-foreground text-background" : "text-foreground/60"
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full transition-colors",
                    view === "list" ? "bg-foreground text-background" : "text-foreground/60"
                  )}
                  aria-label="List view"
                >
                  <List size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Trust Filter Chips */}
        {["hotels", "homes", "overnight"].includes(productType) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Quick filters:</span>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all border",
                filters.verifiedOnly
                  ? "border-champagne bg-champagne/15 text-foreground font-semibold shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles size={12} className={filters.verifiedOnly ? "text-champagne-dark dark:text-champagne-light" : ""} />
              Haven Verified
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, freeCancellationOnly: !prev.freeCancellationOnly }))}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all border",
                filters.freeCancellationOnly
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <Check size={12} />
              Free Cancellation
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, instantBookOnly: !prev.instantBookOnly }))}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all border",
                filters.instantBookOnly
                  ? "border-foreground bg-foreground text-background font-semibold shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              Instant Book
            </button>
            {comparingListings.length > 0 && (
              <button
                type="button"
                onClick={() => setCompareDrawerOpen(true)}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-champagne bg-champagne text-black px-3.5 py-1 text-xs font-semibold shadow-sm animate-fade-in"
              >
                <Scale size={12} />
                Compare ({comparingListings.length}/3)
              </button>
            )}
          </div>
        )}

        {/* AI Smart Search banner (for stays) */}
        {["hotels", "homes", "overnight"].includes(productType) && (
          <div className="my-6">
            <SmartSearch onResult={(res) => setAiResult(res && !("error" in res) ? (res as AISmartSearchResult) : null)} />
          </div>
        )}

        {/* RESULTS HEADER & COUNTER */}
        <div className="my-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            {loading ? (
              "Discovering sanctuaries..."
            ) : (
              <span>
                Showing <strong className="font-bold">{results.items.length}</strong>{" "}
                {productType === "hotels"
                  ? "Luxury Hotels"
                  : productType === "homes"
                  ? "Private Homes & Villas"
                  : productType === "day_use"
                  ? "Day Use Sanctuaries"
                  : productType === "activities"
                  ? "Signature Activities"
                  : productType === "transfers"
                  ? "Airport Transfers"
                  : productType === "flights"
                  ? "Available Flights"
                  : productType === "packages"
                  ? "Hotel + Flight Bundles"
                  : "Stays"}
              </span>
            )}
          </p>

          {/* Demo data badge for mock services */}
          {["transfers", "flights", "packages"].includes(productType) && (
            <span className="rounded-full bg-champagne/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-champagne-dark dark:text-champagne-light">
              Demo Data Catalog
            </span>
          )}
        </div>

        {/* 3. RESULTS DISPLAY */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : results.items.length === 0 ? (
          <div className="space-y-12">
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-16 text-center bg-card/30">
              <Search size={32} className="text-muted-foreground" strokeWidth={1.5} />
              <h3 className="mt-4 font-heading text-xl font-medium text-foreground">
                No results match your criteria
              </h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Try adjusting your search location, dates, or clearing your active filters.
              </p>
              <button
                onClick={() => {
                  setFilters(DEFAULT_FILTER_STATE);
                  setSearchQuery("");
                }}
                className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
              >
                Reset All Filters
              </button>
            </div>

            {/* "No results? Try these instead" Suggestion Row */}
            {listings.length > 0 && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-champagne">
                      Curated Alternatives
                    </span>
                    <h3 className="font-heading text-2xl font-medium text-foreground">
                      No results? Try these instead
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setFilters(DEFAULT_FILTER_STATE);
                      setSearchQuery("");
                    }}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    View all stays <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.slice(0, 3).map((listing, i) => (
                    <ListingCard
                      key={`suggested-${listing.id}`}
                      listing={listing}
                      index={i}
                      showTotalPrice={showTotalPrice}
                      isComparing={comparingListings.some((l) => l.id === listing.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* STAYS (Hotels, Homes, Overnight) */}
            {["hotels", "homes", "overnight"].includes(productType) && (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col gap-6"
                }
              >
                {(results.items as Listing[]).map((listing, i) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    index={i}
                    showTotalPrice={showTotalPrice}
                    isComparing={comparingListings.some((l) => l.id === listing.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            )}

            {/* DAY USE STAYS */}
            {productType === "day_use" && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(results.items as Listing[]).map((listing) => (
                  <DayUseStayCard
                    key={listing.id}
                    listing={listing}
                    onBook={handleBookDayUse}
                  />
                ))}
              </div>
            )}

            {/* ACTIVITIES */}
            {productType === "activities" && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(results.items as Activity[]).map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onBook={handleBookActivity}
                  />
                ))}
              </div>
            )}

            {/* AIRPORT TRANSFERS */}
            {productType === "transfers" && (
              <div className="space-y-4">
                {(results.items as Transfer[]).map((transfer) => (
                  <TransferCard
                    key={transfer.id}
                    transfer={transfer}
                    onBook={handleBookTransfer}
                  />
                ))}
              </div>
            )}

            {/* FLIGHTS */}
            {productType === "flights" && (
              <div className="space-y-4">
                {(results.items as Flight[]).map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onBook={handleBookFlight}
                  />
                ))}
              </div>
            )}

            {/* PACKAGES (HOTEL + FLIGHT) */}
            {productType === "packages" && (
              <div className="space-y-6">
                {(results.items as HotelFlightBundle[]).map((bundle) => (
                  <BundleCard
                    key={bundle.id}
                    bundle={bundle}
                    onBook={handleBookBundle}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADAPTIVE FILTER DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="relative w-full max-w-sm h-full border-l border-border bg-background shadow-2xl z-10"
            >
              <AdaptiveProductFilter
                productType={productType}
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTER_STATE)}
                onClose={() => setDrawerOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INSTANT PRODUCT BOOKING MODAL */}
      <ProductBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        data={selectedBookingItem}
      />

      {/* FLOATING COMPARE BAR */}
      {comparingListings.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full border border-border/80 bg-card/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl animate-fade-up">
          <div className="flex -space-x-2">
            {comparingListings.map((l) => (
              <img
                key={l.id}
                src={(l.images || [])[0]}
                alt={l.title}
                className="h-7 w-7 rounded-full object-cover ring-2 ring-background"
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-foreground">
            {comparingListings.length} of 3 selected
          </span>
          <button
            onClick={() => setCompareDrawerOpen(true)}
            className="rounded-full bg-foreground px-3.5 py-1 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
          >
            Compare Now
          </button>
          <button
            onClick={() => setComparingListings([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}

      {/* SIDE-BY-SIDE COMPARISON DRAWER */}
      <CompareDrawer
        isOpen={compareDrawerOpen}
        onClose={() => setCompareDrawerOpen(false)}
        selectedListings={comparingListings}
        onRemove={(id) => setComparingListings((prev) => prev.filter((l) => l.id !== id))}
        onClear={() => {
          setComparingListings([]);
          setCompareDrawerOpen(false);
        }}
        showTotalPrice={showTotalPrice}
      />
    </div>
  );
}
