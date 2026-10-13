import React, { useState } from "react";
import { Newspaper, Mail, Copy, Check } from "lucide-react";
import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import SectionReveal from "@/components/ui/SectionReveal";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { createSupportTicket } from "@/services";

const NEWS = [
  { date: "Sep 2026", headline: "Haven raises Series B to expand its curated stay collection", summary: "The round will fund new destinations across the Mediterranean and a deeper concierge network in every city Haven operates." },
  { date: "Aug 2026", headline: "Introducing the Haven AI Concierge", summary: "A new assistant turns a feeling — 'quiet cabin, hot tub, mountains' — into a shortlist of vetted stays in seconds." },
  { date: "Jun 2026", headline: "Haven crosses 1,200 stays across 22 countries", summary: "The milestone marks a year of curated growth, with a 4.9 average guest rating maintained across the collection." },
  { date: "Apr 2026", headline: "New verification standard rolled out for every host", summary: "Identity, insurance, and in-person checks now apply across the platform, with results shown on each listing." },
  { date: "Feb 2026", headline: "Haven partners with sustainable hospitality groups", summary: "A new program highlights hosts meeting measurable environmental standards, with a leaf badge on qualifying stays." },
];

const FACTS = [
  { k: "Founded", v: "2023" },
  { k: "Headquarters", v: "Singapore" },
  { k: "Stays", v: "1,200+" },
  { k: "Countries", v: "22" },
  { k: "Employees", v: "48" },
  { k: "Avg. rating", v: "4.9 / 5" },
];

const BRAND_COLORS = [
  { name: "Ink", hex: "#121212" },
  { name: "Champagne", hex: "#C9A57B" },
  { name: "Sand", hex: "#F5F1EA" },
  { name: "Mist", hex: "#E8E2D8" },
];

const inputCls = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-foreground/40 focus:ring-2 focus:ring-accent/20";

function ColorSwatchCard({ name, hex }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div
      onClick={copy}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          copy();
        }
      }}
      className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary/60 cursor-pointer select-none"
    >
      <div className="flex items-center gap-3">
        <span
          className="h-11 w-11 rounded-xl shrink-0 border border-border/40 shadow-sm"
          style={{ backgroundColor: hex }}
        />
        <div>
          <span className="block text-sm font-medium text-foreground">{name}</span>
          <span className="block font-mono text-xs text-muted-foreground">{hex}</span>
        </div>
      </div>
      <button
        type="button"
        className="text-muted-foreground transition-colors hover:text-foreground p-1"
        aria-label={`Copy ${name} color code`}
      >
        {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
      </button>
    </div>
  );
}

export default function Press() {
  useSeo("Press", "Haven press kit — news, brand assets, key facts, and media contact.");
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", outlet: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { toast({ title: "Please sign in", description: "A press inquiry needs an account.", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      await createSupportTicket({
        userId: user.id,
        name: form.name,
        email: form.email,
        subject: "Press inquiry",
        message: `Outlet: ${form.outlet}\n\n${form.message}`,
      });
      setSent(true);
    } catch (err: any) {
      toast({ title: "Couldn't send inquiry", description: err?.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Press & Media"
        title="Press kit"
        subtitle="Assets, facts, and contacts for journalists covering Haven."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Press" }]}
      />

      {/* Featured in */}
      <section className="container-haven section-padding">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">Featured in</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-4 opacity-60">
            {["VOYAGE", "The Atlas", "MODERN STAY", "Departures", "Condé", "TRAVELER"].map((w) => (
              <span key={w} className="font-heading text-xl font-medium tracking-tight">{w}</span>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* Latest news */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-haven section-padding">
          <SectionReveal>
            <div className="section-header">
              <h2 className="font-heading text-3xl font-medium tracking-tight">Latest news</h2>
            </div>
          </SectionReveal>
          <div className="mt-6 divide-y divide-border">
            {NEWS.map((n, i) => (
              <SectionReveal key={i} delay={i * 0.03}>
                <article className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-champagne sm:w-24">{n.date}</span>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-medium">{n.headline}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{n.summary}</p>
                    <button className="mt-2 text-xs font-medium text-foreground underline-offset-4 hover:underline">Read more</button>
                  </div>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Brand assets */}
      <section id="brand-assets" className="container-haven section-padding scroll-mt-24">
        <SectionReveal>
          <div className="section-header">
            <h2 className="font-heading text-3xl font-medium tracking-tight">Brand assets</h2>
          </div>
        </SectionReveal>
        
        {/* Logo Card */}
        <SectionReveal delay={0.05}>
          <div className="mt-6 rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm">
            <h3 className="font-heading text-2xl font-medium">Logo</h3>
            <div className="mt-5 flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-foreground text-background shadow-sm">
                <span className="font-heading text-2xl font-bold">H</span>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-sm">
                <span className="font-heading text-2xl font-bold">H</span>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Wordmark and monogram available on request. Tap a color to copy its hex.</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BRAND_COLORS.map((c) => <ColorSwatchCard key={c.hex} {...c} />)}
            </div>
          </div>
        </SectionReveal>

        {/* Typography Card */}
        <SectionReveal delay={0.1}>
          <div className="mt-6 rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm">
            <h3 className="font-heading text-2xl font-medium">Typography</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Display & headings use <span className="font-heading font-medium text-foreground">Fraunces</span>, a contemporary serif with warmth. Body uses <span className="font-medium text-foreground">Inter</span> for clarity at every size.
            </p>
            <div className="mt-8 space-y-2">
              <p className="font-heading text-4xl sm:text-5xl font-medium tracking-tight text-foreground">Stay differently</p>
              <p className="text-sm text-muted-foreground">Aa Bb Cc — the quick brown fox jumps over the lazy dog.</p>
            </div>
          </div>
        </SectionReveal>

        {/* Key facts */}
        <SectionReveal delay={0.15}>
          <div className="mt-6 rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm">
            <h3 className="flex items-center gap-2 font-heading text-2xl font-medium"><Newspaper size={20} className="text-champagne" /> Key facts</h3>
            <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {FACTS.map((f) => (
                <div key={f.k}><p className="text-xs uppercase tracking-wide text-muted-foreground">{f.k}</p><p className="mt-1 font-heading text-xl font-medium">{f.v}</p></div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Media contact */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container-haven max-w-2xl section-padding">
          <SectionReveal>
            <div className="section-header">
              <h2 className="font-heading text-3xl font-medium tracking-tight">Media contact</h2>
              <p className="mt-3.5 text-muted-foreground">For interviews, assets, or press access, reach our team below.</p>
            </div>
          </SectionReveal>
          {sent ? (
            <SectionReveal>
              <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-foreground text-background"><Mail size={22} /></div>
                <h3 className="mt-4 font-heading text-xl font-medium">Inquiry sent</h3>
                <p className="mt-2 text-sm text-muted-foreground">Our press team will be in touch shortly.</p>
              </div>
            </SectionReveal>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={inputCls} />
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={inputCls} />
              </div>
              <input value={form.outlet} onChange={(e) => setForm({ ...form, outlet: e.target.value })} placeholder="Publication / outlet" className={inputCls} />
              <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="How can we help?" className={inputCls} />
              <button type="submit" disabled={submitting} className="w-full rounded-full bg-foreground py-3.5 text-sm font-medium text-background transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50">
                {submitting ? "Sending…" : "Send inquiry"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}