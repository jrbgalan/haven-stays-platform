import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarCheck, Clock, X, MapPin, Video, CheckCircle2, CalendarX,
  Plane, Car, Compass, Sparkles, Building2, Home, Sun, Moon,
  type LucideIcon,
} from "lucide-react";
import { client } from "@/api/client";
import { useToast } from "@/components/ui/use-toast";
import SmartImage from "@/components/ui/SmartImage";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProductBooking } from "@/types/products";

const STATUS = {
  confirmed: { label: "Confirmed", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  pending: { label: "Pending", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400", icon: Clock },
  cancelled: { label: "Cancelled", cls: "bg-rose-500/15 text-rose-600 dark:text-rose-400", icon: X },
};

const PRODUCT_BADGE: Record<string, { label: string; icon: LucideIcon; color: string }> = {
  hotels: { label: "Hotel Stay", icon: Building2, color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  homes: { label: "Private Home", icon: Home, color: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" },
  overnight: { label: "Overnight Stay", icon: Moon, color: "bg-purple-500/15 text-purple-600 dark:text-purple-400" },
  day_use: { label: "Day Use (8h)", icon: Sun, color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  activities: { label: "Activity", icon: Compass, color: "bg-teal-500/15 text-teal-600 dark:text-teal-400" },
  transfers: { label: "Airport Transfer", icon: Car, color: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400" },
  flights: { label: "Flight", icon: Plane, color: "bg-sky-500/15 text-sky-600 dark:text-sky-400" },
  packages: { label: "Hotel + Flight", icon: Sparkles, color: "bg-champagne/20 text-champagne-dark dark:text-champagne-light" },
};

export default function Dashboard() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"trips" | "appts">("trips");
  const [bookings, setBookings] = useState<any[]>([]);
  const [productBookings, setProductBookings] = useState<ProductBooking[]>([]);
  const [appts, setAppts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [b, pb, a] = await Promise.all([
        client.entities.Booking.filter({}).catch(() => []),
        client.entities.ProductBooking.filter({}).catch(() => []),
        client.entities.Appointment.filter({}).catch(() => []),
      ]);

      setBookings(b.sort((x: any, y: any) => new Date(y.checkIn || y.createdAt).getTime() - new Date(x.checkIn || x.createdAt).getTime()));
      setProductBookings(pb.sort((x: ProductBooking, y: ProductBooking) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()));
      setAppts(a.sort((x: any, y: any) => new Date(y.date).getTime() - new Date(x.date).getTime()));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const cancelStayBooking = async (id: string) => {
    await client.entities.Booking.update(id, { status: "cancelled" });
    toast({ title: "Stay booking cancelled" });
    loadData();
  };

  const cancelProductBooking = async (id: string) => {
    await client.entities.ProductBooking.update(id, { status: "cancelled" });
    toast({ title: "Reservation cancelled" });
    loadData();
  };

  const cancelAppt = async (id: string) => {
    await client.entities.Appointment.update(id, { status: "cancelled" });
    toast({ title: "Viewing cancelled" });
    loadData();
  };

  // Combine standard stay bookings with multi-product bookings
  const unifiedBookings = [
    ...bookings.map((b) => ({
      id: b.id,
      isLegacy: true,
      productType: "overnight",
      title: b.listingTitle,
      subtitle: `${b.guests || 2} Guests`,
      image: b.listingImage,
      dateInfo: `${formatDate(b.checkIn)} → ${formatDate(b.checkOut)} (${b.nights || 1} nights)`,
      totalPrice: b.totalPrice,
      status: b.status,
      reference: b.reference,
      link: `/listing/${b.listingId}`,
      createdAt: b.createdAt || b.checkIn,
    })),
    ...productBookings.map((pb) => ({
      id: pb.id,
      isLegacy: false,
      productType: pb.productType,
      title: pb.itemTitle,
      subtitle: pb.itemSubtitle || `${pb.passengersOrGuests} Guests`,
      image: pb.itemImage,
      dateInfo: pb.timeSlot ? `${pb.dateOrTime} · Slot: ${pb.timeSlot}` : pb.dateOrTime,
      totalPrice: pb.totalPrice,
      status: pb.status,
      reference: pb.referenceCode,
      link: pb.productType === "hotels" || pb.productType === "homes" || pb.productType === "overnight" ? `/listing/${pb.itemId}` : "/explore",
      createdAt: pb.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const upcomingBookings = unifiedBookings.filter((b) => b.status !== "cancelled");
  const pastBookings = unifiedBookings.filter((b) => b.status === "cancelled");

  const today = new Date().toISOString().split("T")[0];
  const upcomingAppts = appts.filter((a) => a.date >= today && a.status !== "cancelled");
  const pastAppts = appts.filter((a) => a.date < today || a.status === "cancelled");

  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">Your Journeys</h1>
        <p className="mt-2 text-muted-foreground">
          Stays, flights, transfers, and signature activities all in one place.
        </p>

        <div className="mt-8 inline-flex rounded-full border border-border p-1 bg-card/60 backdrop-blur">
          {[
            { id: "trips", label: "My Trips & Bookings", icon: CalendarCheck, count: upcomingBookings.length },
            { id: "appts", label: "Private Viewings", icon: MapPin, count: upcomingAppts.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors",
                tab === t.id ? "bg-foreground text-background font-semibold" : "text-foreground/75 hover:bg-secondary"
              )}
            >
              <t.icon size={15} /> {t.label}
              {t.count > 0 && (
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", tab === t.id ? "bg-background/20" : "bg-secondary")}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
          </div>
        ) : tab === "trips" ? (
          <div className="mt-8 space-y-10">
            {/* Active & Confirmed */}
            <div>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active & Upcoming Reservations ({upcomingBookings.length})
              </h2>

              {upcomingBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-16 text-center">
                  <CalendarX size={32} className="text-muted-foreground" strokeWidth={1.5} />
                  <p className="mt-3 text-sm text-muted-foreground">No upcoming reservations yet.</p>
                  <Link
                    to="/explore"
                    className="mt-4 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background hover:opacity-90"
                  >
                    Explore Stays & Products
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {upcomingBookings.map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                    >
                      <UnifiedTripCard
                        item={b}
                        onCancel={() => (b.isLegacy ? cancelStayBooking(b.id) : cancelProductBooking(b.id))}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Cancelled / Past */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cancelled / Past ({pastBookings.length})
                </h2>
                <div className="grid gap-4 opacity-70">
                  {pastBookings.map((b) => (
                    <UnifiedTripCard key={b.id} item={b} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            <div>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Upcoming Viewings ({upcomingAppts.length})
              </h2>
              {upcomingAppts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-16 text-center">
                  <CalendarX size={32} className="text-muted-foreground" strokeWidth={1.5} />
                  <p className="mt-3 text-sm text-muted-foreground">No upcoming property viewings.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {upcomingAppts.map((a) => (
                    <ApptCard key={a.id} item={a} onCancel={() => cancelAppt(a.id)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UnifiedTripCard({
  item,
  onCancel,
}: {
  item: any;
  onCancel?: () => void;
}) {
  const st = STATUS[item.status] || STATUS.pending;
  const badgeInfo = PRODUCT_BADGE[item.productType] || PRODUCT_BADGE.overnight;
  const BadgeIcon = badgeInfo.icon;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card p-4 sm:flex-row sm:items-center shadow-luxe transition-all">
      {item.image && (
        <Link to={item.link} className="shrink-0">
          <SmartImage src={item.image} alt={item.title} className="h-24 w-full rounded-2xl object-cover sm:w-32" />
        </Link>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Product Type Badge */}
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", badgeInfo.color)}>
            <BadgeIcon size={12} />
            <span>{badgeInfo.label}</span>
          </span>

          {/* Status Badge */}
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", st.cls)}>
            <st.icon size={11} /> {st.label}
          </span>
        </div>

        <h3 className="mt-1.5 truncate font-heading text-lg font-medium text-foreground">
          <Link to={item.link} className="hover:underline">
            {item.title}
          </Link>
        </h3>

        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          {item.dateInfo}
          {item.subtitle ? ` · ${item.subtitle}` : ""}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs">
          <span className="font-semibold text-foreground text-sm">
            {formatCurrency(item.totalPrice)}
          </span>
          <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            Ref: {item.reference}
          </span>
        </div>
      </div>

      {item.status !== "cancelled" && onCancel && (
        <button
          onClick={onCancel}
          className="shrink-0 self-start rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground sm:self-center transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

function ApptCard({ item, onCancel }: { item: any; onCancel: () => void }) {
  const st = STATUS[item.status] || STATUS.pending;
  const TypeIcon = item.type === "video" ? Video : MapPin;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card p-4 sm:flex-row sm:items-center shadow-luxe">
      <Link to={`/listing/${item.listingId}`} className="shrink-0">
        <SmartImage src={item.listingImage} alt={item.listingTitle} className="h-24 w-full rounded-2xl object-cover sm:w-32" />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/listing/${item.listingId}`} className="font-medium hover:underline text-foreground">
            {item.listingTitle}
          </Link>
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", st.cls)}>
            <st.icon size={11} /> {st.label}
          </span>
        </div>

        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {formatDate(item.date)} · {item.timeSlot}
          <span className="inline-flex items-center gap-1">
            <TypeIcon size={12} /> {item.type === "video" ? "Video Viewing" : "In Person Viewing"}
          </span>
        </p>

        <div className="mt-2 text-xs font-mono text-muted-foreground">
          Ref: {item.reference}
        </div>
      </div>

      {item.status !== "cancelled" && (
        <button
          onClick={onCancel}
          className="shrink-0 self-start rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground sm:self-center"
        >
          Cancel
        </button>
      )}
    </div>
  );
}