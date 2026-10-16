import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Camera } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/button";
import PhotoCredit from "@/components/ui/PhotoCredit";
import { getPhotos, imageUrl, type UnsplashPhoto } from "@/lib/photos";
import { useSeo } from "@/lib/seo";
import ExperienceCard from "@/components/experiences/ExperienceCard";
import { EXPERIENCES_DATA } from "@/lib/mockProductData";

const CATEGORIES = ["All", "Maritime & Yachting", "Culinary & Vineyards", "Wilderness & Alpine", "Wellness & Spa"];

export default function Experiences() {
  useSeo(
    "Curated Bespoke Experiences & Expeditions",
    "Private yacht charters, alpine helicopter picnics, dawn tea rituals, and immersive wildlife encounters."
  );

  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All" ? EXPERIENCES_DATA : EXPERIENCES_DATA.filter((e) => e.category === activeCategory);

  // Moments Masonry Gallery Photos
  const momentsPhotos = useMemo(() => {
    const list: Array<{ photo: UnsplashPhoto; title: string; location: string; span: string }> = [];
    const pool = [
      { topic: "sunset cruise", title: "Sunset Lagoon Sailing", location: "El Nido, Palawan", span: "col-span-12 sm:col-span-6 lg:col-span-4" },
      { topic: "hot air balloon", title: "Alpine Dawn Flight", location: "Swiss Alps", span: "col-span-12 sm:col-span-6 lg:col-span-8" },
      { topic: "snorkeling and diving", title: "Coral Garden Immersion", location: "Baa Atoll, Maldives", span: "col-span-12 sm:col-span-6 lg:col-span-4" },
      { topic: "spa and wellness", title: "Ayurvedic Water Ritual", location: "Ubud, Bali", span: "col-span-12 sm:col-span-6 lg:col-span-4" },
      { topic: "wine tasting", title: "Volcanic Cellar Tasting", location: "Oia, Santorini", span: "col-span-12 sm:col-span-6 lg:col-span-4" },
      { topic: "hiking adventure", title: "Glacier Ridge Trek", location: "Zermatt, Switzerland", span: "col-span-12 sm:col-span-6 lg:col-span-6" },
      { topic: "cultural tour", title: "Dawn Temple Walk", location: "Kyoto, Japan", span: "col-span-12 sm:col-span-6 lg:col-span-6" },
    ];

    pool.forEach((item) => {
      const p = getPhotos(item.topic, 1)[0];
      if (p) {
        list.push({ photo: p, title: item.title, location: item.location, span: item.span });
      }
    });

    return list;
  }, []);

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="relative overflow-hidden bg-background pt-10 pb-8 sm:pt-14 sm:pb-12 lg:pb-14">
        <div className="container-haven">
          <SectionReveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-champagne-dark dark:text-champagne-light">
                <Sparkles size={13} /> Bespoke Itineraries
              </span>
              <h1 className="mt-3 font-heading text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Experiences Far Beyond the Ordinary
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Handcrafted adventures led by local visionaries, private captains, and master artisans.
                Exclusively accessible to Haven guests.
              </p>
            </div>
          </SectionReveal>

          {/* CATEGORY CHIPS */}
          <SectionReveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-foreground text-background shadow-luxe"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/80 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* EXPERIENCES GRID (Each card has 3+ photos) */}
      <section className="container-haven section-padding-b">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exp, idx) => (
            <SectionReveal key={exp.id} delay={idx * 0.05}>
              <ExperienceCard experience={exp} />
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* MASONRY "MOMENTS" GALLERY SECTION */}
      <section className="border-t border-border/70 bg-card/40 py-16 sm:py-24">
        <div className="container-haven">
          <SectionReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne/30 bg-champagne/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-champagne-dark dark:text-champagne-light">
                <Camera size={13} /> Captured In Stillness
              </span>
              <h2 className="mt-3 font-heading text-3xl font-medium sm:text-4xl text-foreground">
                Moments of Wonder Across the Globe
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                Authentic encounters photographed by Haven travelers and Unsplash creators.
              </p>
            </div>
          </SectionReveal>

          {/* Masonry Grid */}
          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            {momentsPhotos.map((item, idx) => (
              <SectionReveal key={idx} delay={idx * 0.05} className={item.span}>
                <div
                  className="group relative h-72 sm:h-80 overflow-hidden rounded-3xl border border-border/80 shadow-luxe"
                  style={{ backgroundColor: item.photo.color }}
                >
                  <img
                    src={imageUrl(item.photo, 1200, 80)}
                    alt={item.photo.alt_text}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Top Photo Credit on Hover */}
                  <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PhotoCredit photo={item.photo} variant="badge" />
                  </div>

                  {/* Bottom Caption */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-champagne-light">
                      {item.location}
                    </span>
                    <h3 className="font-heading text-lg font-medium leading-snug drop-shadow-sm">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONCIERGE BANNER */}
      <section className="border-t border-border/70 bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <SectionReveal>
            <ShieldCheck size={36} className="mx-auto text-champagne" strokeWidth={1.5} />
            <h2 className="mt-4 font-heading text-3xl font-medium sm:text-4xl text-foreground">
              Desire a fully custom itinerary?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground leading-relaxed">
              Our bespoke concierge team arranges private aircraft, security, rare vintage acquisitions, and sequestered island takeovers.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/concierge">Consult Haven Concierge</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/explore">Explore Private Stays</Link>
              </Button>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
