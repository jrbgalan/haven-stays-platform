import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, Home, Moon, Sun, Compass, Car, Plane, Sparkles,
  MapPin, Calendar, Users, Clock, Search, ArrowLeftRight,
  type LucideIcon,
} from "lucide-react";
import { todayISO, addDays } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProductType } from "@/types/products";

export interface MultiProductSearchBarProps {
  initialProduct?: ProductType;
  className?: string;
  onSearch?: (params: Record<string, string>) => void;
  variant?: "hero" | "compact";
}

export const PRODUCT_TABS: {
  id: ProductType;
  label: string;
  icon: LucideIcon;
  badge?: string;
}[] = [
  { id: "hotels", label: "Hotels", icon: Building2 },
  { id: "homes", label: "Homes & Apts", icon: Home },
  { id: "overnight", label: "Overnight", icon: Moon },
  { id: "day_use", label: "Day Use", icon: Sun, badge: "8h Block" },
  { id: "activities", label: "Activities", icon: Compass },
  { id: "transfers", label: "Transfers", icon: Car },
  { id: "flights", label: "Flights", icon: Plane },
  { id: "packages", label: "Hotel + Flight", icon: Sparkles, badge: "Save 25%" },
];

const POPULAR_DESTINATIONS = [
  "Palawan, Philippines",
  "Cebu, Philippines",
  "Siargao, Philippines",
  "Kyoto, Japan",
  "Tokyo, Japan",
  "Bali, Indonesia",
  "Santorini, Greece",
  "Zermatt, Switzerland",
  "Amalfi, Italy",
  "Florence, Italy",
  "Maldives",
];

const AIRPORTS = [
  { code: "MNL", name: "Manila Ninoy Aquino Int'l (MNL)" },
  { code: "CEB", name: "Mactan-Cebu International (CEB)" },
  { code: "ENI", name: "El Nido Lio Airport (ENI)" },
  { code: "HND", name: "Tokyo Haneda Airport (HND)" },
  { code: "SIN", name: "Singapore Changi (SIN)" },
  { code: "DPS", name: "Bali Ngurah Rai Int'l (DPS)" },
  { code: "JTR", name: "Santorini Thira Airport (JTR)" },
  { code: "ZRH", name: "Zurich Kloten Airport (ZRH)" },
  { code: "FLR", name: "Florence Peretola Airport (FLR)" },
  { code: "CDG", name: "Paris Charles de Gaulle (CDG)" },
];

const TIME_WINDOWS = [
  { id: "09:00 - 17:00", label: "9:00 AM – 5:00 PM (8 Hours)" },
  { id: "12:00 - 20:00", label: "12:00 PM – 8:00 PM (8 Hours)" },
  { id: "14:00 - 22:00", label: "2:00 PM – 10:00 PM (8 Hours)" },
];

export default function MultiProductSearchBar({
  initialProduct = "hotels",
  className = "",
  onSearch,
  variant = "hero",
}: MultiProductSearchBarProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProductType>(initialProduct);

  // Common Stays State
  const [location, setLocation] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(addDays(todayISO(), 3));
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  // Day Use State
  const [dayUseDate, setDayUseDate] = useState(todayISO());
  const [timeWindow, setTimeWindow] = useState("09:00 - 17:00");

  // Activities State
  const [activityDate, setActivityDate] = useState(todayISO());
  const [activityCategory, setActivityCategory] = useState("All");

  // Transfers State
  const [pickupAirport, setPickupAirport] = useState("MNL");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [transferDate, setTransferDate] = useState(todayISO());
  const [transferTime, setTransferTime] = useState("14:30");
  const [transferPassengers, setTransferPassengers] = useState(2);
  const [vehicleType, setVehicleType] = useState("All");

  // Flights State
  const [tripType, setTripType] = useState<"round" | "one_way">("round");
  const [flightFrom, setFlightFrom] = useState("HND");
  const [flightTo, setFlightTo] = useState("MNL");
  const [departDate, setDepartDate] = useState(todayISO());
  const [returnDate, setReturnDate] = useState(addDays(todayISO(), 7));
  const [flightPassengers, setFlightPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("Business");

  // Hotel + Flight State
  const [bundleFrom, setBundleFrom] = useState("HND");
  const [bundleDestination, setBundleDestination] = useState("Palawan, Philippines");

  const swapFlightAirports = () => {
    setFlightFrom(flightTo);
    setFlightTo(flightFrom);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams: Record<string, string> = {
      product: activeTab,
    };

    if (["hotels", "homes", "overnight"].includes(activeTab)) {
      if (location) queryParams.location = location;
      queryParams.checkIn = checkIn;
      queryParams.checkOut = checkOut;
      queryParams.guests = String(guests);
      queryParams.rooms = String(rooms);
    } else if (activeTab === "day_use") {
      if (location) queryParams.location = location;
      queryParams.date = dayUseDate;
      queryParams.timeSlot = timeWindow;
      queryParams.guests = String(guests);
    } else if (activeTab === "activities") {
      if (location) queryParams.location = location;
      queryParams.date = activityDate;
      if (activityCategory !== "All") queryParams.category = activityCategory;
    } else if (activeTab === "transfers") {
      queryParams.airport = pickupAirport;
      if (dropoffAddress) queryParams.dropoff = dropoffAddress;
      queryParams.date = transferDate;
      queryParams.time = transferTime;
      queryParams.passengers = String(transferPassengers);
      if (vehicleType !== "All") queryParams.vehicleType = vehicleType;
    } else if (activeTab === "flights") {
      queryParams.from = flightFrom;
      queryParams.to = flightTo;
      queryParams.tripType = tripType;
      queryParams.depart = departDate;
      if (tripType === "round") queryParams.return = returnDate;
      queryParams.passengers = String(flightPassengers);
      queryParams.cabin = cabinClass;
    } else if (activeTab === "packages") {
      queryParams.from = bundleFrom;
      queryParams.location = bundleDestination;
      queryParams.depart = departDate;
      queryParams.return = returnDate;
      queryParams.guests = String(guests);
      queryParams.rooms = String(rooms);
    }

    if (onSearch) {
      onSearch(queryParams);
    } else {
      const searchParams = new URLSearchParams(queryParams);
      navigate(`/explore?${searchParams.toString()}`);
    }
  };

  // Track horizontal scrolling of tab bar
  const tabsScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkTabsScroll = () => {
    if (!tabsScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsScrollRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  React.useEffect(() => {
    checkTabsScroll();
    const el = tabsScrollRef.current;
    if (el) el.addEventListener("scroll", checkTabsScroll, { passive: true });
    window.addEventListener("resize", checkTabsScroll);
    return () => {
      if (el) el.removeEventListener("scroll", checkTabsScroll);
      window.removeEventListener("resize", checkTabsScroll);
    };
  }, []);

  const scrollTabs = (offset: number) => {
    if (tabsScrollRef.current) {
      tabsScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className={cn("w-full transition-all duration-300", className)}>
      {/* 1. HORIZONTALLY SCROLLABLE PRODUCT TABS WITH SLIDING INDICATOR */}
      <div className="relative mb-3 group">
        {/* Left Scroll Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollTabs(-180)}
            aria-label="Scroll tabs left"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 grid h-7 w-7 place-items-center rounded-full bg-background/95 border border-border shadow-md text-foreground transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-xs">‹</span>
          </button>
        )}

        {/* Scroll Track */}
        <div
          ref={tabsScrollRef}
          onScroll={checkTabsScroll}
          className="flex items-center overflow-x-auto no-scrollbar rounded-full border border-border/80 bg-background/85 p-1.5 shadow-luxe backdrop-blur-xl touch-pan-x snap-x scroll-smooth pl-2 pr-12 sm:pr-16"
        >
          <div className="flex items-center gap-1 min-w-max px-1">
            {PRODUCT_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex shrink-0 snap-start items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-colors duration-200 outline-none select-none sm:px-4 sm:text-sm",
                    isActive
                      ? "text-background font-semibold"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  {/* Active Sliding Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="searchActiveTab"
                      className="absolute inset-0 rounded-full bg-foreground shadow-md"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                    <TabIcon size={15} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                          isActive
                            ? "bg-champagne text-foreground"
                            : "bg-champagne/20 text-champagne-dark dark:text-champagne-light"
                        )}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Edge Gradient Indicators */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-1.5 top-1.5 bottom-1.5 w-8 rounded-l-full bg-gradient-to-r from-background via-background/40 to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-1.5 top-1.5 bottom-1.5 w-10 sm:w-14 rounded-r-full bg-gradient-to-l from-background via-background/50 to-transparent" />
        )}

        {/* Right Scroll Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollTabs(180)}
            aria-label="Scroll tabs right"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 grid h-7 w-7 place-items-center rounded-full bg-background/95 border border-border shadow-md text-foreground transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-xs">›</span>
          </button>
        )}
      </div>

      {/* 2. DYNAMIC SEARCH FORM BOX */}
      <motion.form
        onSubmit={handleSearchSubmit}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        key={activeTab}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="glass relative rounded-3xl border border-border/80 p-3 shadow-2xl backdrop-blur-2xl sm:p-4"
      >
        {/* TAB: HOTELS / HOMES / OVERNIGHT */}
        {["hotels", "homes", "overnight"].includes(activeTab) && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center">
            {/* Where / Destination */}
            <div className="relative sm:col-span-4 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <MapPin size={13} className="text-champagne-dark dark:text-champagne-light" /> Destination
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                placeholder="Where to? (e.g. Palawan, Kyoto)"
                className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground outline-none"
              />

              {/* Autocomplete Suggestions */}
              {showLocationSuggestions && (
                <div
                  onMouseLeave={() => setShowLocationSuggestions(false)}
                  className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-border bg-popover p-2 shadow-2xl backdrop-blur-xl"
                >
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Popular Sanctuaries
                  </p>
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => {
                        setLocation(dest);
                        setShowLocationSuggestions(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-secondary"
                    >
                      <MapPin size={12} className="text-champagne" /> {dest}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Check-In */}
            <div className="sm:col-span-3 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar size={13} className="text-champagne-dark dark:text-champagne-light" /> Check-in
              </label>
              <input
                type="date"
                min={todayISO()}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && new Date(e.target.value) >= new Date(checkOut)) {
                    setCheckOut(addDays(e.target.value, 2));
                  }
                }}
                className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            {/* Check-Out */}
            <div className="sm:col-span-3 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar size={13} className="text-champagne-dark dark:text-champagne-light" /> Check-out
              </label>
              <input
                type="date"
                min={checkIn ? addDays(checkIn, 1) : todayISO()}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            {/* Guests & Submit Button */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <div className="flex-1 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Users size={13} className="text-champagne-dark dark:text-champagne-light" /> Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                    <option key={n} value={n} className="bg-popover text-foreground">
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-foreground text-background shadow-lg transition-transform hover:scale-105 active:scale-95"
                title="Search"
                aria-label="Submit search"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        )}

        {/* TAB: DAY USE STAYS (8-HOUR BLOCKS) */}
        {activeTab === "day_use" && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center">
            <div className="sm:col-span-4 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <MapPin size={13} className="text-champagne-dark dark:text-champagne-light" /> Destination
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or Resort for Day Use"
                className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
              />
            </div>

            <div className="sm:col-span-3 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar size={13} className="text-champagne-dark dark:text-champagne-light" /> Date
              </label>
              <input
                type="date"
                min={todayISO()}
                value={dayUseDate}
                onChange={(e) => setDayUseDate(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            <div className="sm:col-span-3 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Clock size={13} className="text-champagne-dark dark:text-champagne-light" /> Time Slot (8h Block)
              </label>
              <select
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
              >
                {TIME_WINDOWS.map((w) => (
                  <option key={w.id} value={w.id} className="bg-popover text-foreground">
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <div className="flex-1 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
                <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Users size={13} className="text-champagne-dark dark:text-champagne-light" /> Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
                >
                  {[1, 2, 4, 6].map((n) => (
                    <option key={n} value={n} className="bg-popover text-foreground">
                      {n} Guests
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-foreground text-background shadow-lg transition-transform hover:scale-105 active:scale-95"
                title="Search Day Use Stays"
                aria-label="Submit Day Use search"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        )}

        {/* TAB: ACTIVITIES */}
        {activeTab === "activities" && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center">
            <div className="sm:col-span-4 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <MapPin size={13} className="text-champagne-dark dark:text-champagne-light" /> Experience Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. El Nido, Kyoto, Zermatt"
                className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
              />
            </div>

            <div className="sm:col-span-3 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar size={13} className="text-champagne-dark dark:text-champagne-light" /> Preferred Date
              </label>
              <input
                type="date"
                min={todayISO()}
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            <div className="sm:col-span-3 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Compass size={13} className="text-champagne-dark dark:text-champagne-light" /> Category
              </label>
              <select
                value={activityCategory}
                onChange={(e) => setActivityCategory(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
              >
                {["All", "Tours", "Food", "Adventure", "Wellness", "Culture"].map((cat) => (
                  <option key={cat} value={cat} className="bg-popover text-foreground">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-semibold text-background shadow-lg transition-transform hover:scale-102 active:scale-95"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB: AIRPORT TRANSFERS */}
        {activeTab === "transfers" && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center">
            <div className="sm:col-span-4 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Car size={13} className="text-champagne-dark dark:text-champagne-light" /> Pickup Airport
              </label>
              <select
                value={pickupAirport}
                onChange={(e) => setPickupAirport(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
              >
                {AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code} className="bg-popover text-foreground">
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <MapPin size={13} className="text-champagne-dark dark:text-champagne-light" /> Destination Hotel / Villa
              </label>
              <input
                type="text"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                placeholder="e.g. Grand Hyatt, Villa Serenissima"
                className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
              />
            </div>

            <div className="sm:col-span-3 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Clock size={13} className="text-champagne-dark dark:text-champagne-light" /> Date & Flight Arrival
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  min={todayISO()}
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-2/3 bg-transparent text-xs font-semibold text-foreground outline-none"
                />
                <input
                  type="time"
                  value={transferTime}
                  onChange={(e) => setTransferTime(e.target.value)}
                  className="w-1/3 bg-transparent text-xs font-semibold text-foreground outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-semibold text-background shadow-lg transition-transform hover:scale-102 active:scale-95"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB: FLIGHTS */}
        {activeTab === "flights" && (
          <div className="space-y-3">
            {/* Trip Type & Class Sub-bar */}
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-3 text-xs font-medium">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === "round"}
                    onChange={() => setTripType("round")}
                    className="accent-champagne"
                  />
                  <span>Round Trip</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === "one_way"}
                    onChange={() => setTripType("one_way")}
                    className="accent-champagne"
                  />
                  <span>One Way</span>
                </label>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value)}
                  className="rounded-full border border-border bg-card/60 px-3 py-1 font-medium text-foreground outline-none"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                  <option value="First">First Class</option>
                </select>
                <span className="rounded-full bg-champagne/20 px-2 py-0.5 text-[10px] font-bold text-champagne-dark dark:text-champagne-light">
                  Demo data
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center">
              {/* Origin and Destination with Swap */}
              <div className="sm:col-span-5 flex items-center gap-1.5">
                <div className="flex-1 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">From</label>
                  <select
                    value={flightFrom}
                    onChange={(e) => setFlightFrom(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
                  >
                    {AIRPORTS.map((a) => (
                      <option key={a.code} value={a.code} className="bg-popover text-foreground">
                        {a.code} - {a.name.split("(")[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={swapFlightAirports}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-card hover:bg-secondary transition-colors"
                  title="Swap airports"
                >
                  <ArrowLeftRight size={14} className="text-muted-foreground" />
                </button>

                <div className="flex-1 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">To</label>
                  <select
                    value={flightTo}
                    onChange={(e) => setFlightTo(e.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
                  >
                    {AIRPORTS.map((a) => (
                      <option key={a.code} value={a.code} className="bg-popover text-foreground">
                        {a.code} - {a.name.split("(")[0]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="sm:col-span-4 flex items-center gap-2">
                <div className="flex-1 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Depart</label>
                  <input
                    type="date"
                    min={todayISO()}
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="mt-1 w-full bg-transparent text-xs font-semibold text-foreground outline-none"
                  />
                </div>

                {tripType === "round" && (
                  <div className="flex-1 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Return</label>
                    <input
                      type="date"
                      min={departDate}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="mt-1 w-full bg-transparent text-xs font-semibold text-foreground outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-semibold text-background shadow-lg transition-transform hover:scale-102 active:scale-95"
                >
                  <Search size={18} />
                  <span>Search Flights</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HOTEL + FLIGHT BUNDLE */}
        {activeTab === "packages" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 pt-1 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-champagne-dark dark:text-champagne-light">
                <Sparkles size={13} /> Exclusive Package: Combined Stay + Private Aviation / Flight
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                Save up to 30%
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center">
              <div className="sm:col-span-3 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Flying From</label>
                <select
                  value={bundleFrom}
                  onChange={(e) => setBundleFrom(e.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
                >
                  {AIRPORTS.map((a) => (
                    <option key={a.code} value={a.code} className="bg-popover text-foreground">
                      {a.code} ({a.name.split("(")[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Destination Stay</label>
                <input
                  type="text"
                  value={bundleDestination}
                  onChange={(e) => setBundleDestination(e.target.value)}
                  placeholder="e.g. Palawan, Santorini, Maldives"
                  className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground outline-none"
                />
              </div>

              <div className="sm:col-span-3 rounded-2xl bg-card/60 p-2.5 transition-colors focus-within:bg-card">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Dates</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    min={todayISO()}
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-1/2 bg-transparent text-xs font-semibold text-foreground outline-none"
                  />
                  <input
                    type="date"
                    min={departDate}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-1/2 bg-transparent text-xs font-semibold text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-5 text-sm font-semibold text-background shadow-lg transition-transform hover:scale-102 active:scale-95"
                >
                  <Search size={18} />
                  <span>Find Bundle</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.form>
    </div>
  );
}

