import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-foreground text-background">
            <span className="font-heading text-lg font-semibold leading-none">H</span>
          </span>
          <span className="font-heading text-2xl font-medium tracking-tight">Haven</span>
        </div>
        <h1 className="mt-10 font-heading text-[clamp(4rem,18vw,9rem)] font-medium leading-none tracking-tight">404</h1>
        <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">
          This page has wandered off the map. Let's get you back to somewhere beautiful.
        </p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-95">
          <Compass size={16} /> Return home
        </Link>
      </motion.div>
    </div>
  );
}