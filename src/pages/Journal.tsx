import React, { useState } from "react";
import { BookOpen, Clock, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  excerpt: string;
  image: string;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    id: "journal-1",
    title: "Silence and Cedar: The Art of Living in a Kyoto Machiya",
    category: "Architecture",
    readTime: "6 min read",
    date: "October 8, 2026",
    author: "Hiroshi Takahashi",
    authorRole: "Architectural Historian",
    excerpt: "How 200-year-old wooden lattice screens, internal tsuboniwa gardens, and shadow play create the ultimate antidote to modern noise.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1400&q=80",
    featured: true
  },
  {
    id: "journal-2",
    title: "The Mediterranean Off-Season: Why Solitude is Santorini’s Greatest Luxury",
    category: "Travel Essay",
    readTime: "5 min read",
    date: "September 24, 2026",
    author: "Elena Rostova",
    authorRole: "Haven Travel Editor",
    excerpt: "When the summer crowds recede, the Cycladic caldera reveals its true temper: crisp sea air, quiet volcanic vineyards, and undisturbed sunsets.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "journal-3",
    title: "Designing for Stillness: The Bamboo Pavilion at Miniloc",
    category: "Design & Craft",
    readTime: "7 min read",
    date: "September 12, 2026",
    author: "Gabriel Santos",
    authorRole: "Principal, Studio Hiyas",
    excerpt: "Crafting a carbon-negative private sanctuary on Palawan’s limestone cliffs that bends with ocean typhoons and breathes with sea currents.",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "journal-4",
    title: "High Altitude Terroir: Swiss Alpine Micro-Farming at 2,000m",
    category: "Gastronomy",
    readTime: "4 min read",
    date: "August 30, 2026",
    author: "Mathias Keller",
    authorRole: "Culinary Contributor",
    excerpt: "Meeting the generational cheesemakers and wild botanical distillers crafting Michelin-caliber delicacies under the shadow of the Matterhorn.",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "journal-5",
    title: "The Barefoot Philosophy: How Siargao Redefined Tropical Rest",
    category: "Slow Living",
    readTime: "5 min read",
    date: "August 18, 2026",
    author: "Corinne De Vera",
    authorRole: "Cultural Anthropologist",
    excerpt: "Why discerning travelers are trading gold-leaf banquet halls for open-air timber stilt houses and morning tidal walks.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "journal-6",
    title: "Shadows in Stone: Restoring 16th-Century Tuscan Watchtowers",
    category: "Restoration",
    readTime: "8 min read",
    date: "July 29, 2026",
    author: "Matteo Bellini",
    authorRole: "Conservation Architect",
    excerpt: "The painstaking 4-year journey of rehabilitating a medieval stone fortress into a light-filled hillside private sanctuary.",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80"
  }
];

import { useSeo } from "@/lib/seo";

export default function Journal() {
  useSeo(
    "The Haven Journal — Architecture & Field Notes",
    "Essays on architecture, design, quietude, gastronomy, and mindful luxury travel from global editorial contributors."
  );
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  const featured = ARTICLES.find((a) => a.featured) || ARTICLES[0];
  const rest = ARTICLES.filter((a) => a.id !== featured.id);

  return (
    <div className="min-h-screen pt-20">
      {/* HERO */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-28 lg:py-32">
        <div className="absolute inset-0 film-grain" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionReveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-4 py-1.5 text-xs font-medium tracking-wide text-champagne-dark dark:text-champagne-light">
                <BookOpen size={13} /> The Haven Journal
              </span>
              <h1 className="mt-5 font-heading text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Stories of Stillness, Craft & Architecture
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Essays on slow living, master builders, and the quiet sanctuaries shaping the future of intentional travel.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* FEATURED STORY */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <SectionReveal>
          <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxe transition-all duration-300 hover:shadow-luxe-lg md:grid md:grid-cols-12 md:items-stretch">
            <div className="relative aspect-[16/10] overflow-hidden bg-muted md:col-span-7 md:aspect-auto">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 scrim-card md:hidden" />
              <span className="absolute left-4 top-4 rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background backdrop-blur">
                Featured Essay
              </span>
            </div>

            <div className="flex flex-col justify-between p-8 sm:p-12 md:col-span-5">
              <div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider text-champagne-dark dark:text-champagne-light">
                    {featured.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {featured.readTime}
                  </span>
                </div>

                <h2 className="mt-4 font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  {featured.title}
                </h2>

                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>
              </div>

              <div className="mt-8 border-t border-border/60 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{featured.author}</p>
                    <p className="text-xs text-muted-foreground">{featured.authorRole}</p>
                  </div>
                  <Button variant="default" size="sm" className="group/btn">
                    Read Essay <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ARTICLES GRID */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article, idx) => (
            <SectionReveal key={article.id} delay={idx * 0.06}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxe transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe-lg">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 scrim-card" />
                  <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-champagne-light">
                    {article.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="mt-3 font-heading text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-champagne-dark dark:group-hover:text-champagne-light">
                    {article.title}
                  </h3>

                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                    <span className="text-xs font-medium text-foreground">{article.author}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:underline">
                      Read <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* DISPATCH NEWSLETTER BOX */}
      <section className="border-t border-border/70 bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <SectionReveal>
            <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-luxe sm:p-12">
              <Mail size={32} className="mx-auto text-champagne" strokeWidth={1.5} />
              <h2 className="mt-4 font-heading text-3xl font-medium text-foreground sm:text-4xl">
                The Haven Dispatch
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base leading-relaxed">
                Receive private dispatches twice monthly: unlisted estate additions, architectural profiles, and seasonal culinary invitations.
              </p>

              {subscribed ? (
                <div className="mt-8 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                  <CheckCircle2 size={18} /> You are subscribed to The Haven Dispatch. Welcome.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your private email"
                    required
                    className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne"
                  />
                  <Button type="submit" size="lg">
                    Join Dispatch
                  </Button>
                </form>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}

