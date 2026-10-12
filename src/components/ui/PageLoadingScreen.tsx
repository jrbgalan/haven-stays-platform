import React from "react";
import { motion } from "framer-motion";

export interface PageLoadingScreenProps {
  message?: string;
  submessage?: string;
}

export default function PageLoadingScreen({
  message = "Haven",
  submessage = "Preparing sanctuary…",
}: PageLoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center"
      >
        {/* Monogram Crest with breathing aura */}
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.35, 0.7, 0.35],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: "easeInOut",
            }}
            className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-champagne/30 via-champagne/10 to-champagne/30 blur-md"
          />

          <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-champagne/30 bg-card shadow-luxe-lg">
            <span className="font-heading text-3xl font-semibold text-champagne-dark dark:text-champagne-light">
              H
            </span>
          </div>
        </div>

        {/* Text */}
        <h2 className="mt-5 font-heading text-xl font-medium tracking-tight text-foreground">
          {message}
        </h2>
        <p className="mt-1 text-xs tracking-widest uppercase text-muted-foreground">
          {submessage}
        </p>

        {/* Minimal Progress Line */}
        <div className="mt-6 h-0.5 w-28 overflow-hidden rounded-full bg-secondary">
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              ease: "easeInOut",
            }}
            className="h-full w-12 rounded-full bg-champagne"
          />
        </div>
      </motion.div>
    </div>
  );
}
