import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Video, MapPin, Clock, Check, ArrowLeft, PartyPopper, User, Mail, Phone, MessageSquare } from "lucide-react";
import { client } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import SmartImage from "@/components/ui/SmartImage";
import { TIME_SLOTS } from "@/lib/constants";
import { todayISO, addDays, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function AppointmentBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [listing, setListing] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState("");

  const [type, setType] = useState("in_person");
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    notes: "",
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    Promise.all([
      client.entities.Listing.get(id).catch(() => null),
      client.functions.invoke("getAvailability", { listingId: id }).then((r) => r.data).catch(() => ({ bookedSlots: [] })),
    ]).then(([l, avail]) => {
      setListing(l);
      setBookedSlots(avail?.bookedSlots || []);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center pt-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" /></div>;
  }
  if (!listing) {
    return <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16 text-center"><h1 className="font-heading text-2xl font-medium">Stay not found</h1><Link to="/explore" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Back to explore</Link></div>;
  }

  const dates = Array.from({ length: 14 }).map((_, i) => addDays(todayISO(), i));
  const takenSet = new Set(bookedSlots.filter((s) => s.date === date).map((s) => s.timeSlot));
  const formValid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim().length >= 7 && date && slot && type;

  const submit = async () => {
    setTouched({ name: true, email: true, phone: true });
    if (!date || !slot) { setError("Please choose a date and time."); return; }
    if (!formValid) { setError("Please complete all required details."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await client.functions.invoke("bookAppointment", {
        listingId: id,
        listingTitle: listing.title,
        listingImage: listing.images?.[0],
        type, date, timeSlot: slot,
        name: form.name, email: form.email, phone: form.phone, notes: form.notes,
      });
      const appt = res.data?.appointment;
      if (!appt) throw new Error(res.data?.error || "Scheduling failed");
      setConfirmed(appt);
      toast({ title: "Viewing scheduled", description: `Reference ${appt.reference}` });
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || "Scheduling failed";
      setError(msg);
      toast({ title: "Couldn't schedule", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) return <ApptConfirmation appointment={confirmed} listing={listing} />;

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
        <Link to={`/listing/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={15} /> Back to {listing.title}
        </Link>

        <h1 className="mt-6 font-heading text-3xl font-medium tracking-tight sm:text-4xl">Schedule a viewing</h1>
        <p className="mt-2 text-muted-foreground">Tour {listing.title} in person or over video — your choice.</p>

        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <SmartImage src={listing.images?.[0]} alt={listing.title} className="h-14 w-20 rounded-xl" />
          <div>
            <p className="font-medium">{listing.title}</p>
            <p className="text-sm text-muted-foreground">{listing.location}, {listing.country}</p>
          </div>
        </div>

        {/* Type */}
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Viewing type</h2>
          <div className="grid grid-cols-2 gap-3">
            <TypeCard active={type === "in_person"} onClick={() => setType("in_person")} icon={MapPin} title="In person" desc="Visit the property" />
            <TypeCard active={type === "video"} onClick={() => setType("video")} icon={Video} title="Video tour" desc="Live guided walk-through" />
          </div>
        </div>

        {/* Date */}
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Choose a date</h2>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
            {dates.map((d) => {
              const dt = new Date(d);
              const active = date === d;
              return (
                <button
                  key={d}
                  onClick={() => { setDate(d); setSlot(null); setError(""); }}
                  className={cn("flex min-w-[68px] flex-col items-center rounded-2xl border px-3 py-3 transition-colors", active ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary")}
                >
                  <span className="text-[11px] uppercase">{dt.toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span className="text-lg font-semibold">{dt.getDate()}</span>
                  <span className="text-[11px] opacity-70">{dt.toLocaleDateString("en-US", { month: "short" })}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="mt-8">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Clock size={14} /> Available times
          </h2>
          {!date ? (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Select a date to see times.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {TIME_SLOTS.map((t) => {
                const taken = takenSet.has(t);
                const active = slot === t;
                return (
                  <button
                    key={t}
                    disabled={taken}
                    onClick={() => { setSlot(t); setError(""); }}
                    className={cn(
                      "rounded-xl border py-2.5 text-sm font-medium transition-colors",
                      taken && "cursor-not-allowed border-border bg-muted text-muted-foreground/40 line-through",
                      !taken && active && "border-foreground bg-foreground text-background",
                      !taken && !active && "border-border hover:bg-secondary"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact details */}
        <div className="mt-8 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your details</h2>
          <Input icon={User} placeholder="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} onBlur={() => setTouched({ ...touched, name: true })} error={touched.name && !form.name.trim() && "Required"} />
          <Input icon={Mail} placeholder="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} onBlur={() => setTouched({ ...touched, email: true })} error={touched.email && !/\S+@\S+\.\S+/.test(form.email) && "Valid email required"} />
          <Input icon={Phone} placeholder="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} onBlur={() => setTouched({ ...touched, phone: true })} error={touched.phone && form.phone.trim().length < 7 && "Valid phone required"} />
          <div>
            <div className="relative">
              <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Anything you'd like the host to know? (optional)"
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

        <button
          onClick={submit}
          disabled={submitting}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-medium text-background transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-60"
        >
          {submitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" /> : <Check size={15} />}
          {submitting ? "Scheduling…" : "Confirm viewing"}
        </button>
      </div>
    </div>
  );
}

function TypeCard({ active, onClick, icon: Icon, title, desc }) {
  return (
    <button onClick={onClick} className={cn("flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-colors", active ? "border-foreground bg-secondary" : "border-border hover:bg-secondary/60")}>
      <Icon size={20} className={cn(active ? "text-foreground" : "text-muted-foreground")} strokeWidth={1.5} />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}

function Input({ icon: Icon, value, onChange, onBlur, error, placeholder, type = "text" }) {
  return (
    <div>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ApptConfirmation({ appointment, listing }) {
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:py-24">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 12, stiffness: 200 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-foreground text-background">
          <PartyPopper size={28} />
        </motion.div>
        <h1 className="mt-6 font-heading text-3xl font-medium tracking-tight sm:text-4xl">Viewing scheduled</h1>
        <p className="mt-3 text-muted-foreground">
          {appointment.type === "video" ? "A video tour" : "An in-person visit"} on {formatDate(appointment.date)} at {appointment.timeSlot}.
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-left shadow-luxe">
          <div className="flex items-center gap-4">
            <SmartImage src={listing.images?.[0]} alt={listing.title} className="h-16 w-20 rounded-xl" />
            <div>
              <p className="font-medium">{listing.title}</p>
              <p className="text-sm text-muted-foreground">{listing.location}, {listing.country}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
            <div><p className="text-xs uppercase text-muted-foreground">Date</p><p className="font-medium">{formatDate(appointment.date)}</p></div>
            <div><p className="text-xs uppercase text-muted-foreground">Time</p><p className="font-medium">{appointment.timeSlot}</p></div>
            <div><p className="text-xs uppercase text-muted-foreground">Type</p><p className="font-medium capitalize">{appointment.type === "in_person" ? "In person" : "Video tour"}</p></div>
            <div><p className="text-xs uppercase text-muted-foreground">Reference</p><p className="font-mono font-semibold">{appointment.reference}</p></div>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/dashboard" className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background">My appointments</Link>
          <Link to="/explore" className="rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-secondary">Keep exploring</Link>
        </div>
      </div>
    </div>
  );
}