import React, { useRef, useState } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";
import { client } from "@/api/client";
import { cn } from "@/lib/utils";
import type { AISmartSearchResult } from "@/types/ai";

export interface SmartSearchProps {
  onResult?: (result: AISmartSearchResult | { error?: string } | null) => void;
}

export default function SmartSearch({ onResult }: SmartSearchProps) {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(false);
  const debounce = useRef<NodeJS.Timeout | number | null>(null);

  const run = async (query: string) => {
    if (!query.trim()) { onResult?.(null); setActive(false); return; }
    setBusy(true); setActive(true);
    try {
      const res = await client.functions.invoke("aiSmartSearch", { query });
      const d = res.data;
      if (d?.error) throw new Error(d.error);
      onResult?.(d.result || {});
    } catch (e: any) {
      onResult?.({ error: e.message });
    } finally {
      setBusy(false);
    }
  };

  const onChange = (v: string) => {
    setQ(v);
    if (debounce.current) clearTimeout(debounce.current as any);
    debounce.current = setTimeout(() => run(v), 650);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounce.current) clearTimeout(debounce.current as any);
    run(q);
  };

  const clear = () => { setQ(""); setActive(false); onResult?.(null); };

  return (
    <form onSubmit={submit} className="relative">
      <Sparkles size={16} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors", active ? "text-champagne" : "text-muted-foreground")} />
      <input
        value={q}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your perfect stay — e.g. 'quiet cabin for 4 with a hot tub in the mountains'"
        className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      {busy ? (
        <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
      ) : q ? (
        <button type="button" onClick={clear} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear AI search"><X size={15} /></button>
      ) : null}
    </form>
  );
}

