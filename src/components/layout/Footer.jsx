import React from "react";
import { Link } from "react-router-dom";
import SectionReveal from "@/components/ui/SectionReveal";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionReveal>
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background">
                  <span className="font-heading text-base font-semibold leading-none">H</span>
                </span>
                <span className="font-heading text-xl font-medium tracking-tight">Haven</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                A curated collection of extraordinary stays, handpicked for the discerning traveler.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Discover</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link to="/explore" className="text-foreground/70 hover:text-foreground">All stays</Link></li>
                <li><Link to="/explore?category=Beachfront" className="text-foreground/70 hover:text-foreground">Beachfront</Link></li>
                <li><Link to="/explore?category=Villas" className="text-foreground/70 hover:text-foreground">Villas</Link></li>
                <li><Link to="/explore?category=Cabins" className="text-foreground/70 hover:text-foreground">Cabins</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Haven</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link to="/about" className="text-foreground/70 hover:text-foreground">About</Link></li>
                <li><Link to="/concierge" className="text-foreground/70 hover:text-foreground">Concierge</Link></li>
                <li><Link to="/press" className="text-foreground/70 hover:text-foreground">Press</Link></li>
                <li><Link to="/host" className="text-foreground/70 hover:text-foreground">Host with us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Support</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link to="/help" className="text-foreground/70 hover:text-foreground">Help center</Link></li>
                <li><Link to="/cancellation" className="text-foreground/70 hover:text-foreground">Cancellation</Link></li>
                <li><Link to="/privacy" className="text-foreground/70 hover:text-foreground">Privacy</Link></li>
                <li><Link to="/terms" className="text-foreground/70 hover:text-foreground">Terms</Link></li>
                <li><Link to="/report" className="text-foreground/70 hover:text-foreground">Report a concern</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} Haven · John Romeo Galan. Crafted as a portfolio flagship.</p>
            <p className="font-heading italic">Stay differently.</p>
          </div>
        </SectionReveal>
      </div>
    </footer>
  );
}