import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  LayoutDashboard, Plus, Pencil, Trash2, Check, X, Calendar, DollarSign, Home, Star, Ban,
  Sparkles, ShieldCheck, HeartHandshake, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getListings,
  createListing,
  updateListing,
  deleteListing,
  getBookings,
  updateBooking,
  getAvailabilitySlots,
  createAvailabilitySlot,
  deleteAvailabilitySlot,
} from "@/services";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import PageHero from "@/components/ui/PageHero";
import SectionReveal from "@/components/ui/SectionReveal";
import SmartImage from "@/components/ui/SmartImage";
import ListingForm from "@/components/listings/ListingForm";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { TIME_SLOTS, GEN_IMAGES } from "@/lib/constants";
import { formatCurrency, formatDate, todayISO } from "@/lib/format";
import { cn } from "@/lib/utils";

function HostLanding() {
  return (
    <div className="pt-16">
      <PageHero
        eyebrow="Host with Haven"
        title="Share your sanctuary."
        subtitle="Join an invitation-only collection of extraordinary stays. High-value guests, comprehensive protection, and personalized support."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Host with us" }]}
        image={GEN_IMAGES.santorini}
      />

      {/* Perks / Benefits */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">Why host with Haven</p>
          <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
            Thoughtful hosting for exceptional homes.
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            We connect properties of character with travelers who value design, quiet, and care. No mass market noise — just discerning guests.
          </p>
        </SectionReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              t: "Vetted guests",
              d: "Every traveler completes identity verification before booking. We maintain a zero-tolerance policy for disruptions.",
            },
            {
              icon: DollarSign,
              t: "Premium returns",
              d: "Haven listings average 35% higher revenue per night than generic platforms, with transparent payouts.",
            },
            {
              icon: Sparkles,
              t: "AI-assisted curation",
              d: "Intelligent listing descriptions, smart pricing suggestions, and automatic inquiry handling.",
            },
            {
              icon: HeartHandshake,
              t: "Personal concierge",
              d: "From guest arrival to special requests, our team supports both you and your guests around the clock.",
            },
          ].map((perk, i) => (
            <SectionReveal key={perk.t} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-foreground/5 text-foreground">
                  <perk.icon size={22} className="text-champagne" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-medium">{perk.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{perk.d}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* 3 Step Journey */}
      <section className="border-y border-border bg-secondary/40 py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <SectionReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">Simple onboarding</p>
            <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight sm:text-4xl">How it works</h2>
          </SectionReveal>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Submit your stay",
                desc: "Tell us about your home, architecture, amenities, and location. Our curation team reviews every application.",
              },
              {
                step: "02",
                title: "Quality verification",
                desc: "We verify identity, review photography, and perform an in-person check to guarantee our luxury standard.",
              },
              {
                step: "03",
                title: "Welcome discerning guests",
                desc: "Your stay is published to our global audience, backed by instant bookings and dedicated concierge service.",
              },
            ].map((s, idx) => (
              <SectionReveal key={s.step} delay={idx * 0.05}>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="font-heading text-3xl font-light text-champagne">{s.step}</span>
                  <h3 className="mt-4 font-heading text-xl font-medium">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 text-center">
        <SectionReveal>
          <div className="rounded-3xl border border-border bg-card p-10 sm:p-16 shadow-sm">
            <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Ready to showcase your stay?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
              Submit your property for consideration or sign in to access your host dashboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-95"
              >
                Apply to host <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-8 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
              >
                Sign in to Host Dashboard
              </Link>
            </div>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "listings", label: "Listings", icon: Home },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "availability", label: "Availability", icon: Ban },
];

import { useSeo } from "@/lib/seo";

export default function HostDashboard() {
  useSeo(
    "Host Management & Reservations",
    "Oversee your luxury stays, reservation requests, availability blocks, and guest revenues on Haven."
  );
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [l, b] = await Promise.all([
        getListings().catch(() => []),
        getBookings().catch(() => []),
      ]);
      setListings(l);
      setBookings(b.sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  if (!user || user.role !== "admin") {
    return <HostLanding />;
  }

  const saveListing = async (data: any) => {
    try {
      if (editing) {
        await updateListing(editing.id, data);
        toast({ title: "Listing updated" });
      } else {
        await createListing(data);
        toast({ title: "Listing created" });
      }
      setFormOpen(false);
      setEditing(null);
      load();
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to save listing", variant: "destructive" });
    }
  };

  const deleteListingItem = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    await deleteListing(id);
    toast({ title: "Listing deleted" });
    load();
  };

  const setBookingStatus = async (id: string, status: any) => {
    await updateBooking(id, { status });
    toast({ title: `Booking ${status}` });
    load();
  };

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const revenue = confirmedBookings.reduce((s, b) => s + (b.totalPrice || 0), 0);

  return (
    <div className="pt-16">
      <PageHero
        eyebrow="Host Management"
        title="Host dashboard"
        subtitle="Manage listings, bookings, rates, and availability across the Haven collection."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Host with us" }]}
        image={GEN_IMAGES.santorini}
      />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <p className="text-sm text-muted-foreground">Welcome back. Oversee and optimize your property portfolio.</p>

        <div className="mt-8 no-scrollbar flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors", tab === t.id ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary")}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "overview" && <Overview listings={listings} bookings={bookings} revenue={revenue} loading={loading} />}
          {tab === "listings" && (
            <ListingsTab listings={listings} loading={loading} onAdd={() => { setEditing(null); setFormOpen(true); }} onEdit={(l) => { setEditing(l); setFormOpen(true); }} onDelete={deleteListingItem} />
          )}
          {tab === "bookings" && <BookingsTab bookings={bookings} listings={listings} loading={loading} onStatus={setBookingStatus} />}
          {tab === "availability" && <AvailabilityTab listings={listings} />}
        </div>
      </div>

      <AnimatePresence>
        {formOpen && <ListingForm initial={editing} onSave={saveListing} onClose={() => { setFormOpen(false); setEditing(null); }} />}
      </AnimatePresence>
    </div>
  );
}

function Overview({ listings, bookings, revenue, loading }) {
  const chartData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("en-US", { month: "short" }), revenue: 0, bookings: 0 });
    }
    const map = new Map(months.map((m) => [m.key, m]));
    bookings.filter((b) => b.status === "confirmed").forEach((b) => {
      const d = new Date(b.checkIn);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const m = map.get(key);
      if (m) { m.revenue += b.totalPrice || 0; m.bookings += 1; }
    });
    return months;
  }, [bookings]);

  const avgRating = listings.length ? (listings.reduce((s, l) => s + (l.rating || 0), 0) / listings.length).toFixed(1) : "0";

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={DollarSign} label="Total revenue" value={<AnimatedCounter value={revenue} prefix="$" />} />
        <Stat icon={Calendar} label="Confirmed bookings" value={<AnimatedCounter value={bookings.filter((b) => b.status === "confirmed").length} />} />
        <Stat icon={Home} label="Active listings" value={<AnimatedCounter value={listings.length} />} />
        <Stat icon={Star} label="Avg rating" value={<AnimatedCounter value={Number(avgRating)} />} />
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6">
        <h3 className="font-heading text-lg font-medium">Revenue</h3>
        <p className="text-sm text-muted-foreground">Last 6 months</p>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(39 46% 61%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(39 46% 61%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 13 }}
                formatter={(v: any) => [formatCurrency(Number(v) || 0), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(39 46% 50%)" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Icon size={18} className="text-champagne" strokeWidth={1.5} />
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ListingsTab({ listings, loading, onAdd, onEdit, onDelete }) {
  if (loading) return <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" /></div>;
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{listings.length} listings</p>
        <button onClick={onAdd} className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background">
          <Plus size={15} /> New listing
        </button>
      </div>
      <div className="grid gap-4">
        {listings.map((l) => (
          <div key={l.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3">
            <SmartImage src={l.images?.[0]} alt={l.title} className="h-16 w-24 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{l.title}</p>
              <p className="truncate text-sm text-muted-foreground">{l.location}, {l.country} · {l.category}</p>
              <p className="text-sm"><span className="font-semibold">{formatCurrency(l.pricePerNight)}</span> night · ★ {l.rating?.toFixed(1)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(l)} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary"><Pencil size={15} /></button>
              <button onClick={() => onDelete(l.id)} aria-label="Delete" className="grid h-9 w-9 place-items-center rounded-full border border-border text-destructive hover:bg-destructive/10"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingsTab({ bookings, listings, loading, onStatus }) {
  if (loading) return <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" /></div>;
  if (bookings.length === 0) return <Empty text="No bookings yet." />;
  return (
    <div className="grid gap-4">
      {bookings.map((b) => (
        <div key={b.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <SmartImage src={b.listingImage} alt="" className="h-16 w-24 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">{b.listingTitle}</p>
            <p className="text-sm text-muted-foreground">{formatDate(b.checkIn)} → {formatDate(b.checkOut)} · {b.guests} guests</p>
            <p className="text-xs text-muted-foreground">{b.guestName} · {b.guestEmail} · Ref {b.reference}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">{formatCurrency(b.totalPrice)}</span>
            <StatusBadge status={b.status} />
          </div>
          <div className="flex gap-2">
            {b.status === "pending" && (
              <button onClick={() => onStatus(b.id, "confirmed")} className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background" aria-label="Approve"><Check size={15} /></button>
            )}
            {b.status !== "cancelled" && (
              <button onClick={() => onStatus(b.id, "cancelled")} className="grid h-9 w-9 place-items-center rounded-full border border-border text-destructive hover:bg-destructive/10" aria-label="Cancel"><X size={15} /></button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    confirmed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    cancelled: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  };
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", map[status])}>{status}</span>;
}

function AvailabilityTab({ listings }) {
  const { toast } = useToast();
  const [listingId, setListingId] = useState(listings[0]?.id || "");
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [blocked, setBlocked] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const loadBlocked = async (id: string) => {
    if (!id) return setBlocked([]);
    setLoadingSlots(true);
    try {
      const slots = await getAvailabilitySlots(id);
      setBlocked(slots);
    } catch { setBlocked([]); }
    setLoadingSlots(false);
  };
  useEffect(() => { loadBlocked(listingId); }, [listingId]);

  const block = async () => {
    if (!listingId || !date || !slot) return;
    const exists = blocked.some((s: any) => s.date === date && s.timeSlot === slot);
    if (exists) { toast({ title: "Slot already blocked", variant: "destructive" }); return; }
    await createAvailabilitySlot({ listingId, date, timeSlot: slot });
    toast({ title: "Slot blocked" });
    loadBlocked(listingId);
  };
  const unblock = async (id: string) => {
    await deleteAvailabilitySlot(id);
    toast({ title: "Slot unblocked" });
    loadBlocked(listingId);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-heading text-lg font-medium">Block a time slot</h3>
        <p className="text-sm text-muted-foreground">Blocked slots disappear from the viewing scheduler.</p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">Listing</label>
            <select value={listingId} onChange={(e) => setListingId(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
              {listings.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">Date</label>
              <input type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm [color-scheme:light] dark:[color-scheme:dark]" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">Time</label>
              <select value={slot} onChange={(e) => setSlot(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button onClick={block} className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm font-medium text-background">
            <Ban size={15} /> Block slot
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-heading text-lg font-medium">Blocked slots</h3>
        {loadingSlots ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : blocked.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No blocked slots for this listing.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {blocked.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                <span>{formatDate(s.date)} · {s.timeSlot}</span>
                <button onClick={() => unblock(s.id)} className="text-destructive hover:underline">Unblock</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Empty({ text }) {
  return <div className="rounded-3xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">{text}</div>;
}