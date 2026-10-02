import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { CATEGORIES, AMENITIES, IMAGE_POOL } from "@/lib/constants";
import AIListingHelper from "@/components/ai/AIListingHelper";
import { cn } from "@/lib/utils";

const empty = {
  title: "", description: "", location: "", city: "", country: "",
  pricePerNight: 500, category: "Beachfront", bedrooms: 2, bathrooms: 2,
  maxGuests: 4, rating: 4.8, hostName: "", featured: false, amenities: [],
};

export default function ListingForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || empty);
  const [imageText, setImageText] = useState(
    (initial?.images || IMAGE_POOL[form.category?.toLowerCase()] || IMAGE_POOL.beachfront).join("\n")
  );

  useEffect(() => {
    if (!initial) {
      const pool = IMAGE_POOL[form.category?.toLowerCase()] || IMAGE_POOL.beachfront;
      setImageText(pool.join("\n"));
    }
  }, [form.category]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleAmenity = (a) =>
    setForm((f) => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] }));

  const submit = (e) => {
    e.preventDefault();
    const images = imageText.split("\n").map((s) => s.trim()).filter(Boolean);
    onSave({ ...form, pricePerNight: Number(form.pricePerNight), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), maxGuests: Number(form.maxGuests), rating: Number(form.rating), images });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-background p-6 sm:rounded-3xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-xl font-medium">{initial ? "Edit listing" : "New listing"}</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><X size={18} /></button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <L label="Title" full><input className="inp" value={form.title} onChange={(e) => set("title", e.target.value)} required /></L>
            <L label="Host name"><input className="inp" value={form.hostName} onChange={(e) => set("hostName", e.target.value)} /></L>
            <L label="Category">
              <select className="inp" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </L>
            <L label="Location"><input className="inp" value={form.location} onChange={(e) => set("location", e.target.value)} /></L>
            <L label="City"><input className="inp" value={form.city} onChange={(e) => set("city", e.target.value)} /></L>
            <L label="Country"><input className="inp" value={form.country} onChange={(e) => set("country", e.target.value)} /></L>
            <L label="Price / night ($)" type="number"><input type="number" className="inp" value={form.pricePerNight} onChange={(e) => set("pricePerNight", e.target.value)} /></L>
            <L label="Bedrooms" type="number"><input type="number" className="inp" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} /></L>
            <L label="Bathrooms" type="number"><input type="number" className="inp" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} /></L>
            <L label="Max guests" type="number"><input type="number" className="inp" value={form.maxGuests} onChange={(e) => set("maxGuests", e.target.value)} /></L>
            <L label="Rating (0-5)"><input type="number" step="0.1" min="0" max="5" className="inp" value={form.rating} onChange={(e) => set("rating", e.target.value)} /></L>
          </div>

          <L label="Description" full>
            <textarea className="inp" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </L>

          <L label="Image URLs (one per line)" full>
            <textarea className="inp" rows={3} value={imageText} onChange={(e) => setImageText(e.target.value)} />
          </L>

          <L label="Amenities" full>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <button type="button" key={a} onClick={() => toggleAmenity(a)} className={cn("rounded-full border px-3 py-1.5 text-xs", form.amenities.includes(a) ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary")}>
                  {a}
                </button>
              ))}
            </div>
          </L>

          <AIListingHelper form={form} setForm={setForm} />

          <label className="flex items-center gap-2.5">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-foreground" />
            <span className="text-sm font-medium">Feature on homepage</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-border py-3 text-sm font-medium hover:bg-secondary">Cancel</button>
            <button type="submit" className="flex-1 rounded-full bg-foreground py-3 text-sm font-medium text-background">{initial ? "Save changes" : "Create listing"}</button>
          </div>
        </form>

        <style>{`.inp{width:100%;border-radius:0.75rem;border:1px solid hsl(var(--border));background:hsl(var(--card));padding:0.6rem 0.8rem;font-size:0.875rem;outline:none}.inp:focus{box-shadow:0 0 0 2px hsl(var(--ring))}`}</style>
      </motion.div>
    </motion.div>
  );
}

function L({ label, children, full, type }) {
  return (
    <div className={cn(full && "sm:col-span-2")}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}