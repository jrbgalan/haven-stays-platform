import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown, Quote, ShieldCheck, Sparkles, Globe2 } from "lucide-react";
import { client } from "@/api/client";
import SearchBar from "@/components/search/SearchBar";
import CategoryChips from "@/components/listings/CategoryChips";
import ListingCard from "@/components/listings/ListingCard";
import SectionReveal from "@/components/ui/SectionReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import StarRating from "@/components/ui/StarRating";
import { ListingCardSkeleton } from "@/components/ui/Skeleton";
import { COLLECTIONS, HERO_IMAGE, GEN_IMAGES } from "@/lib/constants";
import type { Listing } from "@/types/listing";

const HERO_IMG = HERO_IMAGE;

export default function Home() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 140]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.12]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);

  useEffect(() => {
    client.entities.Listing.list("-rating", 12)
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
    <div>
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="A luxury villa overlooking the sea at golden hour"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white backdrop-blur"
          >
            <Sparkles size={13} className="text-champagne" /> Curated luxury stays
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-balance text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[1.02] tracking-tight text-white"
          >
            Find a place<br />you'll never want to leave.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-5 max-w-xl text-balance text-base text-white/80 sm:text-lg"
          >
            Handpicked villas, cabins, and penthouses in the world's most beautiful places.
          </motion.p>
        </motion.div>

        <div className="absolute inset-x-0 bottom-[-1.5rem] z-20 px-5 sm:bottom-8">
          <div className="mx-auto max-w-3xl">
            <SearchBar />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-white/70"
          >
            <span className="text-[11px] uppercase tracking-widest">Scroll</span>
            <ArrowDown size={14} />
          </motion.div>
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <SectionReveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Browse by</p>
              <h2 className="mt-1 font-heading text-3xl font-medium tracking-tight sm:text-4xl">Categories</h2>
            </div>
            <Link
              to={`/explore${selectedCategory !== "All" ? `?category=${selectedCategory}` : ""}`}
              className="group hidden items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground sm:flex"
            >
              View all <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </SectionReveal>
        <SectionReveal delay={0.1} className="mt-6">
          <CategoryChips
            active={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </SectionReveal>
      </section>

      {/* FEATURED GRID */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionReveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Handpicked</p>
              <h2 className="mt-1 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
                {selectedCategory !== "All" ? `${selectedCategory} stays` : "Featured stays"}
              </h2>
            </div>
            <Link
              to={`/explore${selectedCategory !== "All" ? `?category=${selectedCategory}` : ""}`}
              className="group hidden items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground sm:flex"
            >
              Explore all <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </SectionReveal>

        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)
            : displayedListings.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionReveal>
            <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">Curated collections</h2>
            <p className="mt-2 max-w-lg text-muted-foreground">Three ways to wander, each chosen for a distinct kind of beauty.</p>
          </SectionReveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {COLLECTIONS.map((c, i) => (
              <SectionReveal key={c.id} delay={i * 0.1}>
                <Link to={`/explore?category=${c.category}`} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl">
                  <img
                    src={c.category === "Beachfront" ? GEN_IMAGES.beachfront : c.category === "Cabins" ? GEN_IMAGES.cabin : GEN_IMAGES.santorini}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-champagne">{c.subtitle}</p>
                    <h3 className="mt-1 font-heading text-2xl font-medium text-white">{c.title}</h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/80">
                      Discover <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS / TRUST */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { value: 120, suffix: "+", label: "Handpicked stays" },
            { value: 38, suffix: "", label: "Countries" },
            { value: 4.9, suffix: "★", label: "Average rating", decimals: true },
          ].map((s, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div className="text-center">
                <div className="font-heading text-5xl font-medium tracking-tight sm:text-6xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <SectionReveal>
            <Quote size={32} className="mx-auto text-champagne" />
            <blockquote className="mt-6 font-heading text-balance text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
              "Haven is the only place we look now. Every stay has felt considered, private, and quietly extraordinary."
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background font-medium">A</div>
              <div className="text-left">
                <p className="text-sm font-medium">Amara Okafor</p>
                <StarRating value={5} size={12} className="mt-0.5" />
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Verified & insured", desc: "Every property is vetted by our team and backed by Haven's guarantee." },
            { icon: Globe2, title: "Global concierge", desc: "A human, on call, in your timezone — from booking to checkout." },
            { icon: Sparkles, title: "Only the remarkable", desc: "We accept fewer than 3% of properties reviewed. Quality over quantity." },
          ].map((t, i) => (
            <SectionReveal key={i} delay={i * 0.08}>
              <div className="rounded-3xl border border-border bg-card p-7">
                <t.icon size={22} className="text-champagne" strokeWidth={1.5} />
                <h3 className="mt-4 font-medium">{t.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
