import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ChefHat, Plane, MapPin, Flower2, PartyPopper, ShoppingCart } from "lucide-react";
import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import SectionReveal from "@/components/ui/SectionReveal";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { getBookings, createConciergeRequest } from "@/services";
import { GEN_IMAGES } from "@/lib/constants";
import { generateReference } from "@/lib/format";

const SERVICES = [
  { icon: ChefHat, t: "Private chef & dining", d: "A resident chef, a tasting menu, or a single unforgettable breakfast on the terrace.", from: 240, img: GEN_IMAGES.tuscany },
  { icon: Plane, t: "Airport & chauffeur transfers", d: "Met at the gate, driven in comfort, and handed the keys without a moment's wait.", from: 180, img: GEN_IMAGES.tokyo },
  { icon: MapPin, t: "Local experiences & guided tours", d: "Quiet corners, private guides, and the version of the city locals keep to themselves.", from: 120, img: GEN_IMAGES.santorini },
  { icon: Flower2, t: "Spa & wellness", d: "In-villa treatments, sunrise yoga, and a schedule built around your slowest self.", from: 200, img: GEN_IMAGES.bali },
  { icon: PartyPopper, t: "Event & celebration planning", d: "Anniversaries, proposals, and milestones — staged with discretion and flair.", from: 600, img: GEN_IMAGES.ibiza },
  { icon: ShoppingCart, t: "Grocery & stocking before arrival", d: "Arrive to a full fridge, your favorite bottle waiting, and not a thing to do.", from: 90, img: GEN_IMAGES.provence },
];

const inputCls = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-foreground/40 focus:ring-2 focus:ring-accent/20";

export default function Concierge() {
  useSeo("Concierge", "Your trip, handled. Private chefs, transfers, spa, experiences and more — arranged by the Haven concierge.");
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ serviceType: "Private chef & dining", bookingId: "", date: "", guests: 2, notes: "", contact: "" });
  const [submitting, setSubmitting] = useState(false);
  const [ref, setRef] = useState(null);
  const [bookings, setBookings] = useState([]);

  React.useEffect(() => {
    if (!user) return;
    getBookings().then(setBookings).catch(() => {});
  }, [user]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast({ title: "Please sign in", description: "You need an account to request concierge services.", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      const reference = generateReference("CN");
      await createConciergeRequest({
        userId: user.id,
        bookingId: form.bookingId || undefined,
        requestType: form.serviceType,
        destination: form.notes,
        dates: form.date || undefined,
        partySize: Number(form.guests) || 1,
        notes: form.notes,
      });
      setRef(reference);
    } catch (err) {
      toast({ title: "Couldn't submit request", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      <PageHero
        eyebrow="Haven Concierge"
        title="Your trip, handled."
        subtitle="From the airport to the last breakfast, our concierge arranges the details so your stay feels effortless."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Concierge" }]}
        image={GEN_IMAGES.maldives}
      />

      {/* AI highlight */}
      <div className="mx-auto max-w-5xl px-5 pt-10 sm:px-8">
        <SectionReveal>
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-accent/30 bg-accent/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles size={22} className="mt-0.5 text-champagne" />
              <div>
                <h3 className="font-heading text-lg font-medium">Ask our AI concierge instantly</h3>
                <p className="mt-1 text-sm text-muted-foreground">Plan a trip, find a stay, or build an itinerary in seconds — the AI concierge floats on every page.</p>
              </div>
            </div>
            <Link to="/explore" className="shrink-0 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-95">
              Try it now
            </Link>
          </div>
        </SectionReveal>
      </div>

      {/* Service cards */}
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <SectionReveal key={s.t} delay={i * 0.04}>
              <div className="group h-full overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative h-40 overflow-hidden">
                  <img src={s.img} alt={s.t} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <s.icon size={20} className="absolute left-4 top-4 text-white" strokeWidth={1.5} />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-medium">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">from <span className="font-semibold text-foreground">${s.from}</span></span>
                    <button onClick={() => { set("serviceType", s.t); document.getElementById("concierge-form")?.scrollIntoView({ behavior: "smooth" }); }} className="rounded-full border border-border px-4 py-1.5 text-xs font-medium hover:bg-secondary">
                      Request
                    </button>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Request form */}
      <section id="concierge-form" className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
          <SectionReveal>
            <h2 className="font-heading text-3xl font-medium tracking-tight">Request a service</h2>
            <p className="mt-2 text-muted-foreground">Tell us what you'd like and when. We'll confirm within 24 hours.</p>
          </SectionReveal>

          {ref ? (
            <SectionReveal>
              <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-foreground text-background"><Sparkles size={22} /></div>
                <h3 className="mt-4 font-heading text-xl font-medium">Request received</h3>
                <p className="mt-2 text-sm text-muted-foreground">Your reference code is</p>
                <p className="mt-1 font-heading text-2xl font-semibold tracking-wider">{ref}</p>
                <Link to="/explore" className="mt-6 inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-background">Back to explore</Link>
              </div>
            </SectionReveal>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service</label>
                <select value={form.serviceType} onChange={(e) => set("serviceType", e.target.value)} className={inputCls}>
                  {SERVICES.map((s) => <option key={s.t} value={s.t}>{s.t}</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Linked booking (optional)</label>
                  <select value={form.bookingId} onChange={(e) => set("bookingId", e.target.value)} className={inputCls}>
                    <option value="">No specific booking</option>
                    {bookings.map((b) => <option key={b.id} value={b.id}>{b.listingTitle} · {b.checkIn}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</label>
                  <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Guests</label>
                  <input type="number" min="1" value={form.guests} onChange={(e) => set("guests", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact (phone or email)</label>
                  <input value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="How we reach you" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</label>
                <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={4} placeholder="Dietary needs, timing, anything we should know" className={inputCls} />
              </div>
              <button type="submit" disabled={submitting} className="w-full rounded-full bg-foreground py-3.5 text-sm font-medium text-background transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50">
                {submitting ? "Submitting…" : "Submit request"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}