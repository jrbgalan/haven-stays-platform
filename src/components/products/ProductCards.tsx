import React from "react";
import {
  Clock, Users, Star, Luggage, Plane,
  ArrowRight, Check, MapPin, Sun
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Activity, Transfer, Flight, HotelFlightBundle } from "@/types/products";
import type { Listing } from "@/types/listing";

// 1. ACTIVITY CARD
export function ActivityCard({
  activity,
  onBook,
}: {
  activity: Activity;
  onBook: (act: Activity) => void;
}) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/75 bg-card shadow-luxe transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={activity.image}
          alt={activity.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 scrim-card" />
        <span className="absolute left-4 top-4 rounded-full bg-foreground/80 px-3 py-1 text-xs font-semibold text-background backdrop-blur">
          {activity.category}
        </span>
        <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white">
          {activity.city}, {activity.country}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock size={13} /> {activity.duration}
          </span>
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Star size={12} className="fill-accent text-accent" /> {activity.rating} ({activity.reviewCount})
          </span>
        </div>

        <h3 className="mt-2.5 font-heading text-lg font-medium tracking-tight text-foreground line-clamp-2">
          {activity.title}
        </h3>

        <p className="mt-2 flex-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {activity.description}
        </p>

        {activity.highlights && activity.highlights.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
            {activity.highlights.slice(0, 2).map((h, i) => (
              <span key={i} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground">
                • {h}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <div>
            <span className="text-[11px] text-muted-foreground">From</span>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(activity.pricePerPerson)}
              <span className="text-xs font-normal text-muted-foreground"> / guest</span>
            </p>
          </div>

          <button
            onClick={() => onBook(activity)}
            className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-transform hover:scale-102 active:scale-95 shadow-sm"
          >
            <span>Book Activity</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. TRANSFER CARD
export function TransferCard({
  transfer,
  onBook,
}: {
  transfer: Transfer;
  onBook: (trans: Transfer) => void;
}) {
  return (
    <div className="group flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-border/75 bg-card shadow-luxe transition-all duration-300 hover:shadow-luxe-lg">
      <div className="relative aspect-[16/10] sm:aspect-auto sm:w-64 overflow-hidden bg-muted shrink-0">
        <img
          src={transfer.image}
          alt={transfer.vehicleModel}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 scrim-card sm:hidden" />
        <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-2.5 py-0.5 text-[10px] font-semibold text-background backdrop-blur">
          {transfer.vehicleType}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-champagne/20 px-2 py-0.5 text-[9px] font-bold uppercase text-champagne-dark dark:text-champagne-light">
          Demo data
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {transfer.airportName} ({transfer.airportCode})
            </span>
            <span className="text-xs text-muted-foreground">{transfer.city}, {transfer.country}</span>
          </div>

          <h3 className="mt-1 font-heading text-xl font-medium text-foreground">
            {transfer.vehicleModel}
          </h3>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <Users size={14} /> Up to {transfer.capacityPassengers} Passengers
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Luggage size={14} /> {transfer.capacityLuggage} Large Bags
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {transfer.features.map((feat, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1 text-[11px] text-foreground/80">
                <Check size={11} className="text-champagne" /> {feat}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <div>
            <span className="text-[11px] text-muted-foreground">Private Transfer Rate</span>
            <p className="text-xl font-semibold text-foreground">
              {formatCurrency(transfer.basePrice)}
              <span className="text-xs font-normal text-muted-foreground"> / one-way</span>
            </p>
          </div>

          <button
            onClick={() => onBook(transfer)}
            className="flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background transition-transform hover:scale-102 active:scale-95 shadow-sm"
          >
            <span>Book Transfer</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. FLIGHT CARD
export function FlightCard({
  flight,
  onBook,
}: {
  flight: Flight;
  onBook: (fl: Flight) => void;
}) {
  return (
    <div className="group rounded-3xl border border-border/75 bg-card p-6 shadow-luxe transition-all duration-300 hover:shadow-luxe-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Airline Info */}
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary font-heading font-bold text-base text-foreground shadow-sm">
            {flight.airlineLogo || "FL"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground text-sm">{flight.airline}</h4>
              <span className="rounded-full bg-champagne/20 px-2 py-0.5 text-[9px] font-bold uppercase text-champagne-dark dark:text-champagne-light">
                Demo data
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{flight.flightNumber} · {flight.aircraft || "Modern Aircraft"}</p>
          </div>
        </div>

        {/* Flight Times & Routing */}
        <div className="flex items-center gap-6 text-center sm:gap-10">
          <div>
            <p className="text-xl font-heading font-medium text-foreground">{flight.departureTime}</p>
            <p className="text-xs font-semibold text-muted-foreground">{flight.originCode}</p>
            <p className="text-[11px] text-muted-foreground">{flight.originCity}</p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[11px] text-muted-foreground font-medium">{flight.duration}</span>
            <div className="relative my-1 w-24 sm:w-32 border-t border-dashed border-border flex items-center justify-center">
              <Plane size={13} className="text-champagne" />
            </div>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}
            </span>
          </div>

          <div>
            <p className="text-xl font-heading font-medium text-foreground">{flight.arrivalTime}</p>
            <p className="text-xs font-semibold text-muted-foreground">{flight.destinationCode}</p>
            <p className="text-[11px] text-muted-foreground">{flight.destinationCity}</p>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between border-t border-border/60 pt-4 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end sm:text-right">
          <div>
            <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
              {flight.cabinClass}
            </span>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {formatCurrency(flight.price)}
              <span className="text-xs font-normal text-muted-foreground"> / pax</span>
            </p>
          </div>

          <button
            onClick={() => onBook(flight)}
            className="mt-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background transition-transform hover:scale-102 active:scale-95 shadow-sm"
          >
            Select Flight
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. HOTEL + FLIGHT BUNDLE CARD
export function BundleCard({
  bundle,
  onBook,
}: {
  bundle: HotelFlightBundle;
  onBook: (pkg: HotelFlightBundle) => void;
}) {
  return (
    <div className="group flex flex-col md:flex-row overflow-hidden rounded-3xl border border-border/75 bg-card shadow-luxe transition-all duration-300 hover:shadow-luxe-lg">
      <div className="relative aspect-[16/10] md:aspect-auto md:w-80 overflow-hidden bg-muted shrink-0">
        <img
          src={(bundle.listing.images || [])[0]}
          alt={bundle.listing.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 scrim-card md:hidden" />
        <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-2.5 py-0.5 text-[10px] font-semibold text-background backdrop-blur">
          Stay + Flight Package
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
          Save {bundle.savingsPercent}%
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-champagne-dark dark:text-champagne-light">
              {bundle.badge || "Curated Bundle"}
            </span>
            <span className="rounded-full bg-champagne/20 px-2 py-0.5 text-[9px] font-bold text-champagne-dark dark:text-champagne-light">
              Demo data
            </span>
          </div>

          <h3 className="mt-1 font-heading text-2xl font-medium text-foreground">
            {bundle.listing.title}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
            <MapPin size={12} /> {bundle.listing.city}, {bundle.listing.country} · {bundle.nights} Nights Included
          </p>

          {/* Flight Details Block */}
          <div className="mt-4 rounded-2xl border border-border/60 bg-secondary/40 p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Plane size={13} className="text-champagne" /> {bundle.flight.airline} ({bundle.flight.cabinClass})
              </span>
              <span className="text-muted-foreground">{bundle.flight.flightNumber}</span>
            </div>
            <p className="mt-1 text-muted-foreground">
              {bundle.flight.originCity} ({bundle.flight.originCode}) → {bundle.flight.destinationCity} ({bundle.flight.destinationCode}) · Non-stop
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <div>
            <span className="text-xs line-through text-muted-foreground">
              {formatCurrency(bundle.originalPrice)}
            </span>
            <p className="text-2xl font-semibold text-foreground">
              {formatCurrency(bundle.bundlePrice)}
              <span className="text-xs font-normal text-muted-foreground"> / total bundle</span>
            </p>
          </div>

          <button
            onClick={() => onBook(bundle)}
            className="flex items-center gap-1.5 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-102 active:scale-95 shadow-sm"
          >
            <span>Book Bundle</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. DAY USE STAY CARD (8-HOUR BLOCKS)
export function DayUseStayCard({
  listing,
  onBook,
}: {
  listing: Listing;
  onBook: (listing: Listing) => void;
}) {
  const dayPrice = listing.dayUsePricePerBlock || Math.round(listing.pricePerNight * 0.45);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/75 bg-card shadow-luxe transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe-lg">
      <div className="relative aspect-[16/11] overflow-hidden bg-muted">
        <img
          src={(listing.images || [])[0]}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 scrim-card" />
        <span className="absolute left-3 top-3 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300 border border-amber-500/30 backdrop-blur">
          Day Use (8h Block)
        </span>
        <span className="absolute bottom-3 left-3 text-xs font-semibold text-white">
          {listing.city}, {listing.country}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-foreground/80">
            {listing.propertyType ? listing.propertyType.toUpperCase() : "SANCTUARY"}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Star size={12} className="fill-accent text-accent" /> {listing.rating?.toFixed(1)}
          </div>
        </div>

        <h3 className="mt-2.5 font-heading text-xl font-medium text-foreground line-clamp-1">
          {listing.title}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Sun size={13} className="text-amber-500" />
          <span>Hours: 9:00 AM – 5:00 PM or 12:00 PM – 8:00 PM</span>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <div>
            <span className="text-[11px] text-muted-foreground">8-Hour Access Rate</span>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(dayPrice)}
              <span className="text-xs font-normal text-muted-foreground"> / block</span>
            </p>
          </div>

          <button
            onClick={() => onBook(listing)}
            className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-transform hover:scale-102 active:scale-95 shadow-sm"
          >
            <span>Book Day Use</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

