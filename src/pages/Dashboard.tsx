import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, X, MapPin, Video, CheckCircle2, CalendarX } from "lucide-react";
import { client } from "@/api/client";
import { useToast } from "@/components/ui/use-toast";
import SmartImage from "@/components/ui/SmartImage";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS = {
  confirmed: { label: "Confirmed", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  pending: { label: "Pending", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400", icon: Clock },
  cancelled: { label: "Cancelled", cls: "bg-rose-500/15 text-rose-600 dark:text-rose-400", icon: X },
};

export default function Dashboard() {
  const { toast } = useToast();
  const [tab, setTab] = useState("trips");
  const [bookings, setBookings] = useState([]);
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [b, a] = await Promise.all([
        client.entities.Booking.filter({}).catch(() => []),
        client.entities.Appointment.filter({}).catch(() => []),
      ]);
      setBookings(b.sort((x: any, y: any) => new Date(y.checkIn).getTime() - new Date(x.checkIn).getTime()));
      setAppts(a.sort((x: any, y: any) => new Date(y.date).getTime() - new Date(x.date).getTime()));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const cancelBooking = async (id) => {
    await client.entities.Booking.update(id, { status: "cancelled" });
    toast({ title: "Booking cancelled" });
    load();
  };
  const cancelAppt = async (id) => {
    await client.entities.Appointment.update(id, { status: "cancelled" });
    toast({ title: "Viewing cancelled" });
    load();
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingTrips = bookings.filter((b) => b.checkOut >= today && b.status !== "cancelled");
  const pastTrips = bookings.filter((b) => b.checkOut < today || b.status === "cancelled");
  const upcomingAppts = appts.filter((a) => a.date >= today && a.status !== "cancelled");
  const pastAppts = appts.filter((a) => a.date < today || a.status === "cancelled");

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">Your journeys</h1>
        <p className="mt-2 text-muted-foreground">Trips and viewings, all in one place.</p>

        <div className="mt-8 inline-flex rounded-full border border-border p-1">
          {[
            { id: "trips", label: "My Trips", icon: CalendarCheck, count: upcomingTrips.length },
            { id: "appts", label: "Viewings", icon: MapPin, count: upcomingAppts.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn("flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors", tab === t.id ? "bg-foreground text-background" : "text-foreground/70 hover:bg-secondary")}
            >
              <t.icon size={15} /> {t.label}
              {t.count > 0 && <span className={cn("rounded-full px-1.5 text-[11px]", tab === t.id ? "bg-background/20" : "bg-secondary")}>{t.count}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" /></div>
        ) : tab === "trips" ? (
          <div className="mt-8 space-y-10">
            <Section title="Upcoming" items={upcomingTrips} kind="booking" onCancel={cancelBooking} empty="No upcoming trips yet." cta />
            {pastTrips.length > 0 && <Section title="Past" items={pastTrips} kind="booking" onCancel={cancelBooking} empty="" />}
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            <Section title="Upcoming" items={upcomingAppts} kind="appt" onCancel={cancelAppt} empty="No upcoming viewings." cta />
            {pastAppts.length > 0 && <Section title="Past" items={pastAppts} kind="appt" onCancel={cancelAppt} empty="" />}
          </div>
        )}
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  items: any[];
  kind: string;
  onCancel: (id: string) => Promise<void> | void;
  empty?: string;
  cta?: boolean;
}

function Section({ title, items, kind, onCancel, empty, cta }: SectionProps) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {items.length === 0 && empty ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-16 text-center">
          <CalendarX size={28} className="text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-muted-foreground">{empty}</p>
          {cta && <Link to="/explore" className="mt-4 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Find a stay</Link>}
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}>
              <Card item={item} kind={kind} onCancel={onCancel} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ item, kind, onCancel }) {
  const st = STATUS[item.status] || STATUS.pending;
  const isBooking = kind === "booking";
  const TypeIcon = item.type === "video" ? Video : MapPin;
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <Link to={`/listing/${item.listingId}`} className="shrink-0">
        <SmartImage src={item.listingImage} alt={item.listingTitle} className="h-24 w-full rounded-xl sm:w-32" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/listing/${item.listingId}`} className="font-medium hover:underline">{item.listingTitle}</Link>
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", st.cls)}>
            <st.icon size={11} /> {st.label}
          </span>
        </div>
        {isBooking ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(item.checkIn)} → {formatDate(item.checkOut)} · {item.nights} {item.nights === 1 ? "night" : "nights"} · {item.guests} {item.guests === 1 ? "guest" : "guests"}
          </p>
        ) : (
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {formatDate(item.date)} · {item.timeSlot}
            <span className="inline-flex items-center gap-1"><TypeIcon size={12} /> {item.type === "video" ? "Video" : "In person"}</span>
          </p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs">
          {isBooking && <span className="font-medium">{formatCurrency(item.totalPrice)}</span>}
          <span className="font-mono text-muted-foreground">Ref: {item.reference}</span>
        </div>
      </div>
      {item.status !== "cancelled" && (
        <button onClick={() => onCancel(item.id)} className="shrink-0 self-start rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary sm:self-center">
          Cancel
        </button>
      )}
    </div>
  );
}