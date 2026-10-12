import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryLightbox({ images, index, onClose, onIndex }) {
  const count = images.length;

  useEffect(() => {
    const onKey = (e) => {
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

  const go = (dir) => onIndex((index + dir + count) % count);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur"
      >
        <div className="flex items-center justify-between px-5 py-4 text-white">
          <span className="text-sm font-medium">{index + 1} / {count}</span>
          <button onClick={onClose} aria-label="Close gallery" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4">
          <motion.img
            key={index}
            src={images[index]}
            alt=""
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
            className="max-h-full max-w-full select-none rounded-2xl object-contain"
          />

          {count > 1 && (
            <>
              <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                <ChevronLeft size={22} />
              </button>
              <button onClick={() => go(1)} aria-label="Next" className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}