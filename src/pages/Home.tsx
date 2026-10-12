import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown, ShieldCheck, Sparkles, Globe2 } from "lucide-react";
import { getListings } from "@/services";
import SearchBar from "@/components/search/SearchBar";
import CategoryChips from "@/components/listings/CategoryChips";
import ListingCard from "@/components/listings/ListingCard";
import PopularDestinations from "@/components/home/PopularDestinations";
import TestimonialsMarquee from "@/components/home/TestimonialsMarquee";
import SectionReveal from "@/components/ui/SectionReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { ListingCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, HERO_IMAGE, GEN_IMAGES } from "@/lib/constants";
import type { Listing } from "@/types/listing";

const HERO_IMG = HERO_IMAGE;

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 140]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.12]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);

  useEffect(() => {
    getListings()
      .then((res: Listing[]) => setListings(res || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCategorySelect = (c: string) => {
    setSelectedCategory(c);
  };

  const displayedListings = React.useMemo(() => {
    if (selectedCategory !== "All") {
      const byCat = listings.filter((l) => l.category === selectedCategory);
      return byCat.length > 0 ? byCat : listings.slice(0, 6);
    }
    const featured = listings.filter((l) => l.featured).slice(0, 6);
    return featured.length ? featured : listings.slice(0, 6);
  }, [listings, selectedCategory]);

  return (
    <div className="relative overflow-x-hidden">
      {/* 1. HERO WITH FILM-GRAIN TEXTURE & FLUID LUXURY TYPOGRAPHY */}
      <section className="relative h-[100svh] min-h-[660px] w-full overflow-hidden bg-background">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="A luxury cliffside villa overlooking the azure sea at sunset"
            className="h-full w-full object-cover"
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/75" />
          {/* Film grain texture */}
          <div className="absolute inset-0 film-grain opacity-60" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white backdrop-blur-md shadow-sm"
          >
            <Sparkles size={13} className="text-champagne-light" /> Hand-curated luxury sanctuaries
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-balance text-[clamp(2.75rem,7.5vw,5.75rem)] font-medium leading-[1.03] tracking-tight text-white drop-shadow-sm"
          >
            Find a place<br />you'll never want to leave.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-6 max-w-xl text-balance text-base text-white/85 sm:text-lg leading-relaxed drop-shadow-sm"
          >
            Villas, timber cabins, and skyline penthouses handpicked for the discerning traveler.
          </motion.p>
        </motion.div>

        {/* SEARCH BAR POSITIONED OVER HERO */}
        <div className="absolute inset-x-0 bottom-[-3.5rem] z-20 px-4 sm:bottom-6 sm:px-6">
          <div className="mx-auto max-w-4xl lg:max-w-5xl">
            <SearchBar />
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-1 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-white/70"
          >
            <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
            <ArrowDown size={13} />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. BROWSE BY CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-5 pt-36 pb-16 sm:px-8 sm:pt-44 sm:pb-20">
        <SectionReveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Browse by</span>
              <h2 className="mt-1 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Categories
              </h2>
            </div>
            <Link
              to={`/explore${selectedCategory !== "All" ? `?category=${selectedCategory}` : ""}`}
              className="group hidden items-center gap-1.5 text-sm font-medium text-foreground/75 hover:text-foreground sm:flex"
            >
              View all <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1} className="mt-8">
          <CategoryChips
            active={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </SectionReveal>
      </section>

      {/* 3. FEATURED STAYS GRID */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
        <SectionReveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Handpicked</span>
              <h2 className="mt-1 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {selectedCategory !== "All" ? `${selectedCategory} Stays` : "Featured Stays"}
              </h2>
            </div>
            <Link
              to={`/explore${selectedCategory !== "All" ? `?category=${selectedCategory}` : ""}`}
              className="group hidden items-center gap-1.5 text-sm font-medium text-foreground/75 hover:text-foreground sm:flex"
            >
              Explore all <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </SectionReveal>

        <div className="mt-10 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)
            : displayedListings.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
        </div>
      </section>

      {/* 4. POPULAR DESTINATIONS (8 HOVER-ENLARGE CARDS WITH SIBLING DIMMING) */}
      <PopularDestinations />

      {/* 5. CURATED COLLECTIONS */}
      <section className="border-y border-border/70 bg-secondary/30 py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal>
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inspirations</span>
              <h2 className="mt-1 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Curated Collections
              </h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg leading-relaxed">
                Three distinct perspectives on stillness, each chosen for architectural distinction and secluded settings.
              </p>
            </div>
          </SectionReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {COLLECTIONS.map((c, i) => (
              <SectionReveal key={c.id} delay={i * 0.1}>
                <Link
                  to={`/explore?category=${c.category}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-border/70 shadow-luxe transition-all duration-300 hover:shadow-luxe-lg"
                >
                  <img
                    src={c.category === "Beachfront" ? GEN_IMAGES.beachfront : c.category === "Cabins" ? GEN_IMAGES.cabin : GEN_IMAGES.santorini}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 scrim-card" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="text-xs font-semibold uppercase tracking-wider text-champagne-light">{c.subtitle}</p>
                    <h3 className="mt-1.5 font-heading text-2xl font-medium text-white sm:text-3xl">{c.title}</h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white/85">
                      Discover collection <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STATS & REPUTATION */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-10 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {[
            { value: 120, suffix: "+", label: "Hand-verified sanctuaries" },
            { value: 38, suffix: "", label: "Countries & private islands" },
            { value: 4.9, suffix: "★", label: "Average guest satisfaction", decimals: true },
          ].map((s, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div className="text-center pt-6 sm:pt-0">
                <div className="font-heading text-5xl font-medium tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-3 text-sm font-medium text-muted-foreground">{s.label}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* 7. INFINITE MOVING MARQUEE TESTIMONIALS (TWO SEAMLESS ROWS) */}
      <TestimonialsMarquee />

      {/* 8. LUXURY TRUST & SERVICE PROMISES */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Verified & Insured",
              desc: "Every property is personally vetted by our curation team and protected by Haven's comprehensive stay guarantee."
            },
            {
              icon: Globe2,
              title: "Global Human Concierge",
              desc: "A dedicated specialist in your timezone, arranging private aviation, ground transfers, and bespoke culinary requests."
            },
            {
              icon: Sparkles,
              title: "Fewer Than 3% Accepted",
              desc: "We rigorously filter thousands of listings to accept only properties with exceptional architecture and absolute privacy."
            },
          ].map((t, i) => (
            <SectionReveal key={i} delay={i * 0.08}>
              <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-luxe transition-all duration-300 hover:shadow-luxe-lg">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-champagne-dark dark:text-champagne-light">
                  <t.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 font-heading text-xl font-medium text-foreground">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* 9. INVITATION CTA */}
      <section className="relative overflow-hidden border-t border-border/70 bg-foreground text-background py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <SectionReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-1.5 text-xs font-medium tracking-wide text-background/90 backdrop-blur">
              <Sparkles size={13} /> The Haven Standard
            </span>
            <h2 className="mt-5 font-heading text-3xl font-medium tracking-tight sm:text-5xl text-background">
              Ready to find your quiet sanctuary?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-background/75 leading-relaxed">
              Browse our curated portfolio of private villas, mountain chalets, and coastal estates worldwide.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 shadow-lg">
                <Link to="/explore">Explore All Stays</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-background/30 text-background hover:bg-background/10">
                <Link to="/experiences">Browse Experiences</Link>
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
