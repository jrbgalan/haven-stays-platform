import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { client } from "@/api/client";
import { useToast } from "@/components/ui/use-toast";
import type { AIListingHelperInput, AIListingHelperResult } from "@/types/ai";

export interface AIListingHelperProps {
  form: {
    category?: string;
    location?: string;
    city?: string;
    country?: string;
    amenities?: string[];
    title?: string;
    description?: string;
    pricePerNight?: number;
    [key: string]: any;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function AIListingHelper({ form, setForm }: AIListingHelperProps) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState("");

  const generate = async () => {
    setBusy(true);
    try {
      const payload: AIListingHelperInput = {
        category: form.category,
        location: `${form.location || form.city || ""} ${form.country || ""}`.trim(),
        amenities: form.amenities || [],
        photoNotes: notes,
      };

      const res = await client.functions.invoke("aiListingHelper", payload);
      const d = res.data;
      if (d?.error) throw new Error(d.error);
      const r: AIListingHelperResult = d.result || {};
      setForm((f: any) => ({
        ...f,
        title: r.title || f.title,
        description: r.description || f.description,
        pricePerNight: r.suggestedPriceMin || f.pricePerNight,
      }));
      toast({ title: "AI draft added", description: `Suggested ${r.suggestedPriceMin}–${r.suggestedPriceMax}/night` });
    } catch (e: any) {
      toast({ title: "AI error", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-champagne/40 bg-champagne/5 p-4">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-champagne" />
        <p className="text-sm font-medium">AI listing helper</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Generate a title, description and price from your amenities.</p>
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Photo notes (optional) — e.g. 'ocean view, sunset balcony'"
        className="mt-3 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="button"
        onClick={generate}
        disabled={busy}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-sm font-medium text-background disabled:opacity-50"
      >
        {busy ? <><Loader2 size={15} className="animate-spin" /> Generating…</> : <><Sparkles size={15} /> Generate with AI</>}
      </button>
    </div>
  );
}

