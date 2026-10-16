import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import PhotoCredit from "@/components/ui/PhotoCredit";
import { getAllPhotos, type UnsplashPhoto } from "@/lib/photos";

interface GalleryLightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
  onIndex: (newIndex: number) => void;
  photos?: UnsplashPhoto[];
}

export default function GalleryLightbox({
  images,
  index,
  onClose,
  onIndex,
  photos,
}: GalleryLightboxProps) {
  const count = images.length;
  const allKnownPhotos = useMemo(() => getAllPhotos(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % count);
      if (e.key === "ArrowLeft") onIndex((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, count, onClose, onIndex]);

  const go = (dir: number) => onIndex((index + dir + count) % count);

  // Match photo object for the active image
  const currentPhoto = useMemo(() => {
    if (photos && photos[index]) return photos[index];
    const currentUrl = images[index] || "";
    return allKnownPhotos.find(
      (p) => currentUrl.includes(p.id) || currentUrl.startsWith(p.urls.raw.split("?")[0])
    ) || null;
  }, [photos, index, images, allKnownPhotos]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 text-white border-b border-white/10">
          <span className="text-sm font-medium tracking-wide text-white/80">
            {index + 1} / {count}
          </span>
          <button
            onClick={onClose}
            aria-label="Close gallery"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Image Stage */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-2">
          <motion.img
            key={index}
            src={images[index]}
            alt={`Gallery photograph ${index + 1}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1);
              else if (info.offset.x > 80) go(-1);
            }}
            className="max-h-[80vh] max-w-full select-none rounded-2xl object-contain shadow-2xl"
          />

          {count > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Previous photograph"
                className="absolute left-4 sm:left-8 grid h-12 w-12 place-items-center rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md hover:bg-black/80 hover:scale-105 active:scale-95 transition-all"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next photograph"
                className="absolute right-4 sm:right-8 grid h-12 w-12 place-items-center rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md hover:bg-black/80 hover:scale-105 active:scale-95 transition-all"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {/* Bottom Attribution Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-6 py-3.5 text-white border-t border-white/10 bg-black/40">
          <div>
            {currentPhoto ? (
              <PhotoCredit photo={currentPhoto} variant="badge" />
            ) : (
              <span className="text-xs text-white/50">Haven Curated Photography</span>
            )}
          </div>
          <span className="text-xs text-white/50 hidden sm:inline">
            Use arrow keys or swipe to navigate · ESC to close
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}