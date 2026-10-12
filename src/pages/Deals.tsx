import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tag, Sparkles, Check, ArrowRight, Clock } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/button";

interface DealOffer {
  id: string;
  badge: string;
  title: string;
  destination: string;
  savings: string;
  validUntil: string;
  code: string;
  image: string;
  description: string;
  perks: string[];
}

const DEALS: DealOffer[] = [
  {
    id: "deal-1",
    badge: "Complimentary Night",
    title: "Stay 4 Nights, Pay for 3 at Villa Calamian",
    destination: "Coron, Palawan",
    savings: "Save 25%",
    validUntil: "Valid through Nov 30",
    code: "PALAWAN4FOR3",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    description: "Enjoy an extra twilight over the Sulu Sea. Includes roundtrip speedboat transfer from Busuanga and private breakfast each morning.",
    perks: ["Complimentary 4th night", "Private airport speedboat transfer", "Daily champagne breakfast"]
  },
  {
    id: "deal-2",
    badge: "Seasonal Privilege",
    title: "Kyoto Autumn Foliage Sanctuary Package",
    destination: "Higashiyama, Kyoto",
    savings: "$400 Experience Credit",
    validUntil: "Valid through Dec 15",
    code: "KYOTOAUTUMN",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    description: "Private garden access and an exclusive $400 concierge credit toward private omakase or guided temple after-hours access.",
    perks: ["$400 Concierge Credit", "Early check-in & late checkout", "Welcome ceremonial matcha set"]
  },
  {
    id: "deal-3",
    badge: "Early Season Privilege",
    title: "Swiss Alpine Powder Escape",
    destination: "Zermatt, Switzerland",
    savings: "20% Off 5+ Nights",
    validUntil: "Valid for bookings before Nov 15",
    code: "ALPINESNOW20",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    description: "Reserve your luxury ski-in/ski-out timber chalet facing the Matterhorn with private sauna and daily fireside mulled wine.",
    perks: ["20% off extended stays", "Private ski equipment locker", "Complimentary evening hearth service"]
  },
  {
    id: "deal-4",
    badge: "Aegean Escape",
    title: "Santorini Sunset Villa Retreat",
    destination: "Oia, Greece",
    savings: "Free Catamaran Cruise",
    validUntil: "Valid through Oct 31",
    code: "AEGEANCRUISE",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    description: "Book 3 or more nights in our cliffside cave suites and receive a private semi-private 5-hour sunset catamaran cruise for two.",
    perks: ["Sunset catamaran cruise for two", "Daily Greek bakery breakfast", "Welcome bottle of Assyrtiko wine"]
  }
];

export default function Deals() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* HERO */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-28 lg:py-32">
        <div className="absolute inset-0 film-grain" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-4 py-1.5 text-xs font-medium tracking-wide text-champagne-dark dark:text-champagne-light">
                <Tag size={13} /> Exclusive Privileges
              </span>
              <h1 className="mt-5 font-heading text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Seasonal Privileges & Private Offers
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Hand-curated value for Haven guests. Reserved perks, complimentary nights, and bespoke resort credits for extraordinary getaways.
              </p>
            </div>
          </SectionReveal>

          {/* PRIVILEGES BAR */}
          <SectionReveal delay={0.1} className="mt-12">
            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-luxe md:grid-cols-4">
              {[
                { title: "Complimentary Breakfast", desc: "Farm-to-table breakfast included with every partner villa" },
                { title: "$200 Concierge Credit", desc: "Applicable to dining, private yachting, and spa experiences" },
                { title: "Flexible Cancellation", desc: "Peace of mind with full refund up to 7 days before check-in" },
                { title: "Dedicated Host", desc: "Personal on-site contact to arrange every fine detail" },
              ].map((perk, i) => (
                <div key={i} className="flex flex-col gap-1 border-border/60 pb-3 md:border-r md:last:border-r-0 md:px-4">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Sparkles size={14} className="text-champagne" /> {perk.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{perk.desc}</span>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* OFFERS LIST */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {DEALS.map((deal, idx) => (
            <SectionReveal key={deal.id} delay={idx * 0.08}>
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxe transition-all duration-300 hover:shadow-luxe-lg">
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                  <div className="absolute inset-0 scrim-card" />
                  <span className="absolute left-4 top-4 rounded-full bg-foreground/85 px-3 py-1 text-xs font-medium text-background backdrop-blur">
                    {deal.badge}
                  </span>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <span className="text-xs font-semibold uppercase tracking-wider">{deal.destination}</span>
                    <span className="rounded-full bg-champagne px-3 py-1 text-xs font-semibold text-foreground">
                      {deal.savings}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="font-heading text-2xl font-medium tracking-tight text-foreground">
                    {deal.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {deal.description}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-border/60 pt-4">
                    {deal.perks.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        <Check size={14} className="text-champagne shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> {deal.validUntil}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(deal.code)}
                        className="rounded-full border border-border bg-secondary/80 px-3.5 py-1.5 text-xs font-mono font-medium tracking-wider text-foreground hover:bg-secondary"
                        title="Click to copy promo code"
                      >
                        {copiedCode === deal.code ? "COPIED ✓" : deal.code}
                      </button>
                      <Button asChild size="sm">
                        <Link to="/explore">
                          Book Now <ArrowRight size={13} />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}

