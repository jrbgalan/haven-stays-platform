import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Gem, HandHeart, Leaf, Compass, CalendarCheck, Sparkles } from "lucide-react";
import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import SectionReveal from "@/components/ui/SectionReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { HERO_IMAGE } from "@/lib/constants";

const VALUES = [
  { icon: ShieldCheck, t: "Trust", d: "Every stay is verified, insured, and held to a standard we'd accept for our own families." },
  { icon: Gem, t: "Craft", d: "We choose places with a point of view — architecture, light, and detail that turn a stay into a memory." },
  { icon: HandHeart, t: "Hospitality", d: "Behind every door is a host who cares. We make sure the experience matches the address." },
  { icon: Leaf, t: "Sustainability", d: "Thoughtful travel, lighter footprints. We favor hosts who tread gently on their corner of the world." },
];

const STEPS = [
  { icon: Compass, t: "Discover", d: "Search by mood, not just map. Our AI concierge turns a feeling into a shortlist." },
  { icon: CalendarCheck, t: "Book", d: "Transparent pricing, instant availability, and a confirmation in seconds — no surprises." },
  { icon: Sparkles, t: "Experience", d: "Arrive to a place that's ready. Message your host, book a viewing, let concierge handle the rest." },
];

const TEAM = [
  { name: "Eleanor Vance", role: "Founder & CEO", bio: "Former hospitality director with a weakness for old buildings and long lunches." },
  { name: "Marcus Reed", role: "Head of Curation", bio: "Architect by training; visits every shortlisted stay in person." },
  { name: "Priya Nair", role: "Head of Product", bio: "Believes good software disappears so the place can shine." },
  { name: "Tomás Herrera", role: "Lead Engineer", bio: "Keeps the booking engine honest and the double-bookings impossible." },
  { name: "Aiko Tanaka", role: "Guest Experience", bio: "Your first message and your last impression are both hers." },
  { name: "Daniel Okafor", role: "Host Partnerships", bio: "Builds relationships with the people behind the doors." },
];

export default function About() {
  useSeo("About", "Haven is a curated collection of extraordinary stays, handpicked for the discerning traveler. Our story, values, and team.");
  return (
    <div className="pt-16">
      <PageHero
        eyebrow="About Haven"
        title="Stay differently."
        subtitle="A curated collection of extraordinary stays, handpicked for travelers who care where they wake up."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
        image={HERO_IMAGE}
      />

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <SectionReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">Our story</p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl font-medium tracking-tight sm:text-4xl">
            We started with a simple frustration: the most beautiful places were the hardest to find.
          </h2>
          <div className="mt-6 grid gap-6 text-lg leading-relaxed text-foreground/80 sm:grid-cols-2">
            <p>Haven began as a private list shared between friends — the kind of stays you only hear about by word of mouth. A clifftop cabin, a city loft with a story, a beach house that somehow felt like home.</p>
            <p>Today that list is a platform, but the principle hasn't changed. Every stay is chosen, every host is known, and every booking is treated like it matters — because to the person arriving, it does.</p>
          </div>
        </SectionReveal>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <SectionReveal><h2 className="font-heading text-3xl font-medium tracking-tight">What we value</h2></SectionReveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <SectionReveal key={v.t} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <v.icon size={22} className="text-champagne" strokeWidth={1.5} />
                  <h3 className="mt-4 font-heading text-lg font-medium">{v.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 text-center sm:grid-cols-4">
          {[
            { v: 1200, s: "+", l: "Stays hosted" },
            { v: 38, s: "", l: "Destinations" },
            { v: 22, s: "", l: "Countries" },
            { v: 4.9, s: "", l: "Avg. guest rating" },
          ].map((c, i) => (
            <SectionReveal key={c.l} delay={i * 0.05}>
              <div>
                <div className="font-heading text-4xl font-medium tracking-tight sm:text-5xl">
                  <AnimatedCounter value={c.v} suffix={c.s} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.l}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <SectionReveal><h2 className="font-heading text-3xl font-medium tracking-tight">How it works</h2></SectionReveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <SectionReveal key={s.t} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background text-sm font-semibold">{i + 1}</span>
                    <s.icon size={20} className="text-champagne" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-medium">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <SectionReveal><h2 className="font-heading text-3xl font-medium tracking-tight">The people behind the doors</h2></SectionReveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m, i) => (
            <SectionReveal key={m.name} delay={i * 0.04}>
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary font-heading text-2xl font-medium text-foreground/70">{m.name.charAt(0)}</div>
                <h3 className="mt-4 font-heading text-lg font-medium">{m.name}</h3>
                <p className="text-sm text-champagne">{m.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-8">
          <SectionReveal>
            <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">Find your next stay</h2>
            <p className="mx-auto mt-3 max-w-xl text-background/70">A curated collection is waiting. Start with a feeling, end with an address.</p>
            <Link to="/explore" className="mt-6 inline-flex items-center rounded-full bg-background px-7 py-3.5 text-sm font-medium text-foreground transition-transform hover:scale-[1.02] active:scale-95">
              Explore stays
            </Link>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}