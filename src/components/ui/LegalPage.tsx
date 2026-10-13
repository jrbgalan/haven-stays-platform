import React from "react";
import { Download } from "lucide-react";
import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import SectionReveal from "@/components/ui/SectionReveal";
import { GEN_IMAGES } from "@/lib/constants";

interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

interface LegalPageProps {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
  note?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; to?: string }>;
  image?: string;
}

export default function LegalPage({ title, description, updated, sections, note, breadcrumbs, image }: LegalPageProps) {
  useSeo(title, description);
  return (
    <div>
      <PageHero
        breadcrumbs={breadcrumbs}
        title={title}
        subtitle={`Last updated ${updated}`}
        image={image || GEN_IMAGES.tuscany}
      />
      {note && (
        <div className="container-haven pt-6 sm:pt-8">
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 text-sm text-foreground/80">{note}</div>
        </div>
      )}
      <div className="container-haven grid gap-8 section-padding lg:grid-cols-[220px_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1 text-sm">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                {s.title}
              </a>
            ))}
            <button onClick={() => window.print()} className="mt-4 flex items-center gap-2 rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <Download size={14} /> Download as PDF
            </button>
          </nav>
        </aside>
        <div className="space-y-10">
          {sections.map((s, i) => (
            <SectionReveal key={s.id} delay={i * 0.02}>
              <section id={s.id} className="scroll-mt-24">
                <h2 className="font-heading text-2xl font-medium tracking-tight">{s.title}</h2>
                <div className="mt-3 space-y-3 leading-relaxed text-foreground/80">{s.body}</div>
              </section>
            </SectionReveal>
          ))}
        </div>
      </div>
    </div>
  );
}