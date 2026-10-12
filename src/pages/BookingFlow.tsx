import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Calendar, Users, Home, PartyPopper, Copy, ShieldCheck } from "lucide-react";
import { client } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import DateRangePicker from "@/components/booking/DateRangePicker";
import SmartImage from "@/components/ui/SmartImage";
import { formatCurrency, formatDate, nightsBetween, calcTotal } from "@/lib/format";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Dates", icon: Calendar },
  { label: "Details", icon: Users },
  { label: "Review", icon: Check },
];

export default function BookingFlow() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [listing, setListing] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState("");

  const [checkIn, setCheckIn] = useState(params.get("checkIn") || null);
  const [checkOut, setCheckOut] = useState(params.get("checkOut") || null);
  const [guests, setGuests] = useState(Number(params.get("guests")) || 2);
  const [details, setDetails] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    phone: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([
      client.entities.Listing.get(id).catch(() => null),
      client.functions.invoke("getAvailability", { listingId: id }).then((r) => r.data).catch(() => ({ bookedRanges: [] })),
    ]).then(([l, avail]) => {
      setListing(l);
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
        <Link to="/explore" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Back to explore</Link>
      </div>
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  const price = calcTotal(listing.pricePerNight, nights);

  const canNextDates = checkIn && checkOut && nights >= 1;
  const detailsValid = details.name.trim() && /\S+@\S+\.\S+/.test(details.email) && details.phone.trim().length >= 7;

  const next = () => {
    setError("");
    if (step === 0 && !canNextDates) {
      setError("Please select your check-in and check-out dates.");
      return;
    }
    if (step === 1) {
      setTouched({ name: true, email: true, phone: true });
      if (!detailsValid) {
        setError("Please complete all contact details.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 2));
  };
  const back = () => { setError(""); setStep((s) => Math.max(s - 1, 0)); };

  const confirm = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await client.functions.invoke("createBooking", {
        listingId: id,
        listingTitle: listing.title,
        listingImage: listing.images?.[0],
        checkIn, checkOut, guests,
        nightlyPrice: listing.pricePerNight,
        nights, cleaningFee: price.cleaning, serviceFee: price.service, totalPrice: price.total,
        guestName: details.name, guestEmail: details.email,
      });
      const booking = res.data?.booking;
      if (!booking) throw new Error(res.data?.error || "Booking failed");
      setConfirmed(booking);
      toast({ title: "Booking confirmed", description: `Reference ${booking.reference}` });
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || "Booking failed";
      setError(msg);
      toast({ title: "Couldn't complete booking", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) return <Confirmation booking={confirmed} listing={listing} />;

  return (
    <div className="pt-16">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        {/* Progress */}
        <div className="mb-10 flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div className={cn("grid h-10 w-10 place-items-center rounded-full border-2 transition-all duration-300", i <= step ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground")}>
                  {i < step ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <span className={cn("text-xs font-medium", i <= step ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-2 h-0.5 flex-1 rounded-full bg-border">
                  <motion.div className="h-full rounded-full bg-foreground" initial={false} animate={{ width: i < step ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary card */}
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <SmartImage src={listing.images?.[0]} alt={listing.title} className="h-16 w-20 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{listing.title}</p>
            <p className="text-sm text-muted-foreground">{listing.location}, {listing.country}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(listing.pricePerNight)}</p>
            <p className="text-xs text-muted-foreground">per night</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <Panel key="dates">
              <h2 className="font-heading text-2xl font-medium">When are you coming?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pick your dates. Booked nights are crossed out.</p>
              <div className="mt-6">
                <DateRangePicker bookedRanges={bookedRanges} checkIn={checkIn} checkOut={checkOut} onChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }} />
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border p-4">
                <Users size={18} className="text-muted-foreground" />
                <span className="text-sm font-medium">Guests</span>
                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="ml-auto rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm">
                  {Array.from({ length: listing.maxGuests }).map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1} {i === 0 ? "guest" : "guests"}</option>
                  ))}
                </select>
              </div>
            </Panel>
          )}

          {step === 1 && (
            <Panel key="details">
              <h2 className="font-heading text-2xl font-medium">Your details</h2>
              <p className="mt-1 text-sm text-muted-foreground">We'll use these to confirm your stay.</p>
              <div className="mt-6 space-y-4">
                <Field label="Full name" error={touched.name && !details.name.trim() && "Required"}>
                  <input value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} onBlur={() => setTouched({ ...touched, name: true })} className="input" placeholder="Jane Traveler" />
                </Field>
                <Field label="Email" error={touched.email && !/\S+@\S+\.\S+/.test(details.email) && "Valid email required"}>
                  <input type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} onBlur={() => setTouched({ ...touched, email: true })} className="input" placeholder="jane@email.com" />
                </Field>
                <Field label="Phone" error={touched.phone && details.phone.trim().length < 7 && "Valid phone required"}>
                  <input value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} onBlur={() => setTouched({ ...touched, phone: true })} className="input" placeholder="+1 555 000 0000" />
                </Field>
              </div>
            </Panel>
          )}

          {step === 2 && (
            <Panel key="review">
              <h2 className="font-heading text-2xl font-medium">Review and confirm</h2>
              <p className="mt-1 text-sm text-muted-foreground">Check the details before we lock in your stay.</p>
              <div className="mt-6 space-y-4">
                <InfoRow icon={Calendar} label="Dates" value={`${formatDate(checkIn)} → ${formatDate(checkOut)}`} sub={`${nights} ${nights === 1 ? "night" : "nights"}`} />
                <InfoRow icon={Users} label="Guests" value={`${guests} ${guests === 1 ? "guest" : "guests"}`} />
                <InfoRow icon={Home} label="Guest" value={details.name} sub={details.email} />
              </div>
              <div className="mt-6 space-y-2.5 rounded-2xl border border-border p-5 text-sm">
                <Row label={`${formatCurrency(listing.pricePerNight)} × ${nights} nights`} value={formatCurrency(listing.pricePerNight * nights)} />
                <Row label="Cleaning fee" value={formatCurrency(price.cleaning)} />
                <Row label="Service fee" value={formatCurrency(price.service)} />
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                  <span>Total</span><span>{formatCurrency(price.total)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck size={14} /> Free cancellation up to 48 hours before check-in.
              </div>
            </Panel>
          )}
        </AnimatePresence>

        {error && <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

        <div className="mt-8 flex items-center justify-between">
          <button onClick={back} disabled={step === 0} className={cn("flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium", step === 0 ? "invisible" : "hover:bg-secondary")}>
            <ArrowLeft size={15} /> Back
          </button>
          {step < 2 ? (
            <button onClick={next} className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-95">
              Continue <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={confirm} disabled={submitting} className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60">
              {submitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" /> : <Check size={15} />}
              {submitting ? "Confirming…" : "Confirm booking"}
            </button>
          )}
        </div>
      </div>

      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid hsl(var(--border));background:hsl(var(--card));padding:0.7rem 0.9rem;font-size:0.9rem;outline:none}.input:focus{box-shadow:0 0 0 2px hsl(var(--ring))}`}</style>
    </div>
  );
}

function Panel({ children }) {
  return (
    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface InfoRowProps {
  icon: any;
  label: string;
  value: string;
  sub?: string;
}

function InfoRow({ icon: Icon, label, value, sub }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
      <Icon size={18} className="text-muted-foreground" />
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-foreground/80"><span>{label}</span><span className="tabular-nums">{value}</span></div>;
}

function Confirmation({ booking, listing }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(booking.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="pt-16">
      <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:py-24">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 12, stiffness: 200 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-foreground text-background">
          <PartyPopper size={28} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-6 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
          Your stay is confirmed
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-3 text-muted-foreground">
          We've reserved {listing.title} for {booking.nights} {booking.nights === 1 ? "night" : "nights"}.
        </motion.p>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-left shadow-luxe">
          <div className="flex items-center gap-4">
            <SmartImage src={listing.images?.[0]} alt={listing.title} className="h-16 w-20 rounded-xl" />
            <div>
              <p className="font-medium">{listing.title}</p>
              <p className="text-sm text-muted-foreground">{listing.location}, {listing.country}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
            <div><p className="text-xs uppercase text-muted-foreground">Check in</p><p className="font-medium">{formatDate(booking.checkIn)}</p></div>
            <div><p className="text-xs uppercase text-muted-foreground">Check out</p><p className="font-medium">{formatDate(booking.checkOut)}</p></div>
            <div><p className="text-xs uppercase text-muted-foreground">Guests</p><p className="font-medium">{booking.guests}</p></div>
            <div><p className="text-xs uppercase text-muted-foreground">Total paid</p><p className="font-medium">{formatCurrency(booking.totalPrice)}</p></div>
          </div>
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-secondary p-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Booking reference</p>
              <p className="font-mono text-lg font-semibold tracking-wider">{booking.reference}</p>
            </div>
            <button onClick={copy} className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm hover:bg-background">
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/dashboard" className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background">View my trips</Link>
          <Link to="/explore" className="rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-secondary">Keep exploring</Link>
        </div>
      </div>
    </div>
  );
}