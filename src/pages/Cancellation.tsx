import React, { useMemo, useState } from "react";
import { ShieldCheck, Clock, CalendarX, RotateCcw } from "lucide-react";
import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import SectionReveal from "@/components/ui/SectionReveal";
import { formatCurrency } from "@/lib/format";
import { GEN_IMAGES } from "@/lib/constants";

const POLICIES = [
  {
    id: "flexible", name: "Flexible", icon: ShieldCheck,
    desc: "Full refund up to 24 hours before check-in. Best for plans that might shift.",
    cutoff: 1, refundPct: 100, color: "text-emerald-500",
    timeline: [{ at: "Anytime", t: "Full refund", on: true }, { at: "Within 24h", t: "No refund", on: false }],
  },
  {
    id: "moderate", name: "Moderate", icon: Clock,
    desc: "Full refund up to 5 days before check-in. A balance of flexibility and commitment.",
    cutoff: 5, refundPct: 100, color: "text-champagne",
    timeline: [{ at: "5+ days before", t: "Full refund", on: true }, { at: "Within 5 days", t: "No refund", on: false }],
  },
  {
    id: "strict", name: "Strict", icon: CalendarX,
    desc: "50% refund up to 7 days before check-in. For dates you're locking in.",
    cutoff: 7, refundPct: 50, color: "text-foreground",
    timeline: [{ at: "7+ days before", t: "50% refund", on: true }, { at: "Within 7 days", t: "No refund", on: false }],
  },
];

const inputCls = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-foreground/40 focus:ring-2 focus:ring-accent/20";

export default function Cancellation() {
  useSeo("Cancellation", "Haven cancellation policies — Flexible, Moderate, and Strict — with a refund timeline and calculator.");
  const [policy, setPolicy] = useState("flexible");
  const [checkIn, setCheckIn] = useState("");
  const [cancelDate, setCancelDate] = useState("");
  const [total, setTotal] = useState(1000);

  const result = useMemo(() => {
    if (!checkIn || !cancelDate) return null;
    const days = Math.round((new Date(checkIn).getTime() - new Date(cancelDate).getTime()) / 86400000);
    const p = POLICIES.find((x) => x.id === policy);
    let refund = 0;
    if (p && days >= p.cutoff) refund = (total * p.refundPct) / 100;
    return { days, refund, pct: p && refund > 0 ? p.refundPct : 0, name: p?.name || policy };
  }, [checkIn, cancelDate, total, policy]);

  return (
    <div>
      <PageHero
        eyebrow="Cancellation"
        title="Plans change. Here's how refunds work."
        subtitle="Every stay lists one of three policies. Know what you're entitled to before you book."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Cancellation" }]}
        image={GEN_IMAGES.provence}
      />

      {/* Policy cards */}
      <section className="container-haven section-padding">
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {POLICIES.map((p, i) => (
            <SectionReveal key={p.id} delay={i * 0.05}>
              <div className={`h-full rounded-2xl border bg-card p-6 ${policy === p.id ? "border-foreground shadow-luxe" : "border-border"}`}>
                <div className="flex items-center gap-3">
                  <p.icon size={20} className={p.color} strokeWidth={1.5} />
                  <h3 className="font-heading text-xl font-medium">{p.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <div className="mt-5 space-y-2">
                  {p.timeline.map((t, ti) => (
                    <div key={ti} className="flex items-center gap-2 text-sm">
                      <span className={`h-2 w-2 rounded-full ${t.on ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                      <span className="text-muted-foreground">{t.at}</span>
                      <span className="ml-auto font-medium">{t.t}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setPolicy(p.id)} className={`mt-5 w-full rounded-full py-2.5 text-sm font-medium transition-colors ${policy === p.id ? "bg-foreground text-background" : "border border-border hover:bg-secondary"}`}>
                  {policy === p.id ? "Selected" : "Use in calculator"}
                </button>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Refund calculator */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-haven max-w-3xl section-padding">
          <SectionReveal>
            <div className="section-header">
              <h2 className="flex items-center gap-2 font-heading text-3xl font-medium tracking-tight"><RotateCcw size={22} className="text-champagne" /> Refund calculator</h2>
              <p className="mt-3.5 text-muted-foreground">Pick a policy, your check-in, and when you'd cancel to estimate your refund.</p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.05}>
            <div className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Policy</label>
                <select value={policy} onChange={(e) => setPolicy(e.target.value)} className={inputCls}>
                  {POLICIES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Booking total ($)</label>
                <input type="number" min="0" value={total} onChange={(e) => setTotal(Number(e.target.value))} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Check-in date</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cancellation date</label>
                <input type="date" value={cancelDate} onChange={(e) => setCancelDate(e.target.value)} className={inputCls} />
              </div>
            </div>
          </SectionReveal>
          {result && (
            <SectionReveal delay={0.1}>
              <div className="mt-5 rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{result.name} policy · {result.days} days before check-in</p>
                    <p className="mt-1 font-heading text-3xl font-medium">{formatCurrency(result.refund)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Refund</p>
                    <p className="font-heading text-2xl font-semibold text-champagne">{result.pct}%</p>
                  </div>
                </div>
                {result.refund === 0 && <p className="mt-3 text-sm text-muted-foreground">Cancelling this late forfeits the booking under the {result.name} policy.</p>}
              </div>
            </SectionReveal>
          )}
        </div>
      </section>

      {/* Info sections */}
      <section className="container-haven max-w-3xl section-padding">
        <div className="space-y-8">
          {[
            { t: "How to cancel a booking", p: "Open My Trips, find your booking, and choose Cancel. The estimated refund is shown before you confirm, based on the listing's policy and how far ahead you're cancelling." },
            { t: "Host cancellations", p: "If a host must cancel, we'll help you find a comparable stay or issue a full refund. Repeated host cancellations affect a host's standing on Haven." },
            { t: "Extenuating circumstances", p: "For emergencies, illness, or events beyond your control, contact support with details. We review these case by case and may refund outside the standard policy." },
            { t: "Appointment cancellations & rescheduling", p: "Viewings can be rescheduled or cancelled from My Trips up to a few hours before the slot. A confirmation dialog protects you from accidental cancellations." },
          ].map((s, i) => (
            <SectionReveal key={i} delay={i * 0.03}>
              <div className="border-b border-border pb-6">
                <h3 className="font-heading text-xl font-medium">{s.t}</h3>
                <p className="mt-2 leading-relaxed text-foreground/80">{s.p}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}