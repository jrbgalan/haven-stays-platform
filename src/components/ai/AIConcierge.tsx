import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, ArrowRight } from "lucide-react";
import { client } from "@/api/client";
import SmartImage from "@/components/ui/SmartImage";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ConciergeMessage, AITripConciergeResult } from "@/types/ai";
import type { Listing } from "@/types/listing";

const SUGGESTIONS = [
  "Plan a romantic 3-day getaway under $300/night near the beach",
  "A quiet cabin for 4 with a hot tub in the mountains",
  "A city penthouse for a business trip next week",
];

export default function AIConcierge() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client.entities.Listing.list().then((res: Listing[]) => setListings(res)).catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  const ask = async (q?: string) => {
    const prompt = (q ?? input).trim();
    if (!prompt || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: prompt }]);
    setBusy(true);
    try {
      const res = await client.functions.invoke("aiTripConcierge", { prompt });
      const d = res.data;
      if (d?.error) throw new Error(d.error);
      const r: AITripConciergeResult = d.result || {};
      const matched = (r.listingIds || []).map((id) => listings.find((l) => l.id === id)).filter((l): l is Listing => Boolean(l));
      setMessages((m) => [...m, { role: "ai", intro: r.intro, itinerary: r.itinerary || [], listings: matched }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "ai", error: e.message || "Something went wrong. Please try again." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 18 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="AI trip concierge"
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-foreground px-4 py-3.5 text-sm font-medium text-background shadow-luxe-lg sm:bottom-6 sm:right-6"
      >
        <Sparkles size={18} className="text-champagne" />
        <span className="hidden sm:inline">Ask Haven AI</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-0" />
            <motion.div
              initial={{ y: "100%", opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.6 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 flex h-[80vh] flex-col rounded-t-3xl border border-border bg-background shadow-luxe-lg sm:inset-y-4 sm:right-4 sm:left-auto sm:h-auto sm:w-[420px] sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background"><Sparkles size={17} className="text-champagne" /></span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">Haven AI Concierge</p>
                    <p className="text-xs text-muted-foreground">Plan your perfect trip</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary" aria-label="Close"><X size={16} /></button>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                {messages.length === 0 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 text-sm leading-relaxed text-foreground/80">
                      Hi! Tell me about the trip you're dreaming of and I'll find matching stays and plan an itinerary.
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Try asking</p>
                      {SUGGESTIONS.map((s) => (
                        <button key={s} onClick={() => ask(s)} className="block w-full rounded-xl border border-border px-3.5 py-2.5 text-left text-sm hover:bg-secondary">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i}>
                    {m.role === "user" ? (
                      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-foreground px-4 py-2.5 text-sm text-background">{m.text}</div>
                    ) : m.error ? (
                      <div className="rounded-2xl rounded-tl-sm border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{m.error}</div>
                    ) : (
                      <div className="space-y-3">
                        {m.intro && <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 text-sm leading-relaxed text-foreground/85">{m.intro}</div>}
                        {m.listings && m.listings.length > 0 && (
                          <div className="space-y-2">
                            {m.listings.map((l) => (
                              <Link key={l.id} to={`/listing/${l.id}`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 hover:bg-secondary">
                                <SmartImage src={(l.images || [])[0]} alt={l.title} className="h-12 w-16 shrink-0 rounded-lg" />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium">{l.title}</p>
                                  <p className="truncate text-xs text-muted-foreground">{l.location}, {l.country}</p>
                                  <p className="text-xs"><span className="font-semibold">{formatCurrency(l.pricePerNight)}</span> night</p>
                                </div>
                                <ArrowRight size={14} className="text-muted-foreground" />
                              </Link>
                            ))}
                          </div>
                        )}
                        {m.itinerary && m.itinerary.length > 0 && (
                          <div className="rounded-2xl border border-border bg-card p-4">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggested itinerary</p>
                            <ol className="space-y-3">
                              {m.itinerary.map((d, j) => (
                                <li key={j} className="flex gap-3">
                                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-foreground text-xs font-medium text-background">{d.day}</span>
                                  <div>
                                    <p className="text-sm font-medium">{d.title}</p>
                                    <p className="text-xs leading-relaxed text-muted-foreground">{d.description}</p>
                                  </div>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><Sparkles size={10} className="text-champagne" /> AI-generated</p>
                      </div>
                    )}
                  </div>
                ))}
                {busy && (
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 text-sm text-muted-foreground">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.15 }} className="h-1.5 w-1.5 rounded-full bg-foreground/50" />
                      ))}
                    </span>
                    Planning your trip…
                  </div>
                )}
              </div>

              <div className="border-t border-border p-4">
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
                    rows={1}
                    placeholder="Describe your ideal trip…"
                    className="max-h-28 flex-1 resize-none rounded-2xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button onClick={() => ask()} disabled={busy || !input.trim()} className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform", busy || !input.trim() ? "bg-muted text-muted-foreground" : "bg-foreground text-background hover:scale-105 active:scale-95")} aria-label="Send">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

