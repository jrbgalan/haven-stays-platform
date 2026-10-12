import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, UtensilsCrossed, Camera, Trees, Wine, Gem, Footprints } from "lucide-react";
import { cn } from "@/lib/utils";

const CAT_STYLE = {
  "Eat & Drink": { icon: UtensilsCrossed, grad: "from-amber-500/80 to-rose-500/60" },
  Attractions: { icon: Camera, grad: "from-sky-500/80 to-indigo-500/60" },
  Nature: { icon: Trees, grad: "from-emerald-500/80 to-teal-500/60" },
  Nightlife: { icon: Wine, grad: "from-violet-500/80 to-fuchsia-500/60" },
  "Hidden Gems": { icon: Gem, grad: "from-champagne to-amber-700/70" },
};

export default function PlaceCard({ place, index = 0 }) {
  const [saved, setSaved] = useState(false);
  const s = CAT_STYLE[place.category] || CAT_STYLE["Hidden Gems"];
  const Icon = s.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className={cn("relative h-32 bg-gradient-to-br", s.grad)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
        <Icon size={30} className="absolute left-4 top-4 text-white/90" strokeWidth={1.5} />
        <button
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? "Unsave place" : "Save place"}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/25 text-white backdrop-blur transition-transform hover:scale-110 active:scale-90"
        >
          <Heart size={15} className={cn("transition-all", saved && "fill-white")} />
        </button>
        <span className="absolute bottom-3 left-4 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          {place.category}
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-medium leading-tight">{place.name}</h4>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Footprints size={12} className="text-champagne" />
          {place.walkingMin ? `${place.walkingMin} min walk` : `${(place.distanceKm || 0).toFixed(1)} km away`}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/75">{place.description}</p>
      </div>
    </motion.div>
  );
}