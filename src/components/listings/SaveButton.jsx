import React, { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "@/lib/FavoritesContext";
import { cn } from "@/lib/utils";

export default function SaveButton({ listingId, className, size = 20 }) {
  const { isFavorited, toggle } = useFavorites();
  const [animating, setAnimating] = useState(false);
  const saved = isFavorited(listingId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggle(listingId);
    if (res?.needsAuth) {
      window.location.href = `/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (res?.favorited) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600);
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? "Remove from saved" : "Save this stay"}
      aria-pressed={saved}
      className={cn(
        "relative grid place-items-center rounded-full p-2 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-white/10",
        className
      )}
    >
      <motion.span
        animate={animating ? { scale: [1, 1.35, 0.9, 1] } : { scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Heart
          size={size}
          strokeWidth={2}
          className={cn(
            "transition-colors",
            saved ? "fill-rose-500 text-rose-500" : "fill-black/15 text-white dark:fill-white/20"
          )}
        />
      </motion.span>
    </button>
  );
}