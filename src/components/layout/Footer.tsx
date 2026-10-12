import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, Sparkles } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import { subscribeNewsletter } from "@/services";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");
      await subscribeNewsletter(email.trim(), "footer_dispatch");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Could not sign up at this moment. Please try again.");
    }
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionReveal>
          {/* Newsletter Section */}
          <div className="relative mb-16 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/80 to-secondary/30 p-8 sm:p-12">
            <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3 py-1 text-xs font-medium text-champagne-dark">
                  <Sparkles size={12} className="text-champagne" />
                  <span>The Haven Dispatch</span>
                </div>
                <h3 className="mt-3 font-heading text-2xl font-light tracking-tight text-foreground sm:text-3xl">
                  Curated escapes & architectural releases.
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Receive private invitations, seasonal retreat drops, and editorial field notes from our global scouts. No spam, ever.
                </p>
              </div>

              <div className="lg:col-span-5">
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300"
                    >
                      <CheckCircle2 size={24} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="text-sm font-medium">You're on the private guest list.</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Dispatches will be sent to <span className="font-semibold text-foreground">{email}</span>.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (status === "error") setStatus("idle");
                            }}
                            placeholder="Enter your email address"
                            className="w-full rounded-full border border-border/80 bg-background/90 py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-foreground/40 focus:ring-2 focus:ring-champagne/20"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                        >
                          {status === "loading" ? "Subscribing..." : "Join Dispatch"}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                      {status === "error" && (
                        <p className="text-xs text-destructive">{errorMessage}</p>
                      )}
                      <p className="text-[11px] text-muted-foreground/70">
                        By joining, you agree to receive curated updates. Unsubscribe anytime with one tap.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Links Grid */}
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