import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";

export default function PageHero({ eyebrow, title, subtitle, breadcrumbs, image }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.10),transparent_55%)]" />
      {image && (
        <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      )}
      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {b.to ? (
                  <Link to={b.to} className="hover:text-foreground">{b.label}</Link>
                ) : (
                  <span className="text-foreground/80">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight size={12} className="opacity-50" />}
              </span>
            ))}
          </nav>
        )}
        <SectionReveal>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">{eyebrow}</p>}
          <h1 className="mt-3 font-heading text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-4 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">{subtitle}</p>}
        </SectionReveal>
      </div>
    </section>
  );
}