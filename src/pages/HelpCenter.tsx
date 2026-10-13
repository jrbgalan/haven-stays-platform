import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, MessageSquare, LifeBuoy, BookOpen } from "lucide-react";
import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import SectionReveal from "@/components/ui/SectionReveal";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { createSupportTicket } from "@/services";
import { GEN_IMAGES } from "@/lib/constants";

const CATEGORIES = [
  { t: "Booking", d: "Dates, guests, availability" },
  { t: "Payments", d: "Methods, refunds, invoices" },
  { t: "Hosting", d: "Listings, calendar, payouts" },
  { t: "Account", d: "Profile, login, security" },
  { t: "Safety", d: "Verification, reporting" },
  { t: "Appointments", d: "Viewings, rescheduling" },
  { t: "Reviews", d: "Ratings, writing, replies" },
  { t: "AI & Chat", d: "Concierge, smart search" },
];

const FAQS = [
  { cat: "Booking", q: "How do I book a stay?", a: "Choose your dates on any listing, confirm the guest count, and tap Reserve. You'll get a confirmation with a reference code in seconds." },
  { cat: "Booking", q: "Can I change my dates after booking?", a: "Pending bookings can be edited before confirmation. Once confirmed, changes depend on the listing's cancellation policy." },
  { cat: "Booking", q: "What's the minimum stay?", a: "Most stays require a one-night minimum; some popular listings require two. The minimum is shown on each listing." },
  { cat: "Booking", q: "Are dates ever double-booked?", a: "No. Availability is validated server-side on every reservation, so overlapping dates can't be booked twice." },
  { cat: "Payments", q: "When am I charged?", a: "You're only charged once a booking is confirmed. The price breakdown shows nightly rate, fees, and taxes upfront." },
  { cat: "Payments", q: "Which currencies do you support?", a: "USD, EUR, PHP, and GBP. You can switch currency from the header; prices update across the app." },
  { cat: "Payments", q: "How do refunds work?", a: "Refunds follow the listing's cancellation policy. See the Cancellation page for the full timeline and a refund calculator." },
  { cat: "Hosting", q: "How do I list my property?", a: "Visit Host with us and use the listing editor. You can save a draft, set pricing, amenities, and publish when ready." },
  { cat: "Hosting", q: "Can the AI help me write a listing?", a: "Yes — the AI listing helper inside the editor suggests a title, description, and price based on your inputs." },
  { cat: "Hosting", q: "How do payouts reach me?", a: "Payouts are processed after check-in. Connect your details in the Host dashboard under Earnings." },
  { cat: "Account", q: "How do I reset my password?", a: "Use the Forgot password link on the login page. You'll get a reset link by email." },
  { cat: "Account", q: "Can I sign in with Google?", a: "Yes. Google sign-in is available on the login and registration pages." },
  { cat: "Account", q: "How do I delete my account?", a: "Contact support from the form below and we'll guide you through deletion and data removal." },
  { cat: "Safety", q: "Are hosts verified?", a: "Every host passes identity verification, and listings are insured under Haven's guarantee." },
  { cat: "Safety", q: "How do I report a concern?", a: "Use the Report a Concern page. You can report a listing, host, or safety issue, and attach evidence." },
  { cat: "Safety", q: "What if I have an emergency during my stay?", a: "Contact local emergency services first, then file a safety report so our team can follow up immediately." },
  { cat: "Appointments", q: "How do I book a viewing?", a: "On any listing, tap Schedule a viewing, pick a slot, and choose in-person or video. You'll get a confirmation." },
  { cat: "Appointments", q: "Can I reschedule a viewing?", a: "Yes. From My Trips or the appointment confirmation, reschedule or cancel with a confirmation dialog." },
  { cat: "Appointments", q: "Can I export my appointment to my calendar?", a: "Yes — the confirmation page has a Download .ics button that adds the viewing to your calendar." },
  { cat: "Reviews", q: "Who can leave a review?", a: "Only guests with a completed booking for that stay. Verified reviews carry a 'Verified stay' badge." },
  { cat: "Reviews", q: "Can I rate specific categories?", a: "Yes — Cleanliness, Accuracy, Communication, Location, Check-in, and Value, plus an overall rating." },
  { cat: "Reviews", q: "Can hosts reply to reviews?", a: "Yes. Hosts post a public response that appears nested under the review." },
  { cat: "AI & Chat", q: "What is the AI concierge?", a: "A floating assistant on every page that plans trips, finds stays, and builds itineraries from a short prompt." },
  { cat: "AI & Chat", q: "How does smart search work?", a: "On Explore, describe what you want in plain language. The AI returns ranked matches you can refine with filters." },
  { cat: "AI & Chat", q: "Can I message my host?", a: "Yes. Use Message host on any listing, or the Messages inbox to continue an existing conversation." },
];

const inputCls = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-foreground/40 focus:ring-2 focus:ring-accent/20";

export default function HelpCenter() {
  useSeo("Help Center", "Answers to common questions about booking, payments, hosting, safety, appointments, reviews, and AI on Haven.");
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);
  const [helpful, setHelpful] = useState({});
  const [form, setForm] = useState({ name: "", email: "", topic: "Booking", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => (f.q + f.a + f.cat).toLowerCase().includes(q));
  }, [query]);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { toast({ title: "Please sign in", description: "Support requests need an account.", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      await createSupportTicket({
        userId: user.id,
        name: form.name,
        email: form.email,
        subject: form.topic,
        message: form.message,
      });
      setSent(true);
    } catch (err: any) {
      toast({ title: "Couldn't submit", description: err?.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Help Center"
        title="How can we help?"
        subtitle="Search our guides or browse by topic. If you can't find an answer, our team is a message away."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Help Center" }]}
        image={GEN_IMAGES.cabin}
      />

      {/* Search */}
      <div className="container-haven max-w-2xl pt-6 sm:pt-8 pb-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for an answer…" className="w-full rounded-full border border-border bg-card py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-foreground/40 focus:ring-2 focus:ring-accent/20" />
        </div>
      </div>

      {/* Categories */}
      <section className="container-haven section-padding-b">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {CATEGORIES.map((c, i) => (
            <SectionReveal key={c.t} delay={i * 0.03}>
              <button onClick={() => setQuery(c.t)} className="h-full w-full rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:bg-secondary">
                <p className="font-heading text-base font-medium">{c.t}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.d}</p>
              </button>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-haven max-w-3xl section-padding">
        <SectionReveal>
          <div className="section-header">
            <h2 className="font-heading text-3xl font-medium tracking-tight">{query ? `Results (${filtered.length})` : "Frequently asked"}</h2>
          </div>
        </SectionReveal>
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
          {filtered.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No matches. Try a different term or contact us below.</p>
          ) : filtered.map((f, i) => (
            <div key={i}>
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <span className="text-sm font-medium">{f.q}</span>
                <ChevronDown size={16} className={`shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Was this helpful?</span>
                    <button onClick={() => setHelpful((h) => ({ ...h, [i]: "yes" }))} className={`rounded-full border px-2.5 py-1 ${helpful[i] === "yes" ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}>Yes</button>
                    <button onClick={() => setHelpful((h) => ({ ...h, [i]: "no" }))} className={`rounded-full border px-2.5 py-1 ${helpful[i] === "no" ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary"}`}>No</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Popular + contact */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container-haven section-padding">
          <div className="grid gap-8 lg:grid-cols-2">
            <SectionReveal>
              <h3 className="flex items-center gap-2 font-heading text-xl font-medium"><BookOpen size={18} className="text-champagne" /> Popular articles</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link to="/cancellation" className="text-foreground/80 hover:text-foreground">Understanding cancellation policies →</Link></li>
                <li><Link to="/report" className="text-foreground/80 hover:text-foreground">How to report a safety concern →</Link></li>
                <li><Link to="/concierge" className="text-foreground/80 hover:text-foreground">Booking concierge services →</Link></li>
                <li><Link to="/explore" className="text-foreground/80 hover:text-foreground">Using AI smart search →</Link></li>
              </ul>
            </SectionReveal>
            <SectionReveal delay={0.05}>
              <h3 className="flex items-center gap-2 font-heading text-xl font-medium"><LifeBuoy size={18} className="text-champagne" /> Still need help?</h3>
              {sent ? (
                <div className="mt-4 rounded-2xl border border-border bg-card p-6 text-center">
                  <p className="font-medium">Thanks — we've got it.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Our team will reply by email.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-4 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className={inputCls} />
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={inputCls} />
                  </div>
                  <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c.t} value={c.t}>{c.t}</option>)}
                  </select>
                  <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} placeholder="What's going on?" className={inputCls} />
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="submit" disabled={submitting} className="flex-1 rounded-full bg-foreground py-3 text-sm font-medium text-background transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50">
                      {submitting ? "Sending…" : "Send to support"}
                    </button>
                    <Link to="/messages" className="flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium hover:bg-background">
                      <MessageSquare size={15} /> Chat with host
                    </Link>
                  </div>
                </form>
              )}
            </SectionReveal>
          </div>
        </div>
      </section>
    </div>
  );
}