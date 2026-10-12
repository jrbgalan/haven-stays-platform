import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, MapPin, Bath, ArrowLeft, ChevronRight, CalendarCheck, Wifi, ShieldCheck, Award, MessageSquare } from "lucide-react";
import { client } from "@/api/client";
import SmartImage from "@/components/ui/SmartImage";
import StarRating from "@/components/ui/StarRating";
import SaveButton from "@/components/listings/SaveButton";
import DateRangePicker from "@/components/booking/DateRangePicker";
import GalleryLightbox from "@/components/listings/GalleryLightbox";
import SectionReveal from "@/components/ui/SectionReveal";
import AroundThisStay from "@/components/places/AroundThisStay";
import SimilarStays from "@/components/places/SimilarStays";
import { formatCurrency, nightsBetween, calcTotal } from "@/lib/format";
import { cn } from "@/lib/utils";

const AMENITY_ICONS = {
  "Infinity Pool": Bath, "Heated Pool": Bath, Pool: Bath, "Private Beach": MapPin, "Beach Access": MapPin,
  "Hot Tub": Bath, Sauna: Bath, Spa: Bath, Fireplace: Star, "Ocean View": Star, "Mountain View": Star,
  "Chef's Kitchen": Award, "Wine Cellar": Award, "Home Theater": Star, Gym: Award, "Private Chef": Award,
  Concierge: ShieldCheck, "EV Charger": Wifi, "Rooftop Terrace": Star, Garden: Star, "Ski-in/Ski-out": Star,
  Library: Star, "Smart Home": Wifi, "Air Conditioning": Wifi, Wifi: Wifi,
};

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(2);
  const [lightbox, setLightbox] = useState(null);
  const [stayMode, setStayMode] = useState<"overnight" | "day_use">("overnight");
  const [dayUseDate, setDayUseDate] = useState<string | null>(null);
  const [dayUseTimeSlot, setDayUseTimeSlot] = useState("09:00 - 17:00");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      client.entities.Listing.get(id).catch(() => null),
      client.entities.Review.filter({ listingId: id }).catch(() => []),
      client.functions.invoke("getAvailability", { listingId: id }).then((r) => r.data).catch(() => ({ bookedRanges: [] })),
    ]).then(([l, revs, avail]) => {
      setListing(l);
      setReviews(revs || []);
      setBookedRanges(avail?.bookedRanges || []);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16 text-center">
        <h1 className="font-heading text-2xl font-medium">Stay not found</h1>
        <p className="text-muted-foreground">This listing may have been removed.</p>
        <Link to="/explore" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Back to explore</Link>
      </div>
    );
  }

  const images = listing.images || [];
  const nights = nightsBetween(checkIn, checkOut);

  const dayUsePrice = (listing as any).dayUsePricePerBlock || Math.round((listing as any).pricePerNight * 0.45);
  const price = calcTotal((listing as any).pricePerNight, nights);
  const avgRating = reviews.length
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : (listing as any).rating?.toFixed(1);

  const reserve = () => {
    if (stayMode === "day_use") {
      if (!dayUseDate) return;
      const params = new URLSearchParams({
        stayType: "day_use",
        date: dayUseDate,
        timeSlot: dayUseTimeSlot,
        guests: String(guests),
      });
      navigate(`/booking/${id}?${params.toString()}`);
      return;
    }

    if (!checkIn || !checkOut) return;
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
    navigate(`/booking/${id}?${params.toString()}`);
  };

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
        <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={15} /> Back to all stays
        </Link>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-7xl px-5 pt-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">{listing.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star size={13} className="fill-accent text-accent" /> {avgRating} · {reviews.length} reviews</span>
              <span className="flex items-center gap-1"><MapPin size={13} /> {listing.location}, {listing.country}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SaveButton listingId={id} className="border border-border" />
            <button
              onClick={() => navigate(`/messages?listing=${id}`)}
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <MessageSquare size={15} /> Message host
            </button>
          </div>
        </div>
      </div>

      {/* Bento gallery */}
      <div className="mx-auto mt-6 max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:gap-3" style={{ height: "clamp(320px, 48vh, 520px)" }}>
          <button onClick={() => setLightbox(0)} className="group relative col-span-4 row-span-2 sm:col-span-2">
            <SmartImage src={images[0]} alt={listing.title} className="h-full w-full" imgClassName="group-hover:scale-105" />
            <HoverHint />
          </button>
          {images.slice(1, 5).map((img, i) => (
            <button key={i} onClick={() => setLightbox(i + 1)} className="group relative hidden sm:block">
              <SmartImage src={img} alt="" className="h-full w-full" imgClassName="group-hover:scale-105" />
            </button>
          ))}
        </div>
        <button onClick={() => setLightbox(0)} className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary sm:hidden">
          Show all {images.length} photos <ChevronRight size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="mx-auto mt-12 grid max-w-7xl gap-12 px-5 pb-32 sm:px-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Host + quick facts */}
          <SectionReveal>
            <div className="flex items-start justify-between border-b border-border pb-6">
              <div>
                <h2 className="font-heading text-xl font-medium">
                  {listing.category} hosted by {listing.hostName}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {listing.maxGuests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} baths
                </p>
              </div>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-foreground text-lg font-medium text-background">
                {listing.hostName?.charAt(0)}
              </div>
            </div>
          </SectionReveal>

          {/* Quick highlights */}
          <SectionReveal delay={0.05}>
            <div className="grid gap-4 border-b border-border py-6 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, t: "Verified & insured", d: "Backed by Haven's guarantee" },
                { icon: CalendarCheck, t: "Flexible viewing", d: "Book a tour or video call" },
                { icon: Award, t: "Rare find", d: "Among our most sought-after" },
              ].map((h, i) => (
                <div key={i} className="flex gap-3">
                  <h.icon size={20} className="shrink-0 text-champagne" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-medium">{h.t}</p>
                    <p className="text-xs text-muted-foreground">{h.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>

          {/* Description */}
          <SectionReveal delay={0.1}>
            <div className="border-b border-border py-6">
              <h3 className="mb-3 font-heading text-lg font-medium">About this stay</h3>
              <p className="whitespace-pre-line leading-relaxed text-foreground/80">{listing.description}</p>
            </div>
          </SectionReveal>

          {/* Amenities */}
          <SectionReveal delay={0.1}>
            <div className="border-b border-border py-6">
              <h3 className="mb-4 font-heading text-lg font-medium">What this place offers</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(listing.amenities || []).map((a) => {
                  const Icon = AMENITY_ICONS[a] ?? Star;
                  return (
                    <div key={a} className="flex items-center gap-2.5 text-sm">
                      <Icon size={17} className="text-muted-foreground" strokeWidth={1.5} />
                      {a}
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionReveal>

          {/* Map placeholder */}
          <SectionReveal delay={0.1}>
            <div className="border-b border-border py-6">
              <h3 className="mb-4 font-heading text-lg font-medium">Where you'll be</h3>
              <div className="relative h-64 overflow-hidden rounded-2xl border border-border bg-secondary">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent)/0.12),transparent_60%)]" />
                <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-foreground text-background shadow-luxe">
                    <MapPin size={18} />
                  </div>
                  <p className="mt-2 text-sm font-medium">{listing.location}, {listing.country}</p>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Reviews */}
          <SectionReveal delay={0.1}>
            <div className="py-6">
              <div className="flex items-center gap-2">
                <Star size={18} className="fill-accent text-accent" />
                <h3 className="font-heading text-lg font-medium">{avgRating} · {reviews.length} reviews</h3>
              </div>
              {reviews.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No reviews yet. Be the first to stay.</p>
              ) : (
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-medium">
                          {r.authorName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{r.authorName}</p>
                          <StarRating value={r.rating} size={11} />
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionReveal>

          {/* Around this stay */}
          <AroundThisStay listingId={id} />

          {/* Similar stays */}
          <SimilarStays listing={listing} />
        </div>

        {/* Booking card (desktop sticky) */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <BookingCard
              listing={listing}
              bookedRanges={bookedRanges}
              checkIn={checkIn}
              checkOut={checkOut}
              setRange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }}
              guests={guests}
              setGuests={setGuests}
              nights={nights}
              price={price}
              onReserve={reserve}
              onSchedule={() => navigate(`/appointment/${id}`)}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border glass px-5 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold">{formatCurrency(listing.pricePerNight)} <span className="text-sm font-normal text-muted-foreground">night</span></p>
            {checkIn && checkOut ? (
              <p className="text-xs text-muted-foreground">{formatCurrency(price.total)} total · {nights} nights</p>
            ) : (
              <p className="text-xs text-muted-foreground">Select dates to reserve</p>
            )}
          </div>
          <button
            onClick={() => (checkIn && checkOut ? reserve() : document.getElementById("mobile-booking")?.scrollIntoView({ behavior: "smooth" }))}
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
          >
            {checkIn && checkOut ? "Reserve" : "Choose dates"}
          </button>
        </div>
      </div>

      {/* Mobile booking section */}
      <div id="mobile-booking" className="px-5 pb-8 sm:px-8 lg:hidden">
        <BookingCard
          listing={listing}
          bookedRanges={bookedRanges}
          checkIn={checkIn}
          checkOut={checkOut}
          setRange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }}
          guests={guests}
          setGuests={setGuests}
          nights={nights}
          price={price}
          onReserve={reserve}
          onSchedule={() => navigate(`/appointment/${id}`)}
        />
      </div>

      {lightbox !== null && (
        <GalleryLightbox
          images={images}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onIndex={setLightbox}
        />
      )}
    </div>
  );
}

function HoverHint() {
  return (
    <div className="absolute bottom-3 right-3 rounded-full bg-foreground/85 px-3 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
      Show photos
    </div>
  );
}

function BookingCard({
  listing,
  bookedRanges,
  checkIn,
  checkOut,
  setRange,
  guests,
  setGuests,
  nights,
  price,
  stayMode,
  setStayMode,
  dayUseDate,
  setDayUseDate,
  dayUseTimeSlot,
  setDayUseTimeSlot,
  dayUsePrice,
  onReserve,
  onSchedule,
}: any) {
  const hasDayUse = listing.stayType === "both" || listing.stayType === "day_use";
  const isDayUse = stayMode === "day_use";
  const canReserve = isDayUse ? Boolean(dayUseDate) : Boolean(checkIn && checkOut && nights >= 1);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe">
      {/* Stay Mode Switcher if day use is enabled */}
      {hasDayUse && (
        <div className="mb-5 flex rounded-full border border-border p-1 bg-secondary/50">
          <button
            type="button"
            onClick={() => setStayMode("overnight")}
            className={cn(
              "flex-1 rounded-full py-1.5 text-xs font-medium transition-all",
              !isDayUse ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Overnight Stay
          </button>
          <button
            type="button"
            onClick={() => setStayMode("day_use")}
            className={cn(
              "flex-1 rounded-full py-1.5 text-xs font-medium transition-all",
              isDayUse ? "bg-foreground text-background font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Day Use (8h Block)
          </button>
        </div>
      )}

      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-semibold">
            {formatCurrency(isDayUse ? dayUsePrice : listing.pricePerNight)}
          </span>
          <span className="text-muted-foreground">{isDayUse ? " / 8h block" : " / night"}</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star size={13} className="fill-accent text-accent" />
          <span className="font-medium">{listing.rating?.toFixed(1)}</span>
        </div>
      </div>

      {isDayUse ? (
        /* DAY USE FORM */
        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-border p-3 bg-secondary/20">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Access Date
            </label>
            <input
              type="date"
              value={dayUseDate || ""}
              onChange={(e) => setDayUseDate(e.target.value)}
              className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
            />
          </div>

          <div className="rounded-2xl border border-border p-3 bg-secondary/20">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              8-Hour Time Window
            </label>
            <select
              value={dayUseTimeSlot}
              onChange={(e) => setDayUseTimeSlot(e.target.value)}
              className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
            >
              <option value="09:00 - 17:00">9:00 AM – 5:00 PM (Day block)</option>
              <option value="12:00 - 20:00">12:00 PM – 8:00 PM (Twilight block)</option>
              <option value="14:00 - 22:00">2:00 PM – 10:00 PM (Evening block)</option>
            </select>
          </div>

          <div className="rounded-2xl border border-border p-3 bg-secondary/20">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-1 w-full bg-transparent text-sm outline-none"
            >
              {Array.from({ length: listing.maxGuests || 6 }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} {i === 0 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        /* OVERNIGHT FORM */
        <>
          <div className="mt-5 rounded-2xl border border-border">
            <div className="grid grid-cols-2 border-b border-border">
              <div className="border-r border-border p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide">Check in</p>
                <p className="text-sm text-muted-foreground">{checkIn || "Add date"}</p>
              </div>
              <div className="p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide">Check out</p>
                <p className="text-sm text-muted-foreground">{checkOut || "Add date"}</p>
              </div>
            </div>
            <div className="p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide">Guests</p>
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full bg-transparent text-sm outline-none">
                {Array.from({ length: listing.maxGuests }).map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1} {i === 0 ? "guest" : "guests"}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <DateRangePicker bookedRanges={bookedRanges} checkIn={checkIn} checkOut={checkOut} onChange={setRange} />
          </div>
        </>
      )}

      {canReserve && (
        <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
          <Row
            label={isDayUse ? "Day Use 8h Block Rate" : `${formatCurrency(listing.pricePerNight)} × ${nights} nights`}
            value={formatCurrency(isDayUse ? dayUsePrice : listing.pricePerNight * nights)}
          />
          <Row label="Cleaning fee" value={formatCurrency(isDayUse ? Math.round(dayUsePrice * 0.1) : price.cleaning)} />
          <Row label="Service fee" value={formatCurrency(isDayUse ? Math.round(dayUsePrice * 0.05) : price.service)} />
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(isDayUse ? Math.round(dayUsePrice * 1.15) : price.total)}</span>
          </div>
        </div>
      )}

      <button
        onClick={onReserve}
        disabled={!canReserve}
        className={cn(
          "mt-5 w-full rounded-full py-3.5 text-sm font-medium transition-all",
          canReserve
            ? "bg-foreground text-background hover:scale-[1.01] active:scale-95 shadow-md"
            : "cursor-not-allowed bg-muted text-muted-foreground"
        )}
      >
        {canReserve ? (isDayUse ? "Reserve Day Use" : "Reserve Stay") : (isDayUse ? "Select access date" : "Select dates")}
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">You won't be charged yet</p>

      <button onClick={onSchedule} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-medium hover:bg-secondary">
        <CalendarCheck size={15} /> Schedule a viewing
      </button>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <Link to="/cancellation" className="hover:text-foreground">Cancellation policy</Link>
        <Link to={`/report?listing=${listing.id}`} className="hover:text-foreground">Report this listing</Link>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-foreground/80">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}